---
name: create-skill
description: Scaffold a new skill in the Agentic Skills marketplace structure. Use when the user wants to create a new skill, add a plugin, or build a new capability for the marketplace.
argument-hint: <skill-name> [short description]
disable-model-invocation: true
allowed-tools: Read, Write, Bash
---

Create a new skill in this Agentic Skills marketplace repository.

## Arguments

Parse `$ARGUMENTS` as follows:
- **First word**: the skill name (lowercase letters, numbers, and hyphens only — this becomes the slug)
- **Remaining words**: optional short description hint

If the skill name is missing or invalid, ask the user for it before proceeding.

## Step 1 — Gather information

If the user hasn't provided a clear description and purpose in `$ARGUMENTS`, ask the following (you may ask all at once):

1. **Description** (one sentence, ≤120 chars): What does this skill do and when should Claude use it?
2. **Invocation**: Should this be user-invoked only (add `disable-model-invocation: true`), auto-invoked by Claude, or both?
3. **Argument hint** (optional): What arguments does the user pass? e.g. `<topic>` or `[filename] [format]`
4. **Core instructions**: What step-by-step instructions should Claude follow when this skill runs?

## Step 2 — Create the file structure

Using the skill name `<slug>` derived from the first argument, create these files:

### `plugins/<slug>-plugin/.claude-plugin/plugin.json`

```json
{
  "name": "<slug>",
  "description": "<one-sentence description>",
  "version": "1.0.0"
}
```

### `plugins/<slug>-plugin/skills/<slug>/SKILL.md`

```markdown
---
name: <slug>
description: <description — used by Claude to decide when to invoke this skill>
argument-hint: <argument-hint if applicable>
[disable-model-invocation: true   ← only if user-invoked only]
---

<Core instructions gathered in Step 1>
```

## Step 3 — Update skills-lock.json

Read the existing `skills-lock.json` and add an entry for the new skill:

```json
"<slug>": {
  "source": "Frisodenboer/Agentic-Skills",
  "sourceType": "github",
  "computedHash": ""
}
```

Leave `computedHash` as an empty string — it is populated by the marketplace tooling when the skill is published.

## Step 4 — Confirm

After creating the files, print a summary:

```
Created skill: <slug>
  plugins/<slug>-plugin/.claude-plugin/plugin.json
  plugins/<slug>-plugin/skills/<slug>/SKILL.md
  skills-lock.json updated

Invoke with: /<slug>
```

Remind the user to fill in `computedHash` in `skills-lock.json` before publishing to the marketplace.
