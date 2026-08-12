---
name: atmospheric-cityscape
description: Generate panoramic cityscape paintings in an atmospheric impressionist style — luminous silhouette skylines against gradient skies with reflective water surfaces. Use this skill when the user wants to create cityscapes, skyline paintings, urban landscapes, twilight or dawn city views, or any artwork featuring buildings against atmospheric skies reflected in water. Also trigger on "atmospheric cityscape", "luminist cityscape", "tonalist skyline", "golden hour city", "city reflection painting", or similar phrases.
---

# Atmospheric Cityscape — Impressionist Panoramic Painting Skill

Generate panoramic cityscape paintings in an atmospheric impressionist style inspired by American Luminism, Tonalism, and Monet's atmospheric cityscapes. Cities rendered as luminous silhouettes against gradient skies with reflective water surfaces.

## Style Reference

The complete style guide lives in `references/style-guide.md`. **Read it before generating** to internalize the palette, techniques, and composition rules. Key principles:

- **Palette**: Peach blush, muted amber, charcoal, slate, sepia, mercury silver — compressed value range, no pure black or white
- **Lighting**: Contre-jour (backlight), golden hour, diffuse atmospheric glow
- **Technique**: Glazed sky gradients, impasto building highlights, scumbled broken-color water reflections
- **Mood**: Serene grandeur, contemplative nostalgia
- **Composition**: Rule of thirds (sky / skyline / water), centered focal point, bilateral + vertical symmetry

## Workflow

### 1. Understand the request

Determine what the user wants:
- **A specific city?** (e.g., "New York at dusk", "Venice at dawn", "a futuristic city")
- **A mood/time?** (e.g., "peaceful twilight", "misty morning", "dramatic sunset")
- **Or just "generate one"?** — use defaults (golden hour, unnamed panoramic city)

If the request is vague, propose 2–3 directions and let the user pick.

### 2. Read the style guide

Read `.claude/skills/atmospheric-cityscape/references/style-guide.md` to load the full palette, technique keywords, and prompt templates.

### 3. Confirm generation parameters

Ask the user:

**a. Aspect ratio**
Options: `1:1` `16:9` `9:16` `21:9`
Default: **21:9** (ultra-wide panoramic — best suits the triptych/cityscape format)

**b. Resolution**
Options: `512` `1K` `2K` `4K`
Default: **2K**

