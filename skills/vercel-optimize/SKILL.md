---
name: vercel-optimize
description: Audit and cut what a Vercel-hosted Next.js app spends on every deploy — database egress, ISR writes, image transformations, function CPU, deployment storage — BEFORE deploying, rather than discovering it as a blocked database. Use whenever the user mentions Vercel or Neon usage, quotas, limits, billing, "exceeded", "limit reached", a database refusing connections, a build that feels slow or expensive, a first deploy or a redeploy after a quota reset, or says "vercel optimize", "cut the egress", "why is my build so expensive", "will this blow the free tier". Also use proactively after any change that adds prerendered routes, images, or a data loader that reads a whole table — those costs never appear in a build log and surface only as an outage.
---

# Vercel optimize — find the per-deploy drain before it finds you

## Why this exists

On 2026-09-18 this shop could not deploy. The build died at the first
migration with `PostgresError 53000: Your account or project has exceeded the
quota`, and shortly after, the database refused connections outright.

The cause was not the schema, the SQL, the connection string or the plan being
too small. It was this: `loadProducts` issues eight full-table reads, React's
`cache()` dedupes only *within one request*, and a production build renders 267
paths — each its own request. So every deploy pulled the entire catalogue out
of the database roughly two hundred times. **190.7 MB of egress per build**,
measured. Neon Free allows about 5 GB of network transfer a month. That is ~29
deploys, and eleven days of ordinary work spends it.

The database held **zero product rows** when it was cut off. No migration had
ever succeeded. The builds alone spent the entire allowance, and then the
provider stopped accepting connections — which on a live shop is not a slow
page, it is the whole storefront down, because a metered database at its limit
refuses *connections*, not merely writes.

Three properties made it invisible, and they are what this skill exists to
defeat:

- **Nothing in the build log mentions egress.** A build that moves 190 MB and
  one that moves 14 MB look identical.
- **The failure is delayed and displaced.** The cost accrues over weeks and
  surfaces as an unrelated-looking error in a completely different subsystem.
- **The obvious debugging move — deploy again and watch — spends more of the
  exact resource that is exhausted.**

## The two rules

**Measure, never estimate.** Every number in this skill came from a counter,
not a calculation. "The catalogue is probably about a megabyte" is how a 190 MB
build gets waved through. If a figure matters, measure it; if it cannot be
measured, say so rather than inventing it.

**Never use a deploy as the test.** Deploys are the thing being audited. They
consume build minutes, egress, ISR writes and deployment storage, and when a
quota is already blown they cannot even run. Everything below works locally,
against a local database, for free. Reserve the deploy for after the audit
passes.

## The audit

Work in this order — it runs cheapest-first, and an early finding often
explains a later one. Skip a step only when the project plainly has no such
surface, and say which you skipped and why.

### 1. Read the live quota position first

Before optimising anything, find out which resource is actually scarce and how
much headroom is left. Optimising the wrong metric is wasted work.

- **Database**: the provider's own usage page (Neon: project → Usage; it
  itemises compute, storage, history and **network transfer** separately).
  Note the period start, because these reset monthly from the project's
  creation date, not the 1st.
- **Vercel**: `<team>/~/usage`, plus the Usage panel on the project overview —
  it flags "Exceeded free resources" with per-metric bars (deployment storage,
  image transformations, ISR writes, fluid active CPU).

If the user cannot reach these, or they live in another account, ask rather
than guess. A screenshot of the usage page is a perfectly good input.

What matters is the **ratio**, not the absolute: divide the monthly allowance
by the per-deploy cost measured below. That is how many deploys the plan
affords. Under ~20 the project is one busy week from an outage.

### 2. Measure database egress per build

```bash
bash .claude/skills/vercel-optimize/scripts/measure-build-egress.sh
```

It diffs the database container's network TX counter across a real production
build — the same quantity the provider meters — and prints megabytes. Run it
before a change and after, with `--label`, because one number alone means
nothing. Pass `--container` / `--build-cmd` if the defaults do not match.

Rough reading for a catalogue-sized site: **under ~20 MB healthy, over ~100 MB
means something is being re-read per path.**

### 3. Find the per-page full-table reads

This is the usual culprit, and it hides behind a `cache()` that looks like it
already solved the problem.

