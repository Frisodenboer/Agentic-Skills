---
name: pen-ink-bw
description: Generate hand-drawn pen-and-ink illustrations of ANY subject — portraits, animals, botanicals, architecture, vehicles, objects, maps, scenes — in the "Pen-Ink-BW" house style: loose cross-hatched and stippled black ink linework rendered strictly black and white on a completely bare, pure white (#FFFFFF) canvas, with no color, no grey wash, and no flat fills of any kind. A general-purpose monochrome pen-and-ink skill, not limited to any one theme. Use this skill whenever the user wants black-and-white pen-and-ink illustration, monochrome line art, engraving-style artwork, sketchbook-style ink drawing, or any hand-drawn black-and-white illustration on a pure white background. Also trigger on "pen and ink drawing", "black and white line art", "monochrome sketch", "ink only illustration", "engraving style", "pen tool drawing", "no color pen and ink", or similar phrases — even if the user just says "make a black and white pen drawing of X" for any subject X.
---

# Pen-Ink-BW — Hand-Drawn Monochrome Pen-and-Ink Illustration Skill

Generate pen-and-ink illustrations of **any subject** in the Pen-Ink-BW house style: loose, cross-hatched and stippled linework rendered strictly in black ink on a completely bare, pure white canvas. There is **no color and no wash of any kind**: every shadow and area of tonal depth is built entirely from line density (cross-hatching, stippling, line-weight contrast), the way a traditional engraving or woodcut builds value from line alone. Each generation is a NEW original piece.

This is a **general-purpose** skill — the fixed part is the technique (pure black ink, pure white ground, tone from line density alone); the subject is whatever the user asks for: a person, animal, plant, building, vehicle, object, map, or scene.

## Style Reference

The complete style guide lives in `references/style-guide.md`. **Read it before generating** — it defines the "no color, no wash, pure white ground" rule (the single most important trait of this style), the linework/tonal-value rules, and guidance across subject domains.

Key principles:
- **No color, no wash, pure white ground**: the canvas is completely bare `#FFFFFF`, the ink is pure `#000000`, and there are no flat fills or tone patches anywhere — this is the hard constraint that defines the skill, never drop it from the prompt, regardless of subject
- **Linework carries all value**: shadows and depth come only from cross-hatch density, stippling, and line-weight contrast — never from a filled color or grey patch
- **Subject is open**: portraits, animals, botanicals, architecture, vehicles, objects, maps, scenes — anything the user asks for
- **Composition**: scattered multi-element vignette grid, single hero subject (default), or copy-space/editorial layout

## Workflow

### 1. Understand the request

Determine what the user wants:
- **What's the subject?** Get the specific subject (e.g., "a barn owl in flight", "a vintage typewriter", "a gothic cathedral facade", "a city map of Amsterdam"). If vague, ask for the specific subject before writing a prompt — don't default to a themed motif library the way a single-topic skill would.
- **Which composition mode?** — see the style guide's composition section: vignette grid (busy scattered specimen-plate look), single hero subject (default — centered/thirds-balanced, best for a standalone wall-art piece), or copy-space/editorial (subject pushed to one side, generous plain white space on the other — use whenever the piece is headed for a magazine, banner, ad, or anywhere text will be overlaid on it).
- **Or just "make me a pen and ink drawing"?** — ask what subject they have in mind before proceeding; don't guess a random subject.

If the request is vague on composition or framing, propose 2-3 directions and let the user pick.

### 2. Read the style guide

Read `.claude/skills/Pen-Ink-BW/references/style-guide.md` to load the full "no color, pure white ground" rule and linework/tonal-value technique before crafting a prompt.

### 3. Confirm generation parameters

Ask the user:

**a. Aspect ratio**
Options: `1:1` `16:9` `9:16` `21:9`
Default: **16:9** (Samsung Frame TV — 3840x2160)

**b. Resolution**
Options: `1K` `2K` `4K`
Default: **4K** (Samsung Frame TV optimized)

**c. Customization** (optional — only if not already specified)
- Composition mode (single hero subject / vignette grid / copy-space editorial)
- Angle, pose, or level of detail for the subject
- Desired tonal contrast (higher-contrast bold outlines vs. finer, lighter overall linework) — stay strictly black and white either way

### 4. Craft the prompt

Build the generation prompt from the style guide's Master Prompt Template, filling in:

1. **Subject description** — what's being drawn, as specific as the user gave you
2. **Linework instruction** — cross-hatch, stipple, line-weight contrast, hand-drawn imperfection (verbatim from the style guide)
3. **No-color / pure-white-ground instruction** — the hard black-and-white constraint (verbatim from the style guide — do not paraphrase this away, it's the trait that makes the style work)
4. **Composition instruction** — vignette grid, single hero subject, or copy-space/editorial
5. **Closing instruction**: "no text, no watermarks"

Artwork from this skill is delivered **unsigned** — do not run the sign-artwork skill or any NOOL signature overlay on pieces made here.

Show the prompt to the user before generating so they can adjust.

### 5. Generate the image

Use the **nano-image** skill's generation script (Google Gemini) by default. If the user asks for a different model, use the equivalent skill (e.g. **zai-image** for Zhipu's `glm-image`) with the same prompt, adapting resolution/size options to that model's supported values.

```bash
cd "C:/Claude Code Projects/Art Project" && node .claude/skills/nano-image/scripts/generate.mjs \
  --prompt "<your crafted prompt>" \
  --resolution "<user-chosen: 1K|2K|4K>" \
  --aspect-ratio "<user-chosen: 1:1|16:9|9:16|21:9>"
```

Ensure `@google/genai` is installed and `public/generated-images/` exists.

**If a result comes back with any color, grey tint, or sepia wash**, regenerate with the no-color instruction repeated and strengthened (see style guide tips) — this is the one failure mode to watch for, since models default toward adding tone/color unless explicitly told not to.

### 6. Verify the background, then resize if needed

Before treating a generation as finished, **check the background is actually `#FFFFFF`**, not just visually "white":

```bash
cd "C:/Claude Code Projects/Art Project" && python -c "
from PIL import Image
img = Image.open('<generated-image-path>').convert('RGB')
w, h = img.size
for p in [(5,5), (w-5,5), (5,h-5), (w-5,h-5), (w//2,5)]:
    print(p, img.getpixel(p))
"
```

If the corners aren't ~255 across the board (Gemini in particular tends to land around 240-244, a light grey that reads as "white" to the eye but isn't), apply a linear levels stretch rather than regenerating blind — see the style guide's tips section for the exact technique (measure the background level from the corners, scale by `255/background_level` per channel, clipped at 255).

