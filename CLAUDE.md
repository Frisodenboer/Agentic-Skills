# Agentic Skills

A Claude Code plugin marketplace. Every skill lives in `skills/<slug>/` and is installed individually; there is no application code here.

```
.claude-plugin/marketplace.json   catalog — one entry per installable skill
skills/<slug>/SKILL.md            the skill, plus optional scripts/ references/ assets/
README.md                         user-facing skill index
```

## The marketplace contract

Four rules keep entries working. Breaking any of them breaks installs silently.

- **`"source": "./"`** on every entry — entries point at the repo root, and `"skills": ["./skills/<slug>"]` names the one directory that ships.
- **`"strict": false`** is required. No skill has a `plugin.json`, so the marketplace entry is the complete definition. Without this flag the entry is rejected for the missing manifest.
- **Never add `"version"`.** Versions resolve from the git commit SHA, so a push ships an update. A literal version pins the skill and users stop receiving updates until the string changes.
- **A directory with no entry is not distributed.** This is the mechanism for keeping a skill local (see Unlisted skills).

Validate after every catalog change — it checks the schema, duplicate names, and that each `skills` path resolves:

```bash
claude plugin validate .
```

## Skill authoring rules

- **Slug is lowercase letters, numbers, and hyphens.** The directory name, the `name:` frontmatter, and the marketplace `name` must all be the same string. `Graf1` or `Pen-Ink-BW` fail skill-name validation.
- **The file is `SKILL.md`, uppercase.** A lowercase `skill.md` works on Windows and disappears on a case-sensitive filesystem. Windows renames are case-insensitive, so fix it in two steps: `mv skill.md _tmp.md && mv _tmp.md SKILL.md`.
- **`description:` is the trigger surface.** Claude decides whether to invoke a skill from this field alone, so it should name the task, the synonyms, and the literal phrases a user would type. The art skills here are the model to copy.
- **Skills are self-contained.** Keep supporting files inside `skills/<slug>/`: `scripts/` for executables, `references/` for docs read at runtime, `requirements.txt` for Python deps. Never reference a path outside the skill directory — plugins are copied to a cache on install, so `../shared` will not resolve on someone else's machine.
- **Bundled binary assets belong in the skill.** A skill that composites or reads an image must ship it (as `pen-coastal` and `graf3` ship their reference JPEGs). A skill pointing at an asset that lives only in your projects will install broken.

`/create-skill <name>` scaffolds all of this and registers the entry.

## Runtime paths and credentials

Skills write into the *invoking project*, not into this repo. `public/generated-images/`, `public/Artwork/`, `public/out/`, `public/converted_to_webp/` are conventional output locations in the consuming project — do not create them here.

Two env vars are needed by the generation skills: `GEMINI_API_KEY` for `nano-image`, `ZHIPU_API_KEY` for `zai-image`. Every art-style skill renders through `nano-image`, so they all inherit the Gemini requirement.

`.gitignore` excludes `credentials.json`, `token.json`, and `config.json` — `gbp-post` uses local OAuth credentials that must never be committed.

## Unlisted skills

Five directories in `skills/` have no marketplace entry on purpose. They load in this repo and ship to nobody:

| Skill | Why |
| :--- | :--- |
| `gbp-post` | Tied to one Google Business Profile; needs local OAuth credentials |
| `sign-artwork` | Applies the NOOL signature from `public/Artwork/nool-signature.png`, a brand asset that does not ship |
| `frame-mockup` | Composites into `public/generated-images/Nool_Base_Frame_Etsy.jpg`, likewise not shipped |
| `frontend-design` | Anthropic's Apache-2.0 skill, vendored for local use rather than redistributed |
| `skill-creator` | Anthropic's Apache-2.0 skill; `create-skill` covers this repo's structure instead |

Before listing a skill, check it does not depend on an unshipped asset or a private account. That check is what put the middle three in this table.

Eight of the art-style skills end with a "sign via the sign-artwork skill" step and name `public/Artwork/nool-signature.png` directly: `abstract-expressionist`, `atmospheric-cityscape`, `exp-world-map`, `graf1`, `graf2`, `graf3`, `pastoral-frame`, `pen-coastal`. Neither the skill nor the PNG ships, so that final step cannot run on an external install — the artwork still generates, it just arrives unsigned. `pen-ink-bw` opts out explicitly and is delivered unsigned by design.

## Adding a skill

1. `/create-skill <slug>`, or create `skills/<slug>/SKILL.md` with `name` and `description` frontmatter by hand.
2. Append an entry to `.claude-plugin/marketplace.json` — unless it should stay local.
3. Add a row to the README table, in the matching section (Art styles / Image tooling / Content and review).
4. `claude plugin validate .`
5. Commit and push to `main`.

## Publishing

Pushing to `main` is the release. There is no build, no tag, and no version bump — the commit SHA is the version, so a merged change is live for anyone who runs `/plugin marketplace update agent-marketplace`. Treat a push as a publish, and confirm before making one.
