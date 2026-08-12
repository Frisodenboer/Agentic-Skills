---
name: graf2
description: Generate chrome-metallic blockbuster graffiti artwork in the "Graf2" house style — bold rounded-edge blockbuster letterforms with dual-metallic chrome fills (silver-chrome and copper/bronze), multi-plane volumetric 3D beveled faces with per-plane tonal shading, thick dark outlines with cyan inner-edge highlights, star-burst chrome reflections, warm amber outer-glow halos, aerosol splatter accents, and controlled drip details — floating on a dark near-black (#0A0A1A) background for Samsung Frame TV / gallery / Etsy presentation. Output defaults to 3840x2160px (16:9). Inspired by classic chrome/blockbuster graffiti writing from the New York subway era through European chrome-piece tradition, referencing the aesthetics of Seen, Daim, Loomit, and the metallic-letter lineage. Use this skill when the user wants to create chrome graffiti, metallic graffiti, blockbuster graffiti, chrome pieces, silver chrome letters, metal-fill graffiti, chrome burner, or any artwork featuring bold rounded block letters with chrome/metallic reflective fills. Also trigger on "graf2", "chrome", "metallic", "blockbuster", "silver chrome", "chrome piece", "chrome letters", "metal letters", "block letters chrome", or similar phrases.
---

# Graf2 — Chrome-Metallic Blockbuster Graffiti Skill

Generate bold chrome-metallic blockbuster graffiti pieces in the Graf2 house style: **dual-metallic chrome fills** (silver-chrome primary + copper/bronze secondary), **multi-plane volumetric 3D beveled faces** with per-plane tonal shading, **thick dark outlines with cyan inner-edge highlights**, **star-burst chrome reflections**, **warm amber outer-glow halo**, **splatter accents**, and **controlled drips** — all floating on a **dark near-black background** for Samsung Frame TV / gallery / Etsy product presentation. Each generation is a NEW original piece.

## What Defines Graf2 (vs Graf1 Wildstyle)

- **Letterforms: blockbuster block letters** — bold, rounded-edge, inflated block forms with wide proportions. NOT interlocking wildstyle arrows.
- **Fill: dual-metallic chrome** — silver-chrome (#C0C0C0 to #FFFFFF) as primary metallic with copper/bronze (#B87333, #D4956A) secondary tones. NOT aerosol gradient fades.
- **3D: multi-plane volumetric bevel** — 3-4 distinct tonal planes per letter face (highlight, midtone, shadow, deep shadow), each a different shade of the metallic fill. NOT a single-color drop-block.
- **Background: dark near-black #0A0A1A** — deep, rich, almost-black with a subtle cool-blue undertone. NOT pure white.
- **Outlines: thick dark outline + cyan inner highlight** — a heavy dark outer outline with a bright cyan (#00D4FF) highlight line running along the inner top/left edges. NOT a three-band cobalt stack.
- **Halo: warm amber/orange glow** — radiates behind the letters into the dark background, NOT cyan on white.
- **Star bursts: chrome reflections** — sharp white/cyan star bursts on the brightest chrome faces, simulating light bouncing off polished metal.
- **Samsung Frame TV locked as default output**: 3840x2160px, 16:9, always.

## Style Reference

The complete style guide lives in `references/style-guide.md`. **Read it before generating** to internalize the metallic palettes, bevel-plane system, and composition rules.

## A note on text and legibility

Gemini struggles with legible text. This skill embraces that limitation by leaning into **blockbuster's bold simplicity**.

- **Do not ask Gemini to render specific words or letters.** Phrases like "spells NOOL" or "reads GRAF" will produce mangled pseudo-text.
- **Describe the letterforms as shapes, not as characters** — "bold rounded-edge inflated block letterforms with wide proportions and smooth curved corners", "chunky geometric block shapes with soft inflated edges".
- **Accept that the piece will look like chrome blockbuster graffiti without actually spelling anything.** That is correct and authentic to the style.

## A note on signatures — DO NOT ask Gemini to sign

**CRITICAL**: The generation prompt **must NOT ask Gemini to add a signature**. The NOOL signature is applied **only afterward** via the **sign-artwork** skill (PIL overlay with a transparent PNG signature file).

- Every generation prompt must end with: **"no text, no watermarks, no signatures"**
- Do NOT include "add a signature", "sign it NOOL", or similar instructions to Gemini. Ever.
- The sign-artwork step happens AFTER generation, using a pre-rendered transparent PNG, not through the model.

## Workflow

### 1. Understand the request

Determine what the user wants:
- **A chrome palette?** (Silver Chrome default, Rose Gold, Gunmetal, Platinum Ice, Molten Copper)
- **A specific subject or integration?** (e.g., "chrome piece with a crown", "blockbuster letters wrapping a skull silhouette")
- **Or just "generate one"?** — default to Silver Chrome on dark near-black

If the request is vague, propose 2-3 chrome palettes and let the user pick.

### 2. Read the style guide

Read `.claude/skills/Graf2/references/style-guide.md` to load the full palette, bevel-plane system, and prompt templates.

### 3. Confirm generation parameters (or use defaults)

**Defaults (Samsung Frame TV, non-negotiable unless user overrides):**
- Aspect ratio: **16:9**
- Resolution: **4K**
- Target output dimensions: **3840x2160px exact** (resize post-generation if needed with Pillow LANCZOS)

**Optional customization:**
- Chrome palette (Silver Chrome default / Rose Gold / Gunmetal / Platinum Ice / Molten Copper)
- Halo intensity (tight warm glow / standard amber aura / wide mist)
- Drip count (none / 2-3 default / more)
- Star-burst count (3-5 default / more / fewer)
- 3D bevel depth (shallow / standard / deep extrusion)
- Subject integration (if the piece features a co-star like a crown, flame, skull, etc.)

### 4. Craft the prompt

Build the generation prompt by combining:

1. **The style prefix** from the style guide (emphasize dark background, metallic chrome fills, beveled 3D faces)
2. **Metallic tones** — specify the primary chrome (silver) and secondary metallic (copper/bronze) with exact tonal values per bevel plane
3. **Outline system** — specify thick dark outline + cyan inner-edge highlight
4. **3D bevel** — specify the 3-4 tonal planes (highlight, midtone, shadow, deep shadow) with their specific shade values
5. **Halo color** — warm amber/orange matched to the palette
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

Use the **sign-artwork** skill via PIL overlay. The signature PNG (`public/Artwork/nool-signature-grey.png` for grey ink on dark backgrounds) is overlaid with color-sampled tinting so it blends naturally.

**Dark backgrounds make the bottom-right signature zone very dark, so the script will lighten the tint automatically** (the brightness-check branch).

```bash
cd "C:/Claude Code Projects/Art Project" && python -c "
from PIL import Image
import os

painting_path = '<path-to-3840x2160-image>'
output_path = 'public/Artwork/nool-graf2-<descriptive-name>-signed.jpg'

painting = Image.open(painting_path).convert('RGBA')
sig_src = Image.open('public/Artwork/nool-signature-grey.png').convert('RGBA')

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
- The signed image path (e.g., `public/Artwork/nool-graf2-<name>-signed.jpg`)
- Dev server URL: `/Artwork/<filename>`
- Dimensions (confirm exact 3840x2160) and file size
- The sampled background color and tint applied to the signature

Ask if they'd like adjustments, a palette swap, or a completely new piece.

## Composition Rules — Making a Real Chrome Piece, Not AI-Graffiti-Slop

These rules separate a convincing chrome blockbuster piece from generic "AI graffiti." **Include the relevant rules in your prompt** — Gemini responds to explicit technical graffiti instructions.

### 1. Dual-metallic chrome fills — the Graf2 hero technique

Every letter body is a **dual-metallic chrome surface** with distinct tonal zones: a bright silver-chrome highlight zone (near-white, #E8E8E8 to #FFFFFF) on the upper-left face, transitioning through a midtone silver (#B0B0B0 to #C0C0C0) on the center face, into a copper/bronze-warm shadow (#B87333 to #D4956A) on the lower-right face. The metallic sheen follows a consistent light direction across the entire piece.

**Prompt phrase**: "Letter bodies filled with a dual-metallic chrome effect — a bright silver-chrome highlight zone of near-white (#E8E8E8 to #FFFFFF) on the upper-left face, transitioning smoothly through a midtone silver (#B0B0B0 to #C0C0C0) on the center face, into a warm copper-bronze shadow (#B87333 to #D4956A) on the lower-right face, consistent light direction across the entire piece, polished-metal reflective surface"

### 2. Thick dark outline with cyan inner-edge highlight

Every letter has a heavy dark outline with a bright cyan (#00D4FF) highlight running along the inner top and left edges. This is NOT a three-band stack like Graf1 — it is a single thick dark outline with one internal highlight accent.

**Prompt phrase**: "Thick dark charcoal-black (#1A1A2E) outline around every letter, approximately 4-5% of letter height in width, with a bright electric-cyan (#00D4FF) highlight line running along the inside of the outline on the top and left edges only, creating a lit-edge effect where light catches the chrome surface"

### 3. Multi-plane volumetric 3D beveled faces

Each letter extrudes in 3D with **3-4 distinct tonal planes** visible — not a flat-color block. The top face is brightest (near-white chrome), the front face is midtone silver, the bottom/right shadow face is dark chrome to near-black, and the deep shadow at the connection points is nearly black. Every bevel plane has a different tonal value.

**Prompt phrase**: "Multi-plane volumetric 3D beveled construction on every letter — the top bevel face is bright near-white chrome (#E0E0E0), the front face is midtone silver (#A0A0A0), the bottom-right shadow face transitions from dark gunmetal (#404050) to deep charcoal (#1A1A2E), and the deepest shadow crevices approach near-black (#0A0A14), with a thin white hairline highlight separating each tonal plane"

### 4. Bold rounded-edge blockbuster letterforms

Letters are inflated, chunky, rounded-edge block forms — wide proportions, soft curved corners, bold presence. NOT sharp interlocking wildstyle arrows.

**Prompt phrase**: "Bold inflated blockbuster letterforms with wide proportions and soft rounded corners, chunky geometric block shapes with smooth curved edges, inflated pillow-like volume, letters sitting side by side in a confident row, NOT interlocking or overlapping"

### 5. Dark near-black background — LOCKED

The piece floats on a dark, rich, near-black background. NO white, no concrete, no brick.

**Prompt phrase**: "Dark near-black background (#0A0A1A) with a subtle cool-blue undertone, deep rich darkness, no wall texture, no concrete, no brick, no environmental context, no floor, no horizon — the piece floats on dark void like a gallery exhibition on dark museum walls, Samsung Frame TV in night-mode presentation"

### 6. Warm amber/orange outer-glow halo

A warm amber-to-orange glow radiates behind the letters into the dark background, creating depth and separation. Dense warm glow near the letter silhouette, dissolving into the dark background at the edges.

**Prompt phrase**: "Soft warm amber-orange airbrush glow aura radiating outward behind the letters into the dark background, dense warm amber (#E8943A) near the letter silhouette dissolving gradually and completely into the dark near-black (#0A0A1A) background at the outer edge, irregular silhouette-following shape, creating depth and atmospheric separation"

### 7. Star-burst chrome reflections

3-5 sharp white or cyan-tinted four-point star bursts placed on the brightest chrome faces, simulating light reflecting off polished metal surfaces. These are specular highlights, not decorative sparkles.

**Prompt phrase**: "Three to five sharp white or pale-cyan (#7FDCF4) four-point star-burst specular reflections on the brightest chrome highlight faces, each placed where polished metal would catch direct light, varied in size, small and crisp like reflections on chrome bumpers or polished steel"

### 8. Chrome-matched controlled drips

2-3 drips maximum, each inheriting the tonal value of its parent letter's lower chrome shadow (dark silver or copper-bronze), hanging from letter bottoms with rounded bead tips.

**Prompt phrase**: "Two or three controlled chrome drips hanging from select letter bottoms, each drip inheriting the dark chrome or copper-bronze tonal value of its parent letter's shadow face, each ending in a small rounded bead, outlined in the dark outline color"

### 9. Aerosol splatter accents

A scatter of fine paint speckles around the letter edges in metallic tones (silver, copper, dark chrome), adding aerosol realism and proving this is spray-can work, not a vector render.

**Prompt phrase**: "Light scatter of fine metallic micro-splatter dots around the letter edges — tiny specks of silver, copper, and dark chrome — simulating aerosol overspray, adding spray-paint authenticity"

### 10. Gallery / Samsung Frame framing (dark mode)

Frame the result as a dark-mode gallery presentation — museum wall, Samsung Frame TV at night, premium dark-background product shot.

**Prompt phrase**: "Gallery-grade dark-mode presentation, museum-exhibition aesthetic, Samsung Frame TV night-mode artwork composition, premium product-photograph-on-dark styling, ultra-detailed every chrome tonal plane smooth, every bevel edge crisp"

---

### How to Use These Rules in Prompts

For best results, include rules 1, 2, 3, 4, 5, 6, 7, 9, 10 in every generation (rule 8 drips are optional but recommended). Don't skip the dual-metallic specification (rule 1) — it is the whole point of Graf2.

### Master Prompt Template (Silver Chrome default, all key rules)

```
Ultra-detailed photorealistic chrome-metallic blockbuster graffiti piece rendered as a premium dark-mode product shot on a dark near-black background (#0A0A1A) with subtle cool-blue undertone — no wall, no concrete, no grit, no environmental context, no floor, no horizon, the piece floats on dark void like a gallery exhibition on dark museum walls. Bold inflated blockbuster letterforms with wide proportions and soft rounded corners fill the horizontal composition — chunky geometric block shapes with smooth curved edges, inflated pillow-like volume, letters sitting side by side in a confident row. Letter bodies are filled with a dual-metallic chrome effect — a bright silver-chrome highlight zone of near-white (#E8E8E8 to #FFFFFF) on the upper-left face, transitioning smoothly through a midtone silver (#B0B0B0 to #C0C0C0) on the center face, into a warm copper-bronze shadow (#B87333 to #D4956A) on the lower-right face, consistent light direction across the entire piece, polished-metal reflective surface. Thick dark charcoal-black (#1A1A2E) outline around every letter with a bright electric-cyan (#00D4FF) highlight line running along the inside of the outline on the top and left edges only. Multi-plane volumetric 3D beveled construction on every letter — top bevel face bright near-white chrome (#E0E0E0), front face midtone silver (#A0A0A0), bottom-right shadow face dark gunmetal (#404050) to deep charcoal (#1A1A2E), deepest crevices near-black (#0A0A14), thin white hairline separating each tonal plane. Soft warm amber-orange airbrush glow aura behind the letters, dense amber (#E8943A) near the silhouette dissolving into dark near-black at the outer edge. Three to five sharp white or pale-cyan four-point star-burst specular reflections on the brightest chrome faces. Two or three controlled chrome drips from letter bottoms, each in dark chrome or copper-bronze matching the parent letter shadow, ending in small rounded beads. Light scatter of fine metallic micro-splatter dots around letter edges. Clean-cut chrome-piece technique, confident polished execution. Gallery-grade dark-mode presentation, ultra-detailed, every chrome tonal plane smooth, every bevel edge crisp. No text, no watermarks, no signatures.
```

---

## Tips for great results

- **Always read the style guide first** — Graf2 vocabulary (dual-metallic chrome, multi-plane bevel, cyan inner-edge highlight, warm amber halo, dark background) is the exact language Gemini needs.
- **Specify metallic tones by name AND hex** — vague "chrome fill" won't work. Say "silver-chrome highlight #E8E8E8 to #FFFFFF, midtone silver #B0B0B0 to #C0C0C0, copper-bronze shadow #B87333 to #D4956A".
- **Always lock the dark background** — the phrase "dark near-black background (#0A0A1A) with subtle cool-blue undertone" is non-negotiable. Gemini will default to white or a wall if you don't lock it.
- **Always close with "no text, no watermarks, no signatures"** — the NOOL signature is applied AFTERWARD via sign-artwork, never by Gemini.
- **If the result comes back with a white or wall background**, regenerate with the dark-background phrase repeated TWICE, and add "absolutely no white background, no wall texture, no concrete under any circumstances, pure dark void background".
- **If the chrome looks flat gray**, regenerate with "dual-metallic chrome with distinct highlight, midtone, and shadow zones, polished-metal reflective sheen, NOT flat gray fill" added explicitly.
- **If the 3D looks like a single-color block**, regenerate with "three to four distinct tonal planes on the 3D bevel — visible tonal step between highlight face, midtone face, and shadow face" added explicitly.
- **For Samsung Frame TV output**, always resize to exactly 3840x2160 with Pillow LANCZOS — don't trust the raw generator output to hit that dimension exactly.
- **Subject integration** — when a subject (crown, skull, flame, etc.) is combined with the blockbuster letters, describe HOW they integrate (chrome-rendered to match the metallic palette, forming part of the letter structure, silhouette behind, etc.). Don't just say "and a crown" — say "and a chrome-rendered crown integrated into the top of the letterforms, its metallic surface matching the dual-chrome treatment with highlight, midtone, and copper-bronze shadow faces".
- **Use the grey signature PNG** (`nool-signature-grey.png`) for dark backgrounds — the black-ink PNG will not be visible on the dark background.
