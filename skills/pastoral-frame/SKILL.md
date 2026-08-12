---
name: pastoral-frame
description: Generate impressionistic rural landscape paintings with vibrant patchwork agricultural fields, layered mountains, and dramatic dusk skies — post-impressionist color-field mosaics with impasto brushwork. Optimized for Samsung Frame TV (3840x2160, 16:9). Use this skill when the user wants to create rural landscapes, pastoral paintings, agricultural field scenes, countryside artwork, or any artwork featuring patchwork fields against mountain backdrops. Also trigger on "pastoral frame", "patchwork pastoral", "pastoral landscape", "rural impressionism", "field painting", "farm landscape", "countryside at dusk", "mosaic fields", or similar phrases.
---

# Pastoral-Frame — Post-Impressionist Rural Landscape Skill

Generate impressionistic rural landscape paintings featuring vibrant patchwork agricultural fields stretching toward distant mountains under luminous dusk skies. Inspired by Post-Impressionism, Fauvism, and contemporary color-field landscape painting.

## Style Reference

The complete style guide lives in `references/style-guide.md`. **Read it before generating** to internalize the palette, techniques, and composition rules. Key principles:

- **Palette**: Terracotta, burnt orange, blush rose, goldenrod, sage green, lime — non-naturalistic complementary color juxtapositions
- **Lighting**: Late dusk / golden hour waning, warm ambient glow, diffused atmospheric light
- **Technique**: Impasto patchwork mosaic, scumbled field borders, glazed sky luminosity, palette knife highlights
- **Mood**: Serene, dreamlike, nostalgic, enchanted pastoral
- **Composition**: Layered horizontal bands (sky / mountains / fields), patchwork mosaic grid, diagonal leading lines toward horizon

## Workflow

### 1. Understand the request

Determine what the user wants:
- **A specific season/crop?** (e.g., "autumn wheat fields", "lavender at twilight", "spring wildflower meadow")
- **A mood/time?** (e.g., "peaceful dusk", "misty morning", "dramatic sunset over farmland")
- **Or just "generate one"?** — use defaults (late dusk, patchwork agricultural fields, unnamed rural landscape)

If the request is vague, propose 2–3 directions and let the user pick.

### 2. Read the style guide

Read `.claude/skills/Pastoral-Frame/references/style-guide.md` to load the full palette, technique keywords, and prompt templates.

### 3. Confirm generation parameters

Ask the user:

**a. Aspect ratio**
Options: `1:1` `16:9` `9:16` `21:9`
Default: **16:9** (Samsung Frame TV — 3840x2160)

**b. Resolution**
Options: `512` `1K` `2K` `4K`
Default: **4K** (Samsung Frame TV optimized)