If targeting exact Samsung Frame TV dimensions, resize with Pillow LANCZOS:

```bash
cd "C:/Claude Code Projects/Art Project" && python -c "
from PIL import Image
import os

src_path = '<generated-or-whitened-image-path>'
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

Preserve the raw generated source in `public/generated-images/` — the resized version is the final deliverable.

### 7. Save the final artwork (unsigned)

Pieces from this skill are **not signed** — copy the resized artwork straight into `public/Artwork/` with no NOOL signature overlay and no other modification:

```bash
cd "C:/Claude Code Projects/Art Project" && python -c "
import shutil
shutil.copy2('<path-to-resized-3840x2160-artwork>', 'public/Artwork/nool-pen-ink-bw-<descriptive-name>.jpg')
"
```

### 8. Export into today's dated folder + Adobe Stock CSV

Every finished piece from this skill gets copied into a dated export folder and logged in an Adobe Stock bulk-upload CSV — this always happens, not just when the user asks for stock export specifically. Run the bundled script against the same unsigned resized artwork:

```bash
cd "C:/Claude Code Projects/Art Project" && python .claude/skills/Pen-Ink-BW/scripts/export_for_stock.py \
  --image "<path-to-resized-3840x2160-artwork>" \
  --title "<descriptive title, ~10-15 words, no ALL CAPS, no keyword stuffing>" \
  --keywords "<15-30 comma-separated keywords covering subject, technique, black and white, mood>" \
  --category <ID from references/adobe-stock-categories.md>
```

This:
- Creates (or reuses) `public/out/<YYYY-MM-DD>/` for today's date — every piece generated the same day lands in the same folder
- Copies the artwork into that folder
- Appends a row to `adobe-stock-metadata.csv` in that folder (creating it with the correct header if it doesn't exist yet)

Read `references/adobe-stock-categories.md` for the category ID table and title/keyword conventions before filling in `--title`, `--keywords`, and `--category` — pick whichever category best matches the actual subject (this skill spans all 21 categories, not just one). Write keywords and title yourself based on the actual subject and technique used — don't reuse a generic placeholder across different pieces. Include "black and white" / "monochrome" / "pen and ink" in the keyword list since that's a key searchable trait of this style.

By the end of a session, the dated folder is a ready-to-zip Adobe Stock upload batch: the artwork files plus one CSV covering all of them.

### 9. Present the result

Show the user:
- The image path (e.g., `public/Artwork/nool-pen-ink-bw-<name>.jpg`)
- Dev server URL: `/Artwork/<filename>`
- Dimensions and file size
- The dated export folder path and CSV path from step 8
- Whether the piece came back strictly black and white with a bare white ground, or whether any color/tint crept in and needs a regeneration with strengthened wording

Ask if they'd like adjustments, a different subject, or a switch between vignette-grid, single-hero-subject, and copy-space/editorial composition.

## Tips for great results

- **Never drop the "no color, pure white ground" instruction** from the prompt, no matter the subject — models default toward adding a grey or sepia tint unless explicitly told not to. If a result comes back with any tint or wash, regenerate with the instruction repeated and strengthened (see style guide tips).
- **Always verify actual pixel values in the background**, don't just eyeball it — see step 6. This is the single most common way a piece silently fails the "100% white" requirement.
- **Tonal range must come from line density, not fill** — cross-hatching, stippling, and line-weight contrast are the only tools for shadow and depth. If a result looks flat, ask for stronger tonal range built from denser hatching, not a grey fill.
- **Name the material, not just "cross-hatching"** — "cross-hatched fur", "stippled stone", "hatched fabric folds" gets a more accurate texture than "cross-hatching" alone, since the right density/pattern differs by material.
- **Single hero subject is the safer default for wall art** — the scattered vignette-grid composition is busier and can look cluttered at a distance; only use it when the user wants that specific busy sketchbook-page or specimen-plate feel.
- **This skill replaces the old Pen-Coastal-BW** — if the user asks specifically for coastal/nautical motifs, this skill covers that too (just describe the coastal subject directly); if they want the color version of a piece, point them to the `Pen-Coastal` skill instead.
