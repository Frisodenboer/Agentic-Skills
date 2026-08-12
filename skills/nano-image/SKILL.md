---
name: nano-image
description: Generate images using Google's Gemini API (Nano Bananas Pro Model 2). Use this skill whenever the user asks to generate, create, or make an image, illustration, picture, photo, graphic, visual, artwork, or thumbnail — even if they don't say "Nano Bananas" or "Gemini" explicitly. Also trigger when the user says "nano-image", "generate-image", "make me an image of", "create a picture of", or similar phrasing. This is the go-to skill for any AI image generation request in this project.
---

# Generate Image — Nano Bananas Pro Model 2

This skill generates images using Google's Gemini `gemini-3.1-flash-image-preview` model (referred to as "Nano Bananas Pro Model 2") via the `@google/genai` Node.js SDK. Images are saved to `public/generated-images/`.

## Workflow

When the user asks you to generate an image, follow these steps in order:

### 1. Gather requirements

Ask the user for:

- **What to generate**: A description of the image they want. Encourage detail — style, mood, colors, composition, subject matter all help produce better results.
- **Resolution**: 1K, 2K, or 4K. Default to **1K** if the user doesn't specify or says "default".
- **Aspect ratio**: One of the following. Default to **square (1:1)** if not specified.
  - `1:1` — Square (default)
  - `16:9` — Landscape
  - `9:16` — Portrait
  - `21:9` — Ultra-wide

Present the defaults clearly so the user can just confirm or override:

> "I'll generate that at **1K** resolution in a **square (1:1)** aspect ratio. Want a different resolution (2K, 4K) or aspect ratio (16:9 landscape, 9:16 portrait, 21:9 ultra-wide)?"

### 2. Ensure dependencies are ready

Before running the generation script, make sure the `@google/genai` package is installed:

```bash
cd "C:/Claude Code Projects/Uridan Marketing" && npm ls @google/genai 2>/dev/null || pnpm add @google/genai
```

Also ensure the output directory exists:

```bash
mkdir -p "C:/Claude Code Projects/Uridan Marketing/public/generated-images"
```

### 3. Generate the image

Run the bundled Node.js script with the appropriate arguments:

```bash
cd "C:/Claude Code Projects/Uridan Marketing" && node .claude/skills/nano-image/scripts/generate.mjs \
  --prompt "the user's prompt here" \
  --resolution "1K" \
  --aspect-ratio "1:1"
```

The script will:
- Call the Gemini API using the `GEMINI_API_KEY` environment variable
- Stream the response and save any generated image to `public/generated-images/`
- Print the saved file path and any text response from the model

### 4. Present the result

After the script completes:
- Tell the user where the image was saved (e.g., `public/generated-images/img-20260330-143022-a1b2.png`)
- Let them know the image is accessible at `/generated-images/<filename>` when the dev server is running
- If the model returned text alongside the image, share that too
- Ask if they'd like any adjustments or another generation

## Important notes

- The `GEMINI_API_KEY` environment variable must be set in `.env`. It's already configured for this project.
- The model supports person generation — no special flags needed.
- If the API returns an error, show the full error message to the user so they can troubleshoot (common issues: invalid API key, quota exceeded, content policy rejection).
- Each image gets a unique timestamped filename so nothing is ever overwritten.