**c. Customization** (optional — only if the user hasn't already specified)
- Season (spring, summer, autumn, winter)
- Time of day (late afternoon, dusk, twilight, early evening)
- Crop/field type (wheat, vineyard, lavender, sunflowers, rice paddies, wildflower)
- Terrain (flat plains, rolling hills, terraced slopes, river valley)
- Structures (farmhouses, barns, stone walls, windmills)
- Atmosphere (clear, ground mist, distant haze)

### 4. Craft the prompt

Build the generation prompt by combining:

1. **The style prefix** from the style guide (the "Full Style Prefix" or "Short Style Shorthand")
2. **Subject-specific description** based on the user's request
3. **Quality markers**: "ultra-detailed", "gallery-quality fine art", "museum-quality oil painting"
4. **Closing instruction**: "no text, no watermarks" (do NOT include "no signatures" — the artwork will be signed separately via the sign-artwork skill)

The prompt should be 3–6 sentences, rich in visual detail. Show it to the user before generating so they can adjust.

**Prompt structure:**
```
[Style Prefix] [Specific field/crop description]. [Terrain and structure details]. [Sky and atmosphere]. [Lighting and mood note]. No text, no watermarks.
```

**Example:**
```
Oil painting on textured canvas, post-impressionist patchwork pastoral landscape at dusk. A sweeping mosaic of agricultural fields in vibrant terracotta, lime green, blush rose, golden ochre, and sage stretching toward layered blue-gray mountains fading into atmospheric haze. Small farmhouses and dark trees are scattered among the fields providing scale and depth. The sky fills the upper third with a luminous gradient of soft peach, rose, lavender, and amber streaks from the setting sun. Thick visible impasto brushstrokes throughout, expressive color choices over realism. Gallery-quality fine art painting. No text, no watermarks.
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

If the user wants specific pixel dimensions (e.g., Samsung Frame TV at 3840x2160), resize with Python Pillow:

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

## Composition Rules — Making Artwork Addicting to Look At

These 9 rules transform a pleasant landscape into a painting the eye can't leave. **Include the relevant rules in your prompt** — don't just follow them silently. Gemini responds well to explicit compositional instructions.

### 1. Rule of Thirds — Power Points, Not Center
Place the primary focal point (mountain peak, village, tallest tree) at an upper-left or upper-right intersection of the thirds grid. **Never dead center.** This creates dynamic visual tension and gives the foreground its own weight.

**Prompt phrase**: "Composition with the mountain peak placed at the upper-right rule-of-thirds power point, not centered"

### 2. Leading Lines — Pull the Eye Inward
Use valley floors, field borders, ridgelines, fence lines, tree rows, and waterways to create converging lines that guide the eye toward the focal point. Diagonal lines are more dynamic than horizontal ones.

**Prompt phrase**: "Diagonal leading lines from the foreground field borders and valley converging toward the mountain peak, pulling the viewer's eye inward"

### 3. Foreground Framing — Layered Depth
Build the scene as 3-4 distinct depth layers: immediate foreground (richest colors, largest strokes), midground (trees, structures, cooler tones), far distance (mountains, mist), and sky. The foreground wraps around the viewer like a frame, creating an irresistible sense of depth.

**Prompt phrase**: "Strong foreground framing with layered depth — rich warm patchwork fields in the immediate foreground, dark tree clusters in the midground, misty mountains in the far distance"

### 4. Atmospheric Perspective — Warm to Cool Gradient
Progressive color shift from warm saturated foreground to cooler, mistier, less saturated distance. Each layer is slightly cooler, lighter, and softer than the one before it. This is the #1 technique for creating convincing depth.

**Prompt phrase**: "Atmospheric perspective with progressive color shift — warm saturated foreground fields cooling through the midground into misty blue-violet distant mountains with soft lost edges"

### 5. Color Harmony with Tension — Warm vs Cool
Create a dominant warm-cool contrast (golden fields against blue-mauve mountains). Then add a small accent of complementary color (vivid orange or magenta in the sky, or a single bright blue patch in the warm fields). This tension keeps the eye engaged — pure harmony is boring.

**Prompt phrase**: "Warm-cool color tension — dominant golden-amber fields against cool blue-mauve mountains, with a vivid complementary accent of [orange/magenta] near the horizon"

### 6. Varied Rhythm — Break the Pattern
Alternate large and small patches, thick and thin strokes, bright and muted colors. The eye should never settle into a monotone rhythm. Create visual "surprises" — a bright terracotta patch here, a dark tree cluster there, a sudden lime accent. Think jazz, not metronome.

**Prompt phrase**: "Varied visual rhythm — alternating large and small field patches, thick impasto beside smoother glazed areas, bright color accents punctuating darker zones to keep the eye moving"

### 7. Tonal Contrast — Dark Against Light
Strong dark-against-light contrasts at key focal areas: the mountain silhouette against the luminous sky, dark tree silhouettes against golden fields, deep shadow beside bright highlight. Without strong value contrast, a painting feels flat regardless of color.

**Prompt phrase**: "Strong tonal contrast — dark mountain silhouette against luminous dusk sky, dark tree silhouettes against golden fields, deep value contrast at the focal point"

### 8. Edge Control — Soft Distance, Sharp Foreground
Soft lost-and-found edges in the distance (misty mountains, fading tree lines) create atmosphere. Sharp crisp edges in the foreground (defined field patches, crisp tree silhouettes, clear structure outlines) anchor the viewer. This contrast of edge quality itself creates depth.

**Prompt phrase**: "Controlled edge variety — soft lost-and-found edges on distant misty mountains, crisp sharp edges on foreground tree silhouettes and defined field boundaries"

### 9. Golden Ratio Spiral — Eye Flow Path
Arrange the compositional flow so the eye travels in a spiral: enters at the warm foreground fields, sweeps through midground trees, arrives at the peak/focal point, then drifts across the dramatic sky. The patchwork pattern itself can reinforce this spiral flow.

**Prompt phrase**: "Compositional eye flow following a golden spiral — entering at the warm foreground fields, sweeping through midground trees toward the mountain peak, then drifting across the dramatic sky"

---

### How to Use These Rules in Prompts

**For best results**, include 3-5 of these rules explicitly in each generation prompt. Don't use all 9 at once — that overloads the model. Pick the ones most relevant to the scene:

- **Wide panoramic landscapes**: Rules 1, 2, 3, 4, 7 (thirds, leading lines, framing, atmosphere, tonal contrast)
- **Intimate field scenes**: Rules 5, 6, 8 (color tension, varied rhythm, edge control)
- **Dramatic mountain scenes**: Rules 1, 4, 7, 8, 9 (thirds, atmosphere, tonal contrast, edges, spiral)
- **Village/structure scenes**: Rules 2, 3, 6, 9 (leading lines, framing, rhythm, spiral)

### Master Prompt Template (All Rules Combined)

```
[Style Prefix]. [Scene description]. Composed with the mountain peak at the upper-right rule-of-thirds power point. Diagonal leading lines from foreground field borders converge toward the peak. Strong layered foreground framing with warm saturated patchwork fields, dark tree clusters in the midground, and misty blue-violet distant mountains. Atmospheric perspective with warm-to-cool color gradient front to back. Warm-cool color tension between golden-amber fields and blue-mauve mountains with a vivid amber accent at the horizon. Varied visual rhythm of large and small patches. Strong tonal contrast at the focal point. Soft edges in the distance, crisp edges in the foreground. Compositional eye flow in a golden spiral from fields through trees to peak to sky. No text, no watermarks.
```

---

## Tips for great results

- **Always read the style guide first** — the color names and technique terms make a huge difference in prompt quality.
- **The patchwork mosaic is essential** — without explicit "patchwork", "mosaic", or "color-field patch" instructions, the model will blend fields into uniform greens.
- **Non-naturalistic color is key to the look** — explicitly state specific warm and cool color names (terracotta, blush rose, lime) to prevent default realistic greens and browns.
- **Impasto brushwork must be requested** — always include "thick impasto", "visible brushstrokes", and "palette knife texture" or the model will produce photographic results.
- **If the first result is too photographic**, add "loose visible impasto brushstrokes, post-impressionist mark-making, painted texture on canvas" to the prompt.
- **If the result is too abstract**, add "recognizable agricultural field shapes, clear horizon line, distinct mountain forms" to ground it.
- **For 4K generations**, always include "ultra-detailed" and "gallery-quality" to maximize detail density.
- **The style works best in wide (16:9 or 21:9) format** — the patchwork pattern needs horizontal breadth to develop.
- **Dark tree silhouettes are the secret weapon** — they anchor the composition and provide value contrast against the vivid field colors. Always include them.
- **Use composition rules explicitly in prompts** — Gemini responds to "rule of thirds", "leading lines", "atmospheric perspective" as compositional instructions. Don't be shy about naming them.
- **Feed reference images when available** — if the user provides a reference photo, pass it to Gemini via `--reference-image` so the model can study the composition, shapes, and colors directly. This dramatically improves fidelity.
