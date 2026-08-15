---
name: veo31
description: Generate videos with Google's full high-performance Veo 3.1 model (veo-3.1-generate-preview) via the Gemini API — the premium, higher-quality (and EXPENSIVE) sibling of the veo3lite-video skill. Use when the user explicitly wants top-quality Veo output and says "veo31", "veo 3.1", "the full Veo", "high-performance Veo", or asks for the best/premium Veo video. For cheaper drafts use veo3lite-video; for the stock-loop line use zai-video.
---

# Generate Video — Veo 3.1 (high performance, PREMIUM)

This skill generates videos with Google's **full** `veo-3.1-generate-preview` model via the
`@google/genai` Node.js SDK — the high-performance, higher-fidelity version of Veo 3.1 (not the
`lite` preview that `veo3lite-video` uses). It's an **async (long-running operation)** API: submit a
prompt and/or image, poll the operation until done, then download. Videos save to
`information/veo video/` with a `veo31-` prefix.

Supports **text-to-video** (a prompt) and **image-to-video** (animate a still as the first frame via
`--image`, with an optional motion prompt). At least one of `--prompt` or `--image` is required.

**Defaults: `1080p` resolution, `8` seconds, `16:9`, `1` video.** Veo's superpower is **native
synchronized audio** (dialogue, SFX, ambience, music) baked into the same generation.

## ⚠️ NON-NEGOTIABLE: warn about cost and get confirmation BEFORE every run

**Veo 3.1 (full) is an expensive, premium model.** Before you run the generate script — every single
time, even if the user already asked for a video, even mid-batch — you MUST:

1. **Tell the user plainly that this is the expensive / premium Veo 3.1 model** and that each
   generation costs real money (and more per second at higher resolution / longer duration / more
   videos).
2. **State exactly what you're about to generate** — resolution, duration, number of videos,
   text-to-video vs image-to-video.
3. **Get explicit confirmation to proceed.** A prior "make a video" is NOT confirmation of cost.
   Wait for a clear yes.

Example gate:

> "Heads-up: this uses **Veo 3.1 (full) — the premium, expensive model**. I'm about to generate
> **1 video · image-to-video · 1080p · 8s** from `chip.jpg`. That's a paid premium generation —
> want me to go ahead?"

Only after the user confirms do you call the script. If the user has not confirmed, do not run it.
(Cheaper alternatives to offer if they balk: **veo3lite-video** for a Veo draft, or **zai-video**
for the silent 4K stock-loop pipeline.)

## Workflow

### 1. Gather requirements
At minimum you need a **prompt** and/or an **image**. Confirm the rest or use the defaults.
- **What to generate**: a detailed description (subject, action, camera move, lighting, mood, style,
  and the audio you want — Veo renders synced audio).
- **Image to animate** (optional): `--image <path>` (jpg/png/webp) as the first frame; pair with a
  motion+audio prompt.
- **Aspect ratio**: `16:9` (default) or `16:10`.
- **Resolution**: `1080p` (default), `720p`, or `4k`. Note: the preview model may reject `4k` with a
  400 — if so, fall back to `1080p` and tell the user.
- **Duration**: integer `5`–`8` seconds (default `8`).
- **Number of videos**: `1`–`4` (default `1`). Each one is a separate paid generation — call out the
  multiplied cost before generating more than one.
- **Person generation / negative prompt**: leave off — the preview models reject these (bake "avoid"
  notes into the prompt text instead, e.g. "No subtitles, no on-screen text").

### 2. Confirm cost (see the gate above), THEN generate

```bash
node .claude/skills/veo31/scripts/generate.mjs \
  --prompt "slow cinematic push-in, volumetric light, dust drifting. Audio: airy wind, swelling ambient score. No subtitles, no on-screen text." \
  --aspect-ratio "16:9" --resolution "1080p" --duration "8" --number-of-videos "1"
```

Image-to-video (animate a still as the first frame):

```bash
node .claude/skills/veo31/scripts/generate.mjs \
  --image "out/2026-06-05/images/your-still.jpg" \
  --prompt "<motion + camera + audio description>. No subtitles, no on-screen text." \
  --resolution "1080p" --duration "8"
```

Generation takes minutes — run with `run_in_background: true` and poll the task output. The script
loads `GEMINI_API_KEY`, submits the operation, polls every 10s (up to ~20 min), downloads each video
to `information/veo video/veo31-<timestamp>-<random>.mp4`, and prints the path(s). Pass
`--output-dir` / `--filename` to control where and what it's named.

### 3. Present the result
Report the saved path(s); ask if they want adjustments or another (paid) generation.

## Important notes
- `GEMINI_API_KEY` must be set in `.env` (same key as nano-image / veo3lite-video).
- **Cost discipline is this skill's whole point** — never skip the confirmation gate. Default to the
  smallest sensible settings (1 video, 8s) unless the user asks for more.
- `veo-3.1-generate-preview` is a preview model — availability, pricing, and supported options can
  change. If the API rejects the model id or a resolution, report the full error; for resolution
  fall back to `1080p`/`720p` and tell the user.
- Native audio is on by default. For **silent** stock loops, strip audio downstream in the ffmpeg
  seamless-loop step (`-an`), or just use `zai-video` instead.
- Each video gets a unique timestamped filename so nothing is overwritten.

## Related
- **veo3lite-video** — the cheaper Veo 3.1 *lite* preview (drafts).
- **zai-video** — silent, 4K-capable CogVideoX; the model for the daily stock-loop line.
- **veo3-prompt-director** — craft motion+audio prompts for Veo.
