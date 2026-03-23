---
name: youtube-titles
description: Generate 10 YouTube title suggestions for a video topic. Titles are browse-optimized, SEO-friendly, keyword-rich, and max 54 characters. Use when the user wants YouTube title ideas, video title suggestions, or help naming a YouTube video.
argument-hint: <video topic>
---

Generate exactly 10 YouTube title ideas for the following topic: $ARGUMENTS

## Rules

- Every title must be **54 characters or fewer** (count carefully, including spaces)
- Front-load the most important keyword(s) — put them at the start
- Mix styles across the 10 titles: how-to, listicle, curiosity gap, question, bold claim, number-based
- Write for browse surface (suggested videos, homepage) — the title must work without a thumbnail
- Use plain language; no clickbait that misleads, but hooks are encouraged
- No hashtags, no ALL CAPS, no excessive punctuation (one ! or ? max per title)
- Each title must stand alone — no series labels or episode numbers unless the topic implies it

## Output format

Return a numbered list of exactly 10 titles, one per line, with the character count in parentheses after each:

1. Title Here (42 chars)
2. Another Title Example (21 chars)
...

After the list, add a one-line note on which 2–3 titles you'd recommend first and why (keyword placement, click appeal).
