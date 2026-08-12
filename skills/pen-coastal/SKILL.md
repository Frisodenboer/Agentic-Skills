---
name: pen-coastal
description: Generate hand-drawn pen-and-ink coastal and nautical illustrations in the "Pen-Coastal" house style — loose cross-hatched black ink linework (beach cottages, seashells, rope, anchors, portholes) with flat muted color washes deliberately misregistered from the linework, mimicking a mid-century British screen-printed seaside textile (scarf/tea-towel style). Use this skill when the user wants coastal illustration, nautical line art, seaside sketch art, beach cottage or seashell illustrations, screen-print textile style artwork, or vintage British seaside print design. Also trigger on "pen coastal", "pen style", "coastal pen and ink", "screen print coastal", "nautical sketch art", "seaside textile print", "offset registration print style", "tea towel style art", or similar phrases — even if the user just says "make something like this" while pointing at a coastal/nautical sketch reference.
---

# Pen-Coastal — Hand-Drawn Coastal Screen-Print Skill

Generate coastal and nautical illustrations in the Pen-Coastal house style: loose, cross-hatched pen-and-ink linework of beach cottages, seashells, rope, anchors, and portholes, layered with flat muted color washes that are **deliberately misregistered** from the ink outlines — the signature look of a hand-aligned screen print. Each generation is a NEW original piece, not a copy of the source reference.

## Style Reference

The complete style guide lives in `references/style-guide.md`. **Read it before generating** — it defines the offset-color-registration technique (the single most important trait of this style), the linework rules, the palette, and the motif library. This folder also bundles the three source reference photos (`reference-Pen_Style_01.jpg`, `_02.jpg`, `_03.jpg`) the style was derived from.

Key principles:
- **Offset color registration**: flat color washes sit under the ink linework and are visibly misaligned with it — this is the defining trait, never drop it from the prompt
- **Linework**: loose, hand-drawn, heavily cross-hatched, not vector-smooth
- **Palette**: dusty sky-blue, teal-turquoise, navy indigo, terracotta coral-red, sand tan, cream white — no pure black except the ink
- **Motifs**: beach cottages, seashells, rope/knots, anchors, portholes, dune grass, dot-bead borders
- **Composition**: either a scattered multi-motif vignette grid (authentic to the source textile) or a single large hero motif (better for wall art viewed from a distance)

## Workflow

### 1. Understand the request

Determine what the user wants:
- **A specific motif?** (e.g., "a big detailed seashell", "a beach cottage scene", "an anchor with rope")
- **Which composition mode?** — see the style guide's composition section: vignette grid (busy scattered textile look), single hero motif (default — centered/thirds-balanced, best for a standalone wall-art piece), or copy-space/editorial (subject pushed to one side, generous plain space on the other — use whenever the piece is headed for a magazine, banner, ad, or anywhere text will be overlaid on it).
- **Or just "generate one"?** — propose a hero motif (a large cottage or shell) and confirm before generating.

If the request is vague, propose 2-3 directions and let the user pick.

### 2. Read the style guide

Read `.claude/skills/Pen-Coastal/references/style-guide.md` to load the full offset-registration technique, palette, and motif vocabulary before crafting a prompt.

### 3. Confirm generation parameters

Ask the user:

**a. Aspect ratio**
Options: `1:1` `16:9` `9:16` `21:9`
Default: **16:9** (Samsung Frame TV — 3840x2160)

**b. Resolution**
Options: `1K` `2K` `4K`
Default: **4K** (Samsung Frame TV optimized)

**c. Customization** (optional — only if not already specified)
- Motif(s) from the library (cottage, shell, rope/anchor, porthole, dune grass)
- Composition mode (single hero motif / vignette grid)
- Any color accent lean (more terracotta, more teal, etc.) — stay within the locked palette

### 4. Craft the prompt

Build the generation prompt from the style guide's Master Prompt Template, filling in:

