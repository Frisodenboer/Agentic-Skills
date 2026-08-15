---
name: zai-video
description: Generate videos using Z.AI's CogVideoX model via their async video API. Use this skill whenever the user asks to generate, create, or make a video, animation, clip, or motion graphic with Z.AI, Zhipu, CogVideoX, or text-to-video / image-to-video. Also trigger when the user says "zai-video", "generate-video", "make me a video of", "animate this image", or wants an AI-generated video.
---

# Generate Video — Z.AI (CogVideoX)

This skill generates videos using Z.AI's `cogvideox-3` model via their **async** REST API. You submit a task to `https://api.z.ai/api/paas/v4/videos/generations`, then poll `https://api.z.ai/api/paas/v4/async-result/{id}` until it succeeds. No SDK needed — just `fetch`. Videos are saved to `information/video/`.

Supports **text-to-video**, **image-to-video** (one image), and **first & last frame** (two images, speed mode only).

## Workflow

### 1. Gather requirements

Ask the user for what you don't already know. At minimum you need a **prompt** and/or an **image**. Confirm the other options or use sensible defaults.

- **What to generate**: A text description (max 512 characters). More detail = better result. Either a prompt, an image, or both is required.
- **Image(s)** (optional): One image URL for image-to-video, or two for first & last frame mode. Supports `.png`, `.jpeg`, `.jpg`, max 5MB each, via public URL or Base64. For first & last frame mode quality support, see Important notes below.
- **Quality**: `quality` (default — higher quality, slower) or `speed` (faster, lower quality).
- **Size** (optional): short side defaults to 1080 with ratio from the source image. Options: `1280x720`, `720x1280`, `1024x1024`, `1920x1080`, `1080x1920`, `2048x1080`, `3840x2160` (4K).
- **Duration** (optional): `5` (default) or `10` seconds.
- **FPS** (optional): `30` (default) or `60`.
- **Audio** (optional): generate AI sound effects — default off.

If the user already specified options in their message, don't re-ask — just confirm what you'll use.

### 2. Generate the video

No npm packages needed. Run the bundled script with the appropriate flags:

```bash
node .claude/skills/zai-video/scripts/generate.mjs \
  --prompt "a hummingbird sipping nectar from a glowing flower, cinematic, slow motion" \
  --quality "quality" \
  --size "1920x1080" \
  --duration "5" \
  --fps "30"
```

Image-to-video (pass `--image-url` once for image-to-video, twice for first & last frame):

```bash
node .claude/skills/zai-video/scripts/generate.mjs \
  --prompt "gentle zoom, leaves swaying in the wind" \
  --image-url "https://example.com/first.png" \
  --quality "speed"
```

Add `--with-audio` to generate AI sound effects.

The script will:
- Load `ZHIPU_API_KEY` from the environment or `.env`
- POST the task and get a task `id`
- Poll `async-result/{id}` every 10s (up to ~20 min) until `task_status` is `SUCCESS`
- Download the resulting video and save it to `information/video/` with a timestamped name (`zai-YYYYMMDDHHMMSS-random.mp4`)
- Print the saved file path and the cover image URL

Run it with `run_in_background: true` if generation may take a while, and check on it rather than blocking.

### 3. Present the result

- Tell the user where the video was saved (e.g., `information/video/zai-20260601-143022-a1b2.mp4`)
- Mention the cover image URL if they want a thumbnail (it's temporary — download separately if needed)
- Ask if they'd like adjustments or another generation

## Important notes

- `ZHIPU_API_KEY` must be set in `.env`.
- This is an **async** API — generation takes minutes, not seconds. The script handles polling for you.
- The returned video/cover URLs are temporary and expire after ~30 days. The script downloads the video locally, so that's covered.
- First & last frame mode (two `--image-url` values): Z.AI's docs are inconsistent on quality — the field reference says it only supports `--quality speed`, but their own first-and-last-frame example uses `--quality quality`. If one fails, try the other. The script doesn't restrict it.
- If the API returns an error, show the full message. Common issues: invalid API key, quota exceeded, content policy rejection, image too large (>5MB).
- Each video gets a unique timestamped filename so nothing is overwritten.
