# Agentic Skills

A Claude Code marketplace of agent skills, each installable on its own.

## Install

```
/plugin marketplace add Frisodenboer/Agentic-Skills
/plugin install youtube-titles@agent-marketplace
```

Run `/plugin marketplace update agent-marketplace` to pick up new skills and updates.

## Skills

| Skill | Invoke | What it does |
| :--- | :--- | :--- |
| `youtube-titles` | `/youtube-titles <topic>` | Generates 10 browse-optimized, SEO-friendly YouTube titles (max 54 chars) for a video topic |
| `create-skill` | `/create-skill <name> [description]` | Scaffolds a new skill in this repo's structure and registers it in the marketplace |

## Layout

```
.claude-plugin/marketplace.json   catalog — one entry per installable skill
skills/<name>/SKILL.md            the skill itself, plus any scripts/ or references/
```

Each marketplace entry points at the repository root and names one skill directory:

```json
{
  "name": "youtube-titles",
  "source": "./",
  "skills": ["./skills/youtube-titles"],
  "strict": false
}
```

`strict: false` makes the marketplace entry the complete definition, so skills need no `plugin.json`. Because each entry names its own path, a directory in `skills/` that no entry references is not distributed — `skills/gbp-post` is kept this way, since it is specific to one Google Business Profile and needs local OAuth credentials.

No entry declares a `version`. Versions resolve from the git commit SHA, so pushing a commit is enough to ship an update. Adding a `version` would pin the skill and stop updates until the string changes.

## Adding a skill

Run `/create-skill <name>`, or by hand: create `skills/<name>/SKILL.md` with `name` and `description` frontmatter, add an entry to `.claude-plugin/marketplace.json`, then validate:

```bash
claude plugin validate .
```
