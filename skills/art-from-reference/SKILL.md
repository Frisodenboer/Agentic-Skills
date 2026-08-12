---
name: art-from-reference
description: Generate stylized artwork inspired by a reference image. Use this skill whenever the user wants to create art based on an existing image, photo, or picture — such as "make art from this image", "create artwork inspired by this", "generate something in this style", "use this as a reference", or "turn this photo into art". Also trigger when the user provides an image file and asks for creative interpretation, artistic reimagining, style transfer, or a new piece that captures the same vibe. This is the go-to skill for reference-based art generation.
---

# Art From Reference — Generate Artwork Inspired by an Image

This skill takes a user-provided reference image, analyzes its visual style, and generates a new artwork inspired by it. The workflow combines visual analysis, creative direction, AI image generation (via the nano-image skill), and precise resizing.

## Workflow

### 1. Read and analyze the reference image

Use the Read tool to open the user's reference image file. Provide a detailed analysis covering:

- **Subject**: What or who is depicted? Pose, expression, clothing, accessories.
- **Color palette**: Dominant colors, accent colors, whether monochromatic or vivid.
- **Style and aesthetic**: Photorealistic, abstract, pop-art, impressionistic, street-art, minimalist, etc.
- **Composition**: Layout, framing, focal point, negative space.
- **Mood and energy**: Calm, chaotic, elegant, raw, nostalgic, futuristic, etc.
- **Notable techniques**: Paint drips, collage, double exposure, geometric overlays, etc.

Present the analysis to the user so they can confirm you understand the source material.

### 2. Ask for generation parameters

Before any creative direction, ALWAYS ask the user to confirm these two generation parameters:

**a. Aspect ratio**
Which aspect ratio to use? Options:
`1:1` `1:4` `1:8` `2:3` `3:2` `3:4` `4:1` `4:3` `4:5` `5:4` `8:1` `9:16` `16:9` `21:9`

Default to **16:9** if the user doesn't specify.

**b. Resolution**
Which resolution to use? Options:
`512` `1K` `2K` `4K`

Default to **2K** if the user doesn't specify.

### 3. Ask for creative direction

Ask the user about artistic direction:
How should the new artwork relate to the reference? Offer these options:
1. **Faithful reinterpretation** — same composition and mood, recreated with fresh energy
2. **Evolution** — same aesthetic vibe but with a different subject, color palette, or abstract elements
3. **Style transfer** — apply the reference's visual language to a completely new subject or theme
4. **Something else** — the user has their own direction in mind

### 4. Craft the generation prompt

Based on the analysis and the user's direction choice, write a detailed image generation prompt. A strong prompt includes:

- **Subject description** — specific, vivid, and concrete (not vague)
- **Style keywords** — the artistic movements and techniques from the reference
- **Color direction** — explicit color names and relationships
- **Mood/atmosphere** — emotional tone of the piece
- **Composition notes** — framing, focal point, spatial relationships
- **Quality markers** — "ultra-detailed", "gallery-quality", "fine art print" etc.
- **Negative instructions** — "no text" if the image shouldn't contain words

The prompt should be 3-5 sentences, rich in visual detail. Show it to the user before generating so they can adjust.

### 5. Generate the artwork

Use the nano-image skill to generate the image, passing the aspect ratio and resolution the user confirmed in step 2:

```bash
cd "<project-root>" && node .claude/skills/nano-image/scripts/generate.mjs \
  --prompt "<your crafted prompt>" \
  --resolution "<user-chosen: 512|1K|2K|4K>" \
  --aspect-ratio "<user-chosen: 1:1|1:4|1:8|2:3|3:2|3:4|4:1|4:3|4:5|5:4|8:1|9:16|16:9|21:9>"
```

Ensure `@google/genai` is installed and the `public/generated-images/` directory exists before running.

### 6. Resize to exact dimensions (optional)

If the user specified exact pixel dimensions beyond just the aspect ratio, resize using Python Pillow:

```bash
python -c "
from PIL import Image
img = Image.open('<generated-image-path>')
resized = img.resize((<WIDTH>, <HEIGHT>), Image.LANCZOS)
out = '<generated-image-path without extension>-<WIDTH>x<HEIGHT>.jpg'
resized.save(out, 'JPEG', quality=95)
import os
print(f'Saved: {out}')
print(f'Dimensions: {resized.size}')
print(f'File size: {os.path.getsize(out) / 1024:.0f} KB')
"
```

Key resize settings:
- **Resampling**: `Image.LANCZOS` — highest quality, avoids artifacts
- **Quality**: `95` — visually lossless JPEG
- **Naming**: append the dimensions to the original filename (e.g., `img-20260405-4k-3840x2160.jpg`)

### 7. Present the result

Show the user:
- The resized image file path
- Final dimensions and file size
- The dev server URL: `/generated-images/<filename>`
- A brief description of how the new artwork relates to the reference

Ask if they'd like adjustments, a different variation, or another generation.

## Tips for great results

- The analysis step matters — a thorough reading of the reference produces better prompts.
- When the user picks "evolution" or "style transfer", suggest specific changes (e.g., "swap the portrait subject for a cityscape, keep the paint-drip abstraction") to help them narrow their vision.
- If the generated image doesn't match the user's expectations, iterate on the prompt rather than accepting the first result. Small wording changes can shift the output significantly.
- For wallpaper-sized images (4K), always include "ultra-detailed" and "gallery-quality" in the prompt to maximize detail density.
- The resize step is a downscale in most cases (Gemini often outputs larger than 4K), which preserves quality. If it's an upscale, warn the user that sharpness may decrease.
