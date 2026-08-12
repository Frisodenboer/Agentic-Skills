---
name: create-skill
description: Scaffold a new skill in the Agentic Skills marketplace structure. Use when the user wants to create a new skill, add a plugin, or build a new capability for the marketplace.
argument-hint: <skill-name> [short description]
disable-model-invocation: true
---

Create a new skill in this Agentic Skills marketplace repository.

## Arguments

Parse `$ARGUMENTS` as follows:
- **First word**: the skill name (lowercase letters, numbers, and hyphens only — this becomes the slug)
- **Remaining words**: optional short description hint

If the skill name is missing or invalid, ask the user for it before proceeding.

Check that `skills/<slug>/` does not already exist. If it does, stop and tell the user.

## Step 1 — Gather information

If the user hasn't provided a clear description and purpose in `$ARGUMENTS`, ask the following (you may ask all at once):

1. **Description** (one sentence, ≤120 chars): What does this skill do and when should Claude use it?
2. **Invocation**: Should this be user-invoked only (add `disable-model-invocation: true`), auto-invoked by Claude, or both?
3. **Argument hint** (optional): What arguments does the user pass? e.g. `<topic>` or `[filename] [format]`
4. **Core instructions**: What step-by-step instructions should Claude follow when this skill runs?
5. **Listed publicly**: Should the skill be listed in the marketplace so others can install it? Skills that depend on private credentials or a specific business account usually should not be.

## Step 2 — Create the skill

Using the skill name `<slug>` derived from the first argument, create:

### `skills/<slug>/SKILL.md`

```markdown
---
name: <slug>
description: <description — used by Claude to decide when to invoke this skill>
argument-hint: <argument-hint if applicable>
[disable-model-invocation: true   ← only if user-invoked only]
---

<Core instructions gathered in Step 1>
```

Skills are self-contained directories. If the skill needs supporting files, keep them inside `skills/<slug>/`:
- `scripts/` — executable helpers
- `references/` — documentation the skill reads at runtime
- `requirements.txt` — Python dependencies, if any

Never reference paths outside the skill directory. Plugins are copied to a cache on install, so a path like `../shared` will not resolve on the user's machine.

## Step 3 — Register it in the marketplace

Skip this step if the user chose not to list the skill publicly. An unlisted skill still lives in `skills/` and works in this repo, but no other directory in `skills/` loads for an entry unless it is named explicitly, so it ships to nobody.

Otherwise read `.claude-plugin/marketplace.json` and append to the `plugins` array:

```json
{
  "name": "<slug>",
  "description": "<one-sentence description>",
  "source": "./",
  "skills": ["./skills/<slug>"],
  "strict": false,
  "category": "<category>",
  "keywords": ["<keyword>", "<keyword>"],
  "repository": "https://github.com/Frisodenboer/Agentic-Skills"
}
```

Two things to preserve:

- **`strict: false`** is required. These entries have no `plugin.json`, so the marketplace entry is the complete definition of the skill.
- **Do not add a `version` field.** Versions are resolved from the git commit SHA. Adding a version pins the skill, and users then stop receiving updates until the string changes.

## Step 4 — Validate

Run the validator from the repository root:

```bash
claude plugin validate .
```

Fix any errors before finishing. It checks the marketplace schema, duplicate names, and source paths.

## Step 5 — Confirm

Print a summary:

```
Created skill: <slug>
  skills/<slug>/SKILL.md
  .claude-plugin/marketplace.json updated   (omit if unlisted)

Test locally:  /plugin marketplace update agent-marketplace
               /plugin install <slug>@agent-marketplace
Invoke with:   /<slug>
```

Remind the user that the skill is only installable by others once the change is pushed to GitHub.