1. **Motif description** — what's being drawn
2. **Linework instruction** — cross-hatch, hand-drawn imperfection (verbatim from the style guide)
3. **Offset-registration instruction** — the misaligned color-under-linework technique (verbatim from the style guide — do not paraphrase this away, it's the trait that makes the style work)
4. **Palette lock** — the six named colors, no pure black, no bright primaries
5. **Composition instruction** — vignette grid or single hero motif
6. **Closing instruction**: "no text, no watermarks" (do NOT include "no signatures" — the artwork will be signed separately via the sign-artwork skill)

Show the prompt to the user before generating so they can adjust.

### 5. Generate the image, feeding the reference photos

This style depends on an unusual, specific print technique. Always pass the bundled reference images so the model can copy the offset-registration effect directly rather than guessing at it from text alone:

```bash
cd "C:/Claude Code Projects/Art Project" && node .claude/skills/nano-image/scripts/generate.mjs \
  --prompt "<your crafted prompt>" \
  --resolution "<user-chosen: 1K|2K|4K>" \
  --aspect-ratio "<user-chosen: 1:1|16:9|9:16|21:9>" \
  --reference-image ".claude/skills/Pen-Coastal/references/reference-Pen_Style_01.jpg" \
  --reference-image ".claude/skills/Pen-Coastal/references/reference-Pen_Style_02.jpg" \
  --reference-image ".claude/skills/Pen-Coastal/references/reference-Pen_Style_03.jpg"
```

Ensure `@google/genai` is installed and `public/generated-images/` exists.

### 6. Resize if needed (Samsung Frame TV spec)

If targeting exact Samsung Frame TV dimensions, resize with Pillow LANCZOS:

```bash
cd "C:/Claude Code Projects/Art Project" && python -c "
from PIL import Image
import os

src_path = '<generated-image-path>'
out_path = src_path.replace('.jpg', '-3840x2160.jpg').replace('.png', '-3840x2160.jpg')

img = Image.open(src_path)
print(f'Input: {img.size}')
resized = img.resize((3840, 2160), Image.LANCZOS)
resized.save(out_path, 'JPEG', quality=95)
print(f'Output: {resized.size}')
print(f'Path: {out_path}')
print(f'File size: {os.path.getsize(out_path) / 1024:.0f} KB')
"
```

Preserve the raw generated source in `public/generated-images/` — the resized version feeds into signing.

### 7. Sign the artwork

Use the **sign-artwork** skill to apply the NOOL signature via PIL overlay with color-sampled tinting:

```bash
cd "C:/Claude Code Projects/Art Project" && python -c "
from PIL import Image
import os

painting_path = '<generated-image-path>'
output_path = 'public/Artwork/nool-pen-coastal-<descriptive-name>-signed.jpg'

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

**Do NOT attempt to sign via prompt instructions.** Gemini cannot reliably render legible text. The PIL overlay is the only reliable method.

### 8. Export into today's dated folder + Adobe Stock CSV

Every finished piece from this skill gets copied into a dated export folder and logged in an Adobe Stock bulk-upload CSV — this always happens, not just when the user asks for stock export specifically. Run the bundled script:

**Use the resized-but-unsigned artwork for this step, not the signed file from step 7.** Adobe Stock uploads should not carry the visible NOOL signature — the signed copy in `public/Artwork/` is the portfolio/gallery deliverable; the stock export is a separate, unmarked copy of the same resized image.

```bash
cd "C:/Claude Code Projects/Art Project" && python .claude/skills/Pen-Coastal/scripts/export_for_stock.py \
  --image "<path-to-resized-3840x2160-artwork-before-signing>" \
  --title "<descriptive title, ~10-15 words, no ALL CAPS, no keyword stuffing>" \
  --keywords "<15-30 comma-separated keywords covering subject, technique, palette, mood>" \
  --category <ID from references/adobe-stock-categories.md>
```

This:
- Creates (or reuses) `public/out/<YYYY-MM-DD>/` for today's date — every piece generated the same day lands in the same folder
- Copies the signed artwork into that folder
- Appends a row to `adobe-stock-metadata.csv` in that folder (creating it with the correct header if it doesn't exist yet)

Read `references/adobe-stock-categories.md` for the category ID table and title/keyword conventions before filling in `--title`, `--keywords`, and `--category`. Write keywords and title yourself based on the actual motif and technique used — don't reuse a generic placeholder across different pieces.

By the end of a session, the dated folder is a ready-to-zip Adobe Stock upload batch: the artwork files plus one CSV covering all of them.

### 9. Present the result

Show the user:
- The signed image path (e.g., `public/Artwork/nool-pen-coastal-<name>-signed.jpg`)
- Dev server URL: `/Artwork/<filename>`
- Dimensions and file size
- The dated export folder path and CSV path from step 8
- Whether the offset-registration effect came through clearly, and offer a regeneration with strengthened wording if not

Ask if they'd like adjustments, a different motif, or a switch between vignette-grid and single-hero-motif composition.

## Tips for great results

- **Always feed the bundled reference photos via `--reference-image`** — see step 5. This style is defined by an unusual print technique that's far easier for the model to copy from an example than to construct from text alone.
- **Never drop the offset-registration instruction** from the prompt — it's the one line that separates Pen-Coastal from a generic "cute ink illustration." If a result comes back with color filled neatly inside the lines, regenerate with the instruction repeated and strengthened (see style guide tips).
- **Cross-hatching needs to be named explicitly per area** ("heavy cross-hatched shell ridges", "cross-hatched roof shadow") or the model tends to under-render it.
- **Single hero motif is the safer default for wall art** — the scattered vignette-grid composition is authentic to the source textile but can look busy/illegible at a distance; only use it when the user wants that specific textile/print feel.
- **Stay within the locked palette** — dusty sky-blue, teal-turquoise, navy indigo, terracotta coral-red, sand tan, cream white. Bright saturated primaries or naturalistic local color break the muted textile look.