```bash
grep -rn "cache(" src/lib/*.ts
grep -rn "\.select()" src/lib/*.ts        # select() = every column, incl. jsonb
```

For each loader ask: **does a page call this, and does the build prerender many
pages?** If yes, `cache()` is not enough — it is per-request, and every
prerendered path is a separate request. The tell is a loader doing several
full-table selects, called from a route with `generateStaticParams`.

Check the prerendered path count in the build output (`Generating static pages
(N/N)`). Multiply: *N × the loader's payload* is the per-deploy cost.

### 4. Check the other metered surfaces

Each is cheap to check and each has its own failure mode — see
`references/metered-surfaces.md` for what blows each one, how to check it, and
what the fix looks like. In short:

- **ISR writes** — revalidate TTLs and how many paths carry them.
- **Image transformations** — distinct `next/image` variants, not page views.
- **Deployment storage** — accumulated build artefacts across deploys; this
  repo's sibling account sits at 41.7 GB against a 10 GB limit.
- **Function CPU / invocations** — dynamic routes and connection pools.
- **Build minutes** — the seed chain runs on every deploy.

### 5. Fix, then re-measure

A fix that is not re-measured is a hypothesis. Re-run step 2 and quote both
numbers.

## The fix patterns

**Build-phase memo** — for reads that run once per page over data that cannot
change during a build. `src/lib/build-cache.ts` (`buildMemo`) is the
implementation in this repo: it memoises across the process, but **only** when
`NEXT_PHASE === "phase-production-build"`.

```ts
const loadProducts = buildMemo(loadProductsPerRequest);   // cache() underneath
```

The phase gate is the whole design, not a detail. A build reads a database
nobody is writing to — seeds finish before `next build` starts, no admin
mutation can land mid-build — so every path is entitled to one snapshot. At
runtime the same cache would be a genuine bug: a module-level cache outlives
requests in a warm serverless instance, so an admin price change would keep
serving the stale catalogue until the instance recycled, and `revalidateAll()`
could not clear it. **Never lift that gate to "make it faster in production".**

Result here: 190.7 MB → 14.3 MB, −92.5%, byte-identical route table, and static
generation went from 4.5s to 3.0s.

**Narrow the select** — `db.select()` fetches every column including jsonb
descriptions and spec blobs. A loader feeding a listing that renders a title,
price and image is moving ten times what it needs. Narrow it to the columns the
consumer actually reads.

**Question the per-path fan-out itself** — if a page needs the whole catalogue
only to pick eight related products, the cheaper fix may be a targeted query
rather than a cached full read.

**Do not reach for shorter ISR TTLs as a fix** — they are a cost control in
this repo, not a freshness mechanism. Freshness comes from `revalidateAll()`.
Shortening a TTL increases ISR writes *and* database reads. Read the ISR
landmine in `CLAUDE.md` before touching one.

## Reporting

Lead with the number and the ratio, because that is the decision:

```
DB egress per build : 190.7 MB  (measured, container TX diff)
Monthly allowance   : ~5 GB     (Neon Free)
Deploys affordable  : ~29
Verdict             : one busy week from an outage
```

Then: what is spending it, the fix, and the re-measured figure. Name anything
you could not measure rather than implying it passed — an unchecked surface is
an unknown, not a pass.

## Landmines in this repo

- **The `NEXT_PHASE` gate on `buildMemo` must stay.** See above; a cross-request
  cache at runtime serves stale prices past `revalidateAll()`.
- **Adding a new per-page full-table read re-opens the drain.** Any new loader
  a prerendered route calls needs `buildMemo` for the same reason the existing
  three have it.
- **The two Google feeds stay at 1h ISR on purpose** — a stale price there is a
  Merchant Center disapproval. Do not "optimise" that TTL upward.
- **Port 5433, not 5432.** The sibling Fourdomus project binds 5432 on this
  machine and a collision silently measures the wrong database. `docker ps`
  first — the measurement script names the container explicitly for this
  reason.
- **`pnpm build` runs tests, migrations and nine seed scripts before
  `next build`.** Use `build:ci` (`next build` alone) when measuring render
  cost, so seed writes do not contaminate the read measurement.