**c. Customization** (optional — only if the user hasn't already specified)
- City/location type (modern metropolis, European canal town, harbor, futuristic, etc.)
- Time of day (dawn, golden hour, dusk, twilight)
- Water type (river, harbor, canal, lake)
- Atmosphere intensity (clear, light haze, heavy mist)

### 4. Craft the prompt

Build the generation prompt by combining:

1. **The style prefix** from the style guide (the "Full Style Prefix" or "Short Style Shorthand")
2. **Subject-specific description** based on the user's request
3. **Quality markers**: "ultra-detailed", "gallery-quality fine art", "museum-quality oil painting"
4. **Closing instruction**: "no text, no watermarks" (do NOT include "no signatures" — the artwork will be signed separately via the sign-artwork skill)

The prompt should be 3–6 sentences, rich in visual detail. Show it to the user before generating so they can adjust.

**Prompt structure:**
```
[Style Prefix] [Specific subject/city description]. [Lighting and atmosphere details]. [Water reflection characteristics]. [Mood note]. No text, no watermarks.
```

**Example:**
```
Oil painting on textured canvas, panoramic atmospheric impressionist cityscape. A sweeping modern skyline of glass towers and setback skyscrapers rendered as dark charcoal and slate silhouette masses against a luminous sky transitioning from deep saffron and peach at the horizon to cool dawn gray above. The harbor water below mirrors the skyline in desaturated sepia and umber with broken scumbled brushwork and long mercury-silver reflection streaks. Scattered cadmium yellow window lights dot the dark facades. Golden-hour contre-jour lighting, compressed luminous value range, serene monumental mood. Ultra-detailed gallery-quality fine art. No text, no watermarks.
```

### 5. Generate the image

Use the nano-image skill to generate:

```bash
cd "C:/Claude Code Projects/Art Project" && node .claude/skills/nano-image/scripts/generate.mjs \
  --prompt "<your crafted prompt>" \
  --resolution "<user-chosen: 512|1K|2K|4K>" \
  --aspect-ratio "<user-chosen: 1:1|16:9|9:16|21:9>"
```

Ensure `@google/genai` is installed and `public/generated-images/` exists.

### 6. Resize if needed (optional)

If the user wants specific pixel dimensions, resize with Python Pillow:

```bash
python -c "
from PIL import Image
img = Image.open('<generated-image-path>')
resized = img.resize((<WIDTH>, <HEIGHT>), Image.LANCZOS)
out = '<path-without-ext>-<WIDTH>x<HEIGHT>.jpg'
resized.save(out, 'JPEG', quality=95)
import os
print(f'Saved: {out}')
print(f'Dimensions: {resized.size}')
print(f'File size: {os.path.getsize(out) / 1024:.0f} KB')
"
```

### 7. Sign the artwork

Use the **sign-artwork** skill to apply the NOOL signature via PIL overlay with color-sampled tinting:

```bash
cd "C:/Claude Code Projects/Art Project" && python -c "
from PIL import Image
import os

painting_path = '<generated-image-path>'
output_path = 'public/Artwork/nool-<descriptive-name>-signed.jpg'

painting = Image.open(painting_path).convert('RGBA')
sig_src = Image.open('public/Artwork/nool-signature.png').convert('RGBA')

scale = int(painting.width * 0.042)
padding_x = 120
padding_y = 100
x = painting.width - scale - padding_x
y = painting.height - int(sig_src.height * (scale / sig_src.width)) - padding_y

# Sample average color in signature zone
sig_h = int(sig_src.height * (scale / sig_src.width))
region = painting.crop((x, y, x + scale, y + sig_h))
pixels = list(region.convert('RGB').getdata())
avg_r = sum(p[0] for p in pixels) / len(pixels)
avg_g = sum(p[1] for p in pixels) / len(pixels)
avg_b = sum(p[2] for p in pixels) / len(pixels)
brightness = (avg_r + avg_g + avg_b) / 3

print(f'Sampled zone color: RGB({avg_r:.0f}, {avg_g:.0f}, {avg_b:.0f}), brightness: {brightness:.0f}/255')

# Calculate tint: lighten for dark bg, darken for light bg
if brightness < 128:
    tint_r = min(255, int(avg_r + (255 - avg_r) * 0.30))
    tint_g = min(255, int(avg_g + (255 - avg_g) * 0.30))
    tint_b = min(255, int(avg_b + (255 - avg_b) * 0.30))
else:
    tint_r = max(0, int(avg_r * 0.55))
    tint_g = max(0, int(avg_g * 0.55))
    tint_b = max(0, int(avg_b * 0.55))

# Tint the signature
datas = sig_src.getdata()
new_data = []
for item in datas:
    if item[3] > 0:
        nr = int(tint_r * 0.85 + item[0] * 0.15)
        ng = int(tint_g * 0.85 + item[1] * 0.15)
        nb = int(tint_b * 0.85 + item[2] * 0.15)
        na = int(item[3] * 0.75)
        new_data.append((nr, ng, nb, na))
    else:
        new_data.append(item)
sig_src.putdata(new_data)

# Resize and paste
ratio = scale / sig_src.width
new_h = int(sig_src.height * ratio)
sig_src = sig_src.resize((scale, new_h), Image.LANCZOS)

painting.paste(sig_src, (x, y), sig_src)
painting.convert('RGB').save(output_path, 'JPEG', quality=95)
print(f'Signed: {output_path}')
print(f'Tint: RGB({tint_r}, {tint_g}, {tint_b}) on {painting.width}x{painting.height}px canvas')
print(f'File size: {os.path.getsize(output_path) / 1024:.0f} KB')
"
```

**Do NOT attempt to sign via prompt instructions** (e.g., "add signature reading 'Nool'"). Gemini cannot reliably render legible text. The PIL overlay with color-sampled tinting is the only reliable method.

### 8. Present the result

Show the user:
- The signed image path (e.g., `public/Artwork/nool-<name>-signed.jpg`)
- Dev server URL: `/Artwork/<filename>`
- Dimensions and file size
- The sampled background color and the tint applied to the signature

Ask if they'd like adjustments, a variation, or a different scene.

## Tips for great results

- **Always read the style guide first** — the palette keywords and technique terms make a huge difference in prompt quality.
- **The contre-jour lighting is essential** — without explicit backlight/silhouette instructions, the model will default to front-lit scenes.
- **Compressed value range is key to the look** — explicitly state "no pure blacks or whites" to prevent the model from adding harsh contrast.
- **Water reflections should always be described as "desaturated"** — this prevents oversaturated mirror copies.
- **If the first result is too photographic**, add "loose visible brushstrokes, impressionist mark-making, painted texture" to the prompt.
- **If the result is too abstract**, add "recognizable architectural forms, structured skyline silhouette" to ground it.
- **For 4K generations**, always include "ultra-detailed" and "gallery-quality" to maximize detail density.
- **The style works best in ultra-wide (21:9) format** — encourage this aspect ratio for cityscapes.
