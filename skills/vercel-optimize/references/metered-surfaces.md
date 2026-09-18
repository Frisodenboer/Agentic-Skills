# Metered surfaces — what blows each one, and how to check it locally

Read this when the audit in `SKILL.md` reaches step 4, or when a usage page
flags a metric and you need to know what actually drives it.

Every entry follows the same shape: **what it meters**, **what silently
inflates it**, **how to check without deploying**, **what the fix looks like**.
The failure modes differ more than the names suggest — some degrade, some bill,
and one takes the whole site offline.

## Contents

1. [Database network transfer (egress)](#1-database-network-transfer-egress)
2. [Database compute](#2-database-compute)
3. [Database storage and history](#3-database-storage-and-history)
4. [ISR writes](#4-isr-writes)
5. [Image transformations](#5-image-transformations)
6. [Deployment storage](#6-deployment-storage)
7. [Function invocations and active CPU](#7-function-invocations-and-active-cpu)
8. [Build minutes](#8-build-minutes)

---

## 1. Database network transfer (egress)

**Meters** bytes the database sends back to callers. Reads, essentially —
writes travel the other way and are mostly not counted.

**Silently inflated by** prerendering. A `next build` renders every static path
as its own request, so a per-page loader is not called once, it is called N
times. React's `cache()` looks like protection and is not: it is request-scoped
by design. `db.select()` compounds it by fetching every column, including jsonb
blobs no listing renders.

**The reason this one is the most dangerous of the list:** at the limit, a
managed Postgres stops accepting *connections*. Not slower queries — refused
connections, which means the live site is down, not degraded. It is also the
metric least visible in any log.

**Check** with `scripts/measure-build-egress.sh` (container TX counter, diffed
across a build). For a per-loader figure, sum `JSON.stringify(rows).length`
across one call — within ~1.5× of wire bytes, good enough for ranking.

**Fix** with a build-phase memo (`buildMemo`), narrower selects, or a targeted
query instead of a full read. Measured here: 190.7 MB → 14.3 MB.

## 2. Database compute

**Meters** time the database compute is *awake*, usually in CU-hours.

**Silently inflated by** anything holding a connection open, because an idle
compute auto-suspends after a few minutes but a connected one never does. A
long-running local dev server pointed at the production database is the classic
case; so is a connection pool in a warm serverless instance.

**Check** the provider usage page. Sanity anchor: this project burned only 2.06
CU-hrs in eleven days, so compute is rarely the binding constraint for a site
of this size. If it is high while traffic is low, something is holding a
connection.

**Fix** by not pointing long-lived processes at the production database, and by
bounding the pool (`src/lib/db.ts` caps at 4 for a documented reason — read the
comment there before changing it).

## 3. Database storage and history

**Meters** the data itself, plus the retained WAL/branch history used for
point-in-time restore.

**Silently inflated by** long history retention on a busy table, and by
branches that were created and forgotten.

**Check** the provider usage page. A useful cross-check: an empty database that
reports tens of MB is normal — that is system catalogues, not your data. If
storage looks large against a small catalogue, look at history retention and
stale branches before suspecting the tables.

**Fix** by shortening history retention or deleting dead branches. Rarely the
problem for a catalogue site.

## 4. ISR writes

**Meters** each time a route revalidates and writes a new cache entry.

**Silently inflated by** short `revalidate` TTLs multiplied by the number of
paths carrying them. A 5-minute TTL on a 196-path route is not "fresher", it is
196 writes every five minutes, plus the database reads that feed them.

**Check** by reading the `revalidate` exports against the prerendered path
counts in the build output:

```bash
grep -rn "export const revalidate" src/app | sort
```

**Fix**: in this repo, do not. TTLs here are deliberately long backstops and
freshness comes from `revalidateAll()` on mutation. The two Google feeds are
pinned at 1h on purpose — a stale price there is a Merchant Center
disapproval, which costs more than the writes. Read the ISR landmine in
`CLAUDE.md` before changing any of them.

## 5. Image transformations

**Meters** distinct source-image × size × format transformations, cached
afterwards. It counts *variants*, not page views — a million views of one
already-transformed image is one transformation.

**Silently inflated by** adding source images, and by widening the set of
`sizes`/breakpoints so each source spawns more variants. A catalogue import is
the spike: 182 product photos × several widths × two formats.

**Check** by counting sources and the distinct widths requested:

```bash
ls public/products | wc -l
grep -rn "sizes=" src/components src/app | head -30
```

**Fix** by trimming the `sizes` list to widths actually used at breakpoints, and
by not re-uploading images under new filenames (a new filename is a new source
and re-spends every variant).

## 6. Deployment storage

**Meters** accumulated build artefacts and cached deployments across *all*
deployments retained, not just the live one.

**Silently inflated by** deploy frequency. Nothing about a single deploy looks
expensive; a hundred previews each retaining their build output is how an
account reaches 41.7 GB against a 10 GB limit — which is exactly where this
repo's sibling account sits.

**Check** the Vercel usage page; it is the metric most likely to be already
over on a long-lived hobby account.

**Fix** by deleting old deployments and pruning preview branches. It does not
block a database, but it does count against the plan and can block deploys.

## 7. Function invocations and active CPU

**Meters** dynamic (non-prerendered) route executions and the CPU they actually
burn.

**Silently inflated by** routes that render dynamically without anyone
intending it. A route that awaits `searchParams` is dynamic (`ƒ` in the build
output) no matter what `revalidate` it exports — `/[locale]/shop` in this repo
is exactly that, and its `revalidate = 300` is inert.

**Check** the build output's route table: `ƒ` is dynamic, `●` prerendered, `○`
static. Anything unexpectedly `ƒ` deserves a look.

**Fix** by removing the dynamic input where it was accidental. Where it is
deliberate (search, cart, checkout), leave it — those routes must be dynamic.

## 8. Build minutes

**Meters** wall-clock build time.

**Silently inflated by** work bolted onto the build script. This repo runs the
full test suite, migrations and nine seed scripts before `next build` on every
deploy.

**Check** the timestamps in the deploy log; each phase is visible.

**Fix**: mostly leave it. The seed chain is the deployment mechanism here — the
committed seed files are the source of truth for the catalogue, so running them
is the point, not overhead. Cutting the *database* cost of that chain is
worthwhile; cutting the chain itself is not.
