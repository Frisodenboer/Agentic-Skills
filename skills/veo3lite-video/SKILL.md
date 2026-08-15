---
name: veo3lite-video
description: Generate videos using Google's Veo 3.1 models (full / Fast / Lite) via the Gemini API. Use this skill whenever the user asks to generate, create, or make a video, clip, animation, or motion shot with Veo, Veo 3, Veo 3.1, Veo Lite, or Google's text-to-video model. Also trigger when the user says "veo3lite-video", "veo3 lite", "veo lite video", "make me a Veo video", or wants an AI-generated video from Google.
---

# Generate Video — Veo 3.1

This skill generates videos using Google's Veo 3.1 family via the `@google/genai` Node.js SDK. It's an **async (long-running operation)** API: you submit a prompt, poll the operation until it's done, then download the result. Videos are saved to `information/veo video/`.

Supports **text-to-video** and **image-to-video** (animate a still as the first frame via `--image`). At least one of `--prompt` or `--image` is required.

## Model variants

| Model flag | Label | 4K | Speed | Notes |
|---|---|---|---|---|
| `veo-3.1-generate-preview` | **Veo 3.1** (default) | ✅ | Normal | Best quality; native audio |
| `veo-3.1-fast-generate-preview` | **Veo 3.1 Fast** | ✅ | Faster | Same capabilities as 3.1, optimised for speed |
| `veo-3.1-lite-generate-preview` | **Veo 3.1 Lite** | ❌ | Fast | Max 1080p; cheaper |

**Default model: `veo-3.1-generate-preview`** — use Lite only when the user explicitly asks for it or wants to keep costs down.

## Resolution rules

| Resolution | Supported models | Duration |
|---|---|---|
| `720p` | All models | 4 s / 6 s / 8 s |
| `1080p` | All models | **8 s only** |
| `4k` | Veo 3.1 & 3.1 Fast only | **8 s only** |

---

## Step 1 — Intake (always ask before generating)

**Always ask in a single message** before firing the script. If the user already gave some values, confirm the rest or use defaults.

Required questions:
1. **Prompt** — what should happen in the video? (subject, action, camera, mood, audio cues)
2. **Image** (optional) — a local still to use as the first frame for image-to-video?
3. **Resolution** — `720p` (default, fastest/cheapest), `1080p`, or `4k` (Veo 3.1 / Fast only)?
4. **Model** — `veo-3.1-generate-preview` (default, recommended), `veo-3.1-fast-generate-preview` (faster), or `veo-3.1-lite-generate-preview` (cheaper, max 1080p)?
5. **Duration** — `4`, `6`, or `8` seconds? (default `8`; note: 1080p and 4K lock to 8 s)
6. **Aspect ratio** — `16:9` (default landscape) or `9:16` (portrait/vertical)?
7. **Output path** — custom filename or output folder? (defaults to `information/veo video/`)

Example ask:

> "Before I generate, a few quick questions:
> 1. **Prompt** — describe the video (action, camera, mood, audio cues)?
> 2. **Start image?** — drop a local still if you want image-to-video.
> 3. **Resolution** — `720p` / `1080p` / `4k`? (4K requires Veo 3.1, not Lite)
> 4. **Model** — Veo 3.1 (default), Veo 3.1 Fast, or Veo 3.1 Lite?
> 5. **Duration** — 4 / 6 / **8** seconds?
> 6. **Aspect ratio** — `16:9` / `9:16`?
>
> Defaults: Veo 3.1 · 720p · 8 s · 16:9. Confirm or adjust any."

If the user already specified options (e.g. "make a 4K video with Veo"), pick up those choices and only ask what's still unclear.

---

## Step 2 — Generate the video

No extra npm packages needed — `@google/genai` is already a project dependency. Run the bundled script:

**Text-to-video (Veo 3.1, 4K):**
```bash
node .claude/skills/veo3lite-video/scripts/generate.mjs \
  --prompt "a hummingbird sipping nectar from a glowing flower, cinematic, slow motion, soft morning light" \
  --model "veo-3.1-generate-preview" \
  --resolution "4k" \
  --aspect-ratio "16:9" \
  --duration "8"
```

**Image-to-video (Veo 3.1, 1080p):**
```bash
node .claude/skills/veo3lite-video/scripts/generate.mjs \
  --image "public/generated-images/your-still.jpg" \
  --prompt "slow cinematic push-in, dust drifting, clouds sliding. Audio: airy wind, low rumble. No subtitles, no on-screen text." \
  --model "veo-3.1-generate-preview" \
  --resolution "1080p" \
  --aspect-ratio "16:9" \
  --duration "8"
```

**Veo 3.1 Lite (720p / 1080p only — cheaper):**
```bash
node .claude/skills/veo3lite-video/scripts/generate.mjs \
  --prompt "..." \
  --model "veo-3.1-lite-generate-preview" \
  --resolution "1080p" \
  --duration "8"
```

### CLI flags reference

| Flag | Values | Default | Notes |
|---|---|---|---|
| `--prompt` | string | — | Motion description + audio cues |
| `--image` | file path | — | Local jpg/png/webp for image-to-video |
| `--model` | see table above | `veo-3.1-generate-preview` | |
| `--resolution` | `720p` `1080p` `4k` | `720p` | 4K: Veo 3.1/Fast only, 8s only |
| `--aspect-ratio` | `16:9` `9:16` | `16:9` | |
| `--duration` | `4` `6` `8` | `8` | 1080p/4K lock to 8 |
| `--number-of-videos` | `1`–`4` | `1` | |
| `--person-generation` | `allow_adult` `allow_all` `dont_allow` | omitted | Image-to-video: `allow_adult` only |
| `--output-dir` | directory path | `information/veo video` | |
| `--filename` | base name | auto-timestamped | |

**Do not pass `--negative-prompt`** — not supported by any Veo 3.1 preview model. Bake avoidance instructions into the main prompt ("No subtitles, no on-screen text, no watermarks.").

The script will:
- Load `GEMINI_API_KEY` from the environment or `.env`
- Validate model / resolution / duration compatibility (Lite + 4K = error; 1080p/4K + duration ≠ 8 = error)
- Submit the `generateVideos` operation
- Poll every 10s (up to ~20 min) until done
- Save to `information/veo video/` with a timestamped name: `veo3-…` (full), `veo3fast-…` (Fast), `veo3lite-…` (Lite)

Generation takes minutes — run with `run_in_background: true`.

---

## Step 3 — Present the result

- Tell the user the saved path
- Note the resolution and model used
- If multiple videos, list all paths
- Offer adjustments or a re-run

---

## Important notes

- `GEMINI_API_KEY` in `.env` — same key as nano-image.
- **4K requires Veo 3.1 (not Lite) and exactly 8 seconds duration.** The script enforces this and prints a clear error if violated.
- **1080p also requires exactly 8 seconds** across all models.
- Portrait (`9:16`) video is supported — useful for social/phone content.
- If the API returns a content-policy error on audio (Veo 3.1 has a native audio safety filter), retry with a simpler prompt. You won't be charged for a blocked generation.
- Preview models can change — if a resolution or option is rejected, fall back to `720p` and tell the user.
- Each video gets a unique timestamped filename so nothing is overwritten.
