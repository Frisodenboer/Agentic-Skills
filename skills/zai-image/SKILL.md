---
name: zai-image
description: Generate images using Zhipu AI's GLM-Image API. Use this skill whenever the user asks to generate an image with Zhipu, Z AI, GLM-Image, CogView, or explicitly says "zai-image", "generate-image-zai", "zhipu image", "z.ai image", or wants an alternative to Gemini image generation. Also trigger when the user mentions Chinese AI image generation or wants to try a different model style.
---

# Generate Image — Zhipu AI (GLM-Image)

This skill generates images using Zhipu AI's `glm-image` model via their REST API at `https://api.z.ai/api/paas/v4/images/generations`. No SDK needed — just `fetch`. Images are saved to `public/generated-images/`.

## Workflow

When the user asks you to generate an image using Zhipu AI, follow these steps in order:

### 1. Gather requirements

You MUST always ask the user for **size** and **quality** before generating. Never assume defaults without asking.

Ask the user for:

- **What to generate**: A text description of the image. The more detailed the prompt, the better the result.
- **Size**: Present the size options and ask which one they want. Use this format:

> "What size would you like? Here are the options for **glm-image**:
> - `1280x1280` — Square
> - `1568x1056` — Landscape
> - `1056x1568` — Portrait
> - `1728x960` — Wide
> - `960x1728` — Tall"

- **Quality**: Always ask. Present both options with the trade-off:

> "What quality? **hd** takes ~20s but produces richer detail, **standard** is faster at ~5-10s."

- **Model**: Only ask if the user might want a different model. Most users want `glm-image` (the default). Only mention `cogview-4-250304` if the conversation suggests they care about model choice.

If the user has already specified size and/or quality in their message, you don't need to ask again — just confirm what you'll use.

**Recommended sizes for `glm-image`:**

| Size | Orientation |
|------|-------------|
| `1280x1280` | Square (default) |
| `1568x1056` | Landscape |
| `1056x1568` | Portrait |
| `1472x1088` | Landscape |
| `1088x1472` | Portrait |
| `1728x960` | Wide |
| `960x1728` | Tall |

**Recommended sizes for `cogview-4-250304`:**

| Size | Orientation |
|------|-------------|
| `1024x1024` | Square (default) |
| `768x1344` | Portrait |
| `864x1152` | Portrait |
| `1344x768` | Landscape |
| `1152x864` | Landscape |
| `1440x720` | Wide |
| `720x1440` | Tall |

Custom sizes are also supported: width and height must be 1024-2048px, divisible by 32, and max 2^22 total pixels for `glm-image` (512-2048px, divisible by 16, max 2^21 for cogview).

### 2. Ensure dependencies are ready

No npm packages needed — the script uses Node.js built-in `fetch`. Just ensure the output directory exists:

```bash
mkdir -p "C:/Claude Code Projects/Uridan Marketing/public/generated-images"
```

### 3. Generate the image

Run the bundled Node.js script with the appropriate arguments:

```bash
cd "C:/Claude Code Projects/Uridan Marketing" && node .claude/skills/zai-image/scripts/generate.mjs \
  --prompt "the user's prompt here" \
  --size "1280x1280" \
  --quality "hd" \
  --model "glm-image"
```

The script will:
- POST to the Zhipu AI API using the `ZHIPU_API_KEY` environment variable
- Download the generated image from the temporary URL
- Save it to `public/generated-images/` with a timestamped filename (`zai-YYYYMMDDHHMMSS-random.png`)
- Print the saved file path

### 4. Present the result

After the script completes:
- Tell the user where the image was saved (e.g., `public/generated-images/zai-20260405-143022-a1b2.png`)
- Let them know the image is accessible at `/generated-images/<filename>` when the dev server is running
- If there were any content filter warnings, mention them
- Ask if they'd like any adjustments or another generation

## Important notes

- The `ZHIPU_API_KEY` environment variable must be set in `.env`.
- The returned image URL is temporary and expires after 30 days. The script downloads and saves locally, so this isn't an issue.
- If the API returns an error, show the full error message. Common issues: invalid API key, quota exceeded, content policy rejection.
- Each image gets a unique timestamped filename so nothing is ever overwritten.
