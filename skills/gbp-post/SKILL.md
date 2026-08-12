---
name: gbp-post
description: Post a STANDARD update to the Uridan Google Business Profile. Use when the user wants to publish to Google Business, post on Google My Business, or share an update on their business profile.
argument-hint: <post text> [public image URL]
disable-model-invocation: true
---

Post a STANDARD update to the user's Uridan Google Business Profile via the Google Business Profile API.

## Arguments

Parse `$ARGUMENTS` as follows:
- **First quoted string or everything up to the first URL**: the post text (summary)
- **Optional second argument**: a publicly accessible image URL (must be https)

If the user hasn't supplied text, ask them what they want to post before running the script. An image URL is optional — if omitted, post text-only.

## Step 1 — Verify setup is complete

Check that `%APPDATA%\gbp-post\config.json` and `%APPDATA%\gbp-post\token.json` exist. If either is missing, tell the user to run the setup script first:

```
python "C:\Claude Code Projects\Agentic Skills\plugins\gbp-post-plugin\skills\gbp-post\scripts\setup.py"
```

Then stop — do not attempt to post without completed setup.

## Step 2 — Run the posting script

Invoke `post.py` with the text and optional image URL as separate arguments:

```bash
python "C:\Claude Code Projects\Agentic Skills\plugins\gbp-post-plugin\skills\gbp-post\scripts\post.py" "<text>" "<image-url>"
```

Pass the text as a single quoted argument so spaces are preserved. If no image URL was given, omit the second argument entirely.

## Step 3 — Report the result

On success the script prints the post's `searchUrl`. Show this URL to the user so they can click through and verify the post is live.

On failure (non-zero exit), print the script's stderr output verbatim — it contains the API error response. Common errors:
- **403 / PERMISSION_DENIED**: API access request not yet approved by Google (see `references/api-access.md`)
- **401 / UNAUTHENTICATED**: refresh token expired or revoked → user must re-run `setup.py`
- **400 / INVALID_ARGUMENT**: check the image URL is publicly accessible and the text is under ~1500 chars

## Notes

- Posts are published to Uridan only (location is fixed in `config.json`)
- Text posts expire after ~7 days on Google Business Profile — this is Google's behavior, not a limitation of the skill
- Never include the raw `token.json` or `credentials.json` contents in any output
