---
name: graf1
description: Generate wildstyle graffiti artwork in the "Graf1" house style (v2) — interlocking arrow-tipped wildstyle letterforms with multi-stop aerosol gradient fills (yellow-to-red, cyan-to-indigo, etc.), three-band outline stacks, gradient-shaded 3D drop-blocks, radial cyan overspray halos, star-burst and crack highlights, and gradient-matched drip accents — floating on a pure white (#FFFFFF) studio-isolated background for Samsung Frame TV / gallery / Etsy presentation. Output defaults to 3840x2160px (16:9). Inspired by classic New York / European wildstyle writing from the Cope2, Totem2, Does, and Revok lineage. Use this skill when the user wants to create graffiti, street art, wildstyle pieces, spray paint art, writer pieces, aerosol gradient fades, burner art, or any artwork featuring interlocking spray-painted letterforms. Also trigger on "graf", "graf1", "graffiti", "wildstyle", "spray paint", "aerosol", "burner", "writer piece", "aerosol gradient", "wildstyle fade", or similar phrases.
---

# Graf1 — Wildstyle Graffiti Skill (v2 — Gradient Aerosol on White)

Generate fresh wildstyle graffiti pieces in the v2 Graf1 house style: **multi-stop aerosol gradient fills**, **three-band outline stacks**, **gradient-shaded 3D drop-blocks**, **radial cyan halos dissolving into pure white**, and **star-burst + crack highlights + controlled drips** — all floating on a clean **pure-white background** for Samsung Frame TV / gallery / Etsy product presentation. Each generation is a NEW original piece.

## What Changed in v2 (if you're coming from v1)

- **Background: pure white #FFFFFF**, studio-isolated. NO more concrete wall, grit, paint ghosts, or street context.
- **Fills: three-stop aerosol gradients**, not flat single colors. Solar Burner (yellow→orange→red), Ice Cobalt (cyan→blue→indigo), Emerald Wave, Magenta Heat, Flame Tongue.
- **Outlines: three-band stack** — thin white inner highlight + thick primary outline + razor-thin dark keyline. NOT a single flat cobalt line.
- **3D block: gradient-shaded** (cobalt→navy→near-black), not flat fill.
- **Halo: radial gradient dissolving into white**, not into dark concrete.
- **Drips: gradient-matched** to parent letter, 2-4 across the piece.
- **Samsung Frame TV locked as default output**: 3840x2160px, 16:9, always.
- **No handstyle footer tags** (they reintroduced a street feel — v2 is gallery-isolated).

## Style Reference

The complete style guide lives in `references/style-guide.md`. **Read it before generating** to internalize the gradient palettes, outline stack, and composition rules.

## A note on text and legibility

Gemini struggles with legible text. This skill embraces that limitation by leaning into **wildstyle's inherent abstraction**. Real wildstyle is designed to be hard to read.

- **Do not ask Gemini to render specific words or letters**. Phrases like "spells NOOL" or "reads GRAF" will produce mangled pseudo-text.
- **Describe the letterforms as shapes, not as characters** — "interlocking arrow-tipped abstract letterforms", "serif-extended angular glyphs", "interwoven geometric ribbon forms".
- **Accept that the piece will look like graffiti without actually spelling anything.** That is correct and authentic to wildstyle.

## A note on signatures — DO NOT ask Gemini to sign

**CRITICAL**: The generation prompt **must NOT ask Gemini to add a signature**. The NOOL signature is applied **only afterward** via the **sign-artwork** skill (PIL overlay with a transparent PNG signature file).

- Every generation prompt must end with: **"no text, no watermarks, no signatures"**
- Do NOT include "add a signature", "sign it NOOL", or similar instructions to Gemini. Ever.
- The sign-artwork step happens AFTER generation, using a pre-rendered transparent PNG, not through the model.

## Workflow

### 1. Understand the request

Determine what the user wants:
- **A gradient palette?** (Solar Burner, Ice Cobalt, Emerald Wave, Magenta Heat, Flame Tongue)
- **A specific subject or integration?** (e.g., "wildstyle with Statue of Liberty", "graf piece featuring a rocket")
- **Or just "generate one"?** — default to Solar Burner on pure white

If the request is vague, propose 2-3 gradient palettes and let the user pick.

### 2. Read the style guide

Read `.claude/skills/Graf1/references/style-guide.md` to load the full palette, outline stack, and prompt templates.

### 3. Confirm generation parameters (or use defaults)

**Defaults (Samsung Frame TV, non-negotiable unless user overrides):**
- Aspect ratio: **16:9**
- Resolution: **4K**
- Target output dimensions: **3840x2160px exact** (resize post-generation if needed with Pillow LANCZOS)

**Optional customization:**
- Gradient palette (Solar Burner default / Ice Cobalt / Emerald Wave / Magenta Heat / Flame Tongue)
- Halo intensity (tight / standard / wide mist)
- Drip count (none / 2-4 default / more)
- Star-burst count (4-6 default / more / fewer)
- Subject integration (if the piece features a co-star like a silhouette, flame, crown, etc.)

### 4. Craft the prompt

Build the generation prompt by combining:

1. **The v2 style prefix** from the style guide (emphasize pure white background, gradient fills, 3-band outlines)
2. **Palette stops** — specify the 3 color stops of the gradient explicitly
3. **Outline stack** — specify white inner highlight + primary outline color + keyline shadow color
4. **3D block** — specify the gradient stops inside the block
5. **Halo color** — matched to the palette
6. **Subject integration** (if any)
7. **Closing instruction**: **"no text, no watermarks, no signatures"**

Show the prompt to the user before generating so they can adjust.

### 5. Generate the image (targeting 4K)

Use the nano-image skill. **Always request 4K at 16:9**:

```bash
cd "C:/Claude Code Projects/Art Project" && node .claude/skills/nano-image/scripts/generate.mjs \
  --prompt "<your crafted prompt>" \
  --resolution "4K" \
  --aspect-ratio "16:9"
```

Ensure `@google/genai` is installed and `public/generated-images/` exists.

### 6. Resize to exact 3840x2160 (mandatory — Samsung Frame TV spec)

Nano-image's 4K output comes back at a slightly different resolution (e.g., 5504x3072 or similar). **Always resize to exactly 3840x2160 with Pillow LANCZOS** before signing:

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

Preserve the raw 4K source in `public/generated-images/` — the resized 3840x2160 version is what feeds into signing.

### 7. Sign the artwork (PIL overlay with NOOL signature)

Use the **sign-artwork** skill via PIL overlay. The signature PNG (`public/Artwork/nool-signature.png` for black ink, `public/Artwork/nool-signature-grey.png` for grey ink on dark zones) is overlaid with color-sampled tinting so it blends naturally.

**Pure-white backgrounds make the bottom-right signature zone very bright, so the script will darken the tint automatically** (the brightness-check branch).

```bash
cd "C:/Claude Code Projects/Art Project" && python -c "
from PIL import Image
import os

painting_path = '<path-to-3840x2160-image>'
output_path = 'public/Artwork/nool-graf1-<descriptive-name>-signed.jpg'

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

**Do NOT attempt to sign via prompt instructions** (e.g., "add signature reading 'Nool'"). Gemini cannot reliably render legible text. The PIL overlay is the only reliable method.

### 8. Present the result

Show the user:
- The signed image path (e.g., `public/Artwork/nool-graf1-<name>-signed.jpg`)
- Dev server URL: `/Artwork/<filename>`
- Dimensions (confirm exact 3840x2160) and file size
- The sampled background color and tint applied to the signature

Ask if they'd like adjustments, a palette swap, or a completely new piece.

## Composition Rules — Making a Real Burner, Not AI-Graffiti-Slop

These rules separate a convincing v2 wildstyle piece from generic "AI graffiti." **Include the relevant rules in your prompt** — Gemini responds to explicit technical graffiti instructions.

### 1. Gradients, NOT flat fills — the v2 hero technique

Every letter body is a **three-stop aerosol gradient** along one axis (usually top→bottom). Specify the stops by name/hex, the direction, and the smooth transition through the middle third. This is the #1 thing that separates v2 from amateur AI graffiti.

**Prompt phrase**: "Letter bodies filled with a smooth three-stop aerosol gradient fading from [stop 1] at the top through [stop 2] in the middle to [stop 3] at the bottom, transition zone occupying the middle third, pure stop colors at the outer ends"

### 2. Three-band outline stack

Every letter has three outline layers: thin white inner highlight + thick primary outline + razor-thin dark keyline. Spell this out.

**Prompt phrase**: "Three-band outline stack around every letter — a thin titanium-white inner highlight line hugging the upper-left edges of the fill, a thick saturated [primary outline color] primary outline looping the letter, and a razor-thin [keyline color] keyline shadow just outside the primary outline"

### 3. Interlock, don't stack

Wildstyle letters weave into each other — one letter's arrow becomes another letter's crossbar. NOT side-by-side.

**Prompt phrase**: "Tightly interlocking wildstyle letterforms that overlap and share edges, arrows of one letter piercing through the counter-space of the next, one continuous ribbon of shapes"

### 4. Arrow tips and serif-flag extensions

Every letter extension ends in either an arrow tip or a flag-shaped serif. Counter-spaces carved into angular shards.

**Prompt phrase**: "Arrow-tipped terminations and flag-serif extensions on every letter, angular shard-shaped counter-spaces, no round bubble forms"

### 5. Pure white background — LOCKED

The piece floats on pure white. NO wall, no concrete, no grit, no street context.

**Prompt phrase**: "Pure white background (#FFFFFF), studio isolation, no wall texture, no concrete, no brick, no grit, no environmental shadows, no street context, no floor, no horizon — the piece floats on clean flat white like a gallery print or Samsung Frame TV artwork or Etsy product listing"

### 6. Gradient-shaded 3D drop-block on ONE consistent angle

The 3D extrusion projects uniformly down-left, and it has its OWN gradient inside (primary-outline-color at the top edge → darker mid → near-black at the far edge).

**Prompt phrase**: "Consistent 3D drop-block extrusion projecting uniformly down and to the lower-left for the entire piece, the block itself filled with a gradient fading from [primary outline color] at the top edge through darker tones to near-black at the far edge, with a 1-pixel white hairline highlight on the top rim"

### 7. Radial cyan halo dissolving into white

The halo is a radial gradient, densest near the letters, dissolving COMPLETELY into pure white at the outer edge.

**Prompt phrase**: "Soft radial [halo color] airbrush halo aura radiating outward behind the letters, dense near the silhouette and dissolving gradually and completely into pure white at the outer edge, irregular silhouette-following shape (not a perfect circle)"

### 8. Star bursts AND crack highlights

4-6 four-point white star bursts at arrow tips and sharp corners PLUS 2-3 hairline crack-highlight lightning lines on top-facing letter surfaces.

**Prompt phrase**: "Four to six small white four-point star-burst highlight sparkles at select arrow tips and sharp serif corners, varied in size; plus two or three small titanium-white crack-highlight lightning-line reflections cutting across the top faces of the letters"

### 9. Gradient-matched drips

2-4 drips maximum, each inheriting the BOTTOM color stop of its parent letter, hanging from arrow tips or serif bottoms, with small rounded bead tips.

**Prompt phrase**: "Two to four controlled aerosol drips hanging from select arrow tips and serif bottoms, each drip gradient-matched to the bottom stop of its parent letter's fill, each ending in a small rounded bead, outlined in the primary outline color"

### 10. Gallery / Samsung Frame framing

Frame the result as a studio-isolated product photograph, not a street document.

**Prompt phrase**: "Gallery-grade presentation, studio-isolated product photograph aesthetic, Samsung Frame TV artwork composition, Etsy product listing cleanliness, ultra-detailed every gradient stop smooth"

---

### How to Use These Rules in Prompts

For best results, include rules 1, 2, 3, 5, 6, 7, 8, 9, 10 in every v2 generation (rule 4 is optional but recommended). Don't skip the gradient specification (rule 1) — it's the whole point of v2.

### Master Prompt Template (v2 Solar Burner, all key rules)

```
Ultra-detailed photorealistic wildstyle graffiti piece rendered as a studio-isolated product shot on a pure white background (#FFFFFF) — no wall, no concrete, no grit, no environmental context, no floor, no horizon, the piece floats on clean flat white like a gallery print or Samsung Frame TV artwork. Tightly interlocking arrow-tipped wildstyle letterforms fill the horizontal composition — abstract angular glyphs with serif-extended flags, shard-shaped counter-spaces, semi-illegible in the classic writer tradition, arrows of one letter piercing through the counter-space of the next. Letter bodies are filled with a smooth three-stop aerosol gradient fading from cadmium yellow (#F8D12E) at the top through burnt orange (#EF7A1A) in the middle to crimson red (#C8262E) at the bottom, transition zone occupying the middle third. Three-band outline stack around every letter: a thin titanium-white inner highlight on the upper-left edges of the fill, a thick saturated cobalt-electric-blue (#1F5FD8) primary outline looping the letter, and a razor-thin deep navy-black (#0A1530) keyline shadow just outside the primary outline. Consistent 3D drop-block extrusion projecting uniformly down and to the lower-left for the entire piece, the block itself fading from cobalt at the top edge through navy to near-black at the far edge, with a 1-pixel white hairline highlight on the top rim. Soft radial cyan airbrush halo aura radiating outward behind the letters, dense cyan near the silhouette dissolving gradually and completely into pure white at the outer edge, irregular silhouette-following shape. Four to six small white four-point star-burst highlight sparkles at select arrow tips and sharp serif corners, varied in size, plus two or three small white crack-highlight lightning-line reflections across the top faces. Three controlled aerosol drips hanging from lower arrow tips, each gradient-matched to the bottom orange-red stop of its parent letter, ending in small rounded beads. Light scatter of micro-splatter dots around the letter edges for aerosol realism. Clean-cut seasoned-writer aerosol technique, confident controlled lines, no hesitation marks. Gallery-grade presentation, ultra-detailed, every gradient stop smooth, every outline crisp. No text, no watermarks, no signatures.
```

---

## Tips for great results

- **Always read the style guide first** — v2 vocabulary (three-stop gradient, three-band outline stack, gradient-matched drip, radial halo dissolving into white) is the exact language Gemini needs.
- **Specify gradient stops by name AND hex** — vague "yellow gradient" won't work. Say "cadmium yellow #F8D12E → burnt orange #EF7A1A → crimson #C8262E".
- **Always lock the pure-white background** — the phrase "pure white background (#FFFFFF), studio isolation, no wall, no concrete, no grit, no street context" is non-negotiable. The first thing Gemini tries to add is a wall.
- **Always close with "no text, no watermarks, no signatures"** — the NOOL signature is applied AFTERWARD via sign-artwork, never by Gemini.
- **If the result comes back with a wall or concrete**, regenerate with the white-background phrase repeated TWICE in the prompt, and add "absolutely no wall texture under any circumstances".
- **If the gradients look flat**, regenerate with "smooth aerosol gradient fade, NOT flat fill, progressive pressure release across the letter body" added explicitly.
- **If the outlines look like a single fat line**, regenerate with "three DISTINCT outline bands, visible separation between the white inner highlight, the primary outline, and the keyline shadow" added explicitly.
- **For Samsung Frame TV output**, always resize to exactly 3840x2160 with Pillow LANCZOS — don't trust the raw generator output to hit that dimension exactly.
- **Subject integration** — when a subject (Statue of Liberty, rocket, flame) is combined with the wildstyle, describe HOW they integrate (color-locked to the palette, forming an aerosol shape, silhouette behind, etc.). Don't just say "and a Statue of Liberty" — say "and a cobalt-to-purple gradient Statue of Liberty silhouette color-locked to the outline palette, her torch flame rendered in the yellow-to-red fill gradient".
