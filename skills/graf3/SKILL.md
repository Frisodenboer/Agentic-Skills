---
name: graf3
description: Generate spray-cartoon character graffiti artwork in the "Graf3" house style — flat cell-shaded street-mascot creatures (rats, dogs, crows, gremlins, bees, foxes) with thick charcoal-black brushy outlines, a single bright orange-peach (#F08C42) rim-halo outline tracing the silhouette, sawtooth-spiked fur edges, salmon-pink (#F2B0B8) skin accents and lightning-bolt exertion sparks, hard-white wedge eyes with no pupils, and a held narrative prop (cheese, bone, spray can, weapon) — all isolated on a flat dark charcoal wall (#1A1A1E) for Samsung Frame TV / gallery / Etsy presentation. Output defaults to 3840x2160px (16:9). Inspired by NY graffiti-character mural lineage — Cope2 rats, Mighty Mo, Smith, Sento — and European cartoon-mural school (Os Gemeos, Pjotr, Bart Smeets). Use this skill when the user wants to create graffiti characters, graffiti mascots, street-art creatures, cartoon-mural mascots, spray-cartoon characters, character pieces, mural mascots, or any artwork featuring a flat cell-shaded cartoon creature with a graffiti rim-halo outline. Also trigger on "graf3", "graffiti character", "graffiti mascot", "cartoon graffiti", "rat piece", "mascot piece", "character piece", "street mascot", "graf rat", "graf cartoon", "spray cartoon", "Cope2 rat", or similar phrases.
---

# Graf3 — Spray-Cartoon Character (Street Mascot Burner) Skill

Generate fresh graffiti-character pieces in the Graf3 house style: **flat cell-shaded cartoon creatures** with **thick charcoal-black brushy outlines**, a **single bright orange-peach rim-halo outline** tracing the silhouette, **sawtooth-spiked fur edges**, **salmon-pink skin accents** and **lightning-bolt exertion sparks**, **hard-white wedge eyes**, and a **held narrative prop** — all isolated on a **flat dark charcoal wall** for Samsung Frame TV / gallery / Etsy product presentation. Each generation is a NEW original piece.

## What Defines Graf3 (vs Graf1 Wildstyle and Graf2 Chrome)

- **Subject: a single cartoon creature**, NOT letterforms. Rats, dogs, crows, gremlins, bees, foxes, raccoons. Side-profile or three-quarter view, anchored low, with a held prop.
- **Fill: flat cell-shading** — 2-3 flat tonal zones per body-part with hard-edged shadow shapes. NOT aerosol gradient fades (Graf1). NOT chrome metallic (Graf2). NOT airbrushed.
- **Outlines: a two-layer system** — thick charcoal-black brushy primary outline wrapping every feature, plus a single bright orange-peach (#F08C42) rim-halo outline tracing only the OUTER silhouette. Hard-edged, even-width, NOT a soft glow.
- **Silhouette: sawtooth-spiked fur** — fur is implied by jagged silhouette EDGES, not painted hairs. Smooth-curve on belly/snout/paws, jagged on back/head/haunches/tail base.
- **Accents: salmon-pink (#F2B0B8) lightning-bolt exertion sparks** — replaces the star-burst sparkle convention of Graf1/Graf2. 3-6 across the figure, around joints and behind the head.
- **Eyes: hard-white wedge-shaped angry eyes** with charcoal-black outline, no pupils — predator stare.
- **Background: flat dark charcoal #1A1A1E** — NOT pure white (Graf1), NOT near-black with cool-blue undertone (Graf2). A flatter, slightly warmer wall.
- **No 3D**: Graf3 is FLAT 2D. NO drop-block, NO bevel, NO extrusion.
- **No drips, no overspray halo aura, no star-bursts**: those belong to Graf1/Graf2. The rim-halo outline replaces the halo aura; the lightning sparks replace the star-bursts.
- **Samsung Frame TV locked as default output**: 3840x2160px, 16:9, always.

## Style Reference

The complete style guide lives in `references/style-guide.md` and the structured stylesheet in `style.json`. **Read both before generating** to internalize the rim-halo rule, the cell-shade lexicon, and the lightning-bolt accent system.

## A note on text and legibility

Graf3 is a CHARACTER skill, not a letter skill. There are NO letters in a Graf3 piece by design.

- **Do not ask Gemini to render any letters or words inside the piece** — no tag, no wordmark, no "spells X". The character speaks for itself.
- If the user wants letters AND a character, generate the character with Graf3 and consider adding a separate letter piece in Graf1/Graf2 style as a follow-up.

## A note on signatures — DO NOT ask Gemini to sign

**CRITICAL**: The generation prompt **must NOT ask Gemini to add a signature**. The NOOL signature is applied **only afterward** via the **sign-artwork** skill (PIL overlay with a transparent PNG signature file).

- Every generation prompt must end with: **"no text, no watermarks"**
- Do NOT include "add a signature", "sign it NOOL", or similar instructions to Gemini. Ever.
- The sign-artwork step happens AFTER generation, using a pre-rendered transparent PNG, not through the model.

## Workflow

### 1. Understand the request

Determine what the user wants:
- **What creature?** (rat, dog, crow, gremlin, bee, fox, raccoon, pigeon, cat, etc.)
- **What palette?** (Grey Rat default, Olive Gremlin, Rust Dog, Ink Crow, Toxic Bee — see palette table in style guide)
- **What pose and held prop?** (snarling rat with cheese, sneering bulldog with bone, wild-eyed crow with spray can, etc.)
- **Or just "generate one"?** — default to a snarling Grey Rat with a chunk of cheese (the reference)

If the request is vague, propose 2-3 creature/palette combinations and let the user pick.

### 2. Read the style guide

Read `.claude/skills/Graf3/references/style-guide.md` and `.claude/skills/Graf3/style.json` to load the full palette, rim-halo rule, and prompt templates.

### 3. Confirm generation parameters (or use defaults)

**Defaults (Samsung Frame TV, non-negotiable unless user overrides):**
- Aspect ratio: **16:9**
- Resolution: **4K**
- Target output dimensions: **3840x2160px exact** (resize post-generation if needed with Pillow LANCZOS)

**Optional customization:**
- Creature palette (Grey Rat default / Olive Gremlin / Rust Dog / Ink Crow / Toxic Bee)
- Rim-halo color (orange-peach #F08C42 default; cyan #5BD4E8 for orange/yellow bodies; cadmium yellow #F2C530 for very dark bodies)
- Held prop (cheese / bone / spray can / hammer / sandwich / pizza slice / fish / wallet / lock-pick / etc.)
- Pose (low-prowling / perched-and-watchful / hunched-and-locked / lunging)
- Lightning-bolt count (3-6 default)
- Subject view angle (side-profile default / three-quarter)

### 4. Craft the prompt

Build the generation prompt by combining:

1. **The style prefix** from the style guide (emphasize flat dark charcoal wall, flat cell-shade fills, two-layer outline)
2. **Subject description** — creature + pose + held prop, in narrative-mascot language (snarling, sneering, scheming, wild-eyed, hunched)
3. **Body palette** — midtone, shadow, highlight hex values for the chosen creature
4. **Outline system** — thick charcoal-black brushy outline + single bright orange-peach (or palette-swapped) rim-halo outline tracing the OUTER silhouette only
5. **Silhouette treatment** — sawtooth-spiked fur on back/head/haunches/tail, smooth on belly/snout/paws
6. **Skin accents** — salmon-pink #F2B0B8 on inner ears, nose, paw pads, tail underside, with mauve-pink #C58088 shadows
7. **Lightning-bolt sparks** — 3-6 salmon-pink lightning-bolt zig-zag exertion sparks around joints and behind the head
8. **Eye and tooth treatment** — hard-white wedge eyes outlined in black, no pupils; hard-white triangular fangs locked onto the held prop
9. **Background lock** — flat dark charcoal wall #1A1A1E, NO brick, NO concrete photo, NO white, NO other tags
10. **Closing instruction**: **"no text, no watermarks"**

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

Use the **sign-artwork** skill via PIL overlay. The signature PNG (`public/Artwork/Archive/nool-signature-grey.png` for grey ink — best on the dark charcoal wall) is overlaid with color-sampled tinting so it blends naturally.

**Dark charcoal backgrounds make the bottom-right signature zone dark, so the script will lighten the tint automatically** (the brightness-check branch).

```bash
cd "C:/Claude Code Projects/Art Project" && python -c "
from PIL import Image
import os

painting_path = '<path-to-3840x2160-image>'
output_path = 'public/Artwork/nool-graf3-<descriptive-name>-signed.jpg'

painting = Image.open(painting_path).convert('RGBA')
sig_src = Image.open('public/Artwork/Archive/nool-signature-grey.png').convert('RGBA')

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
- The signed image path (e.g., `public/Artwork/nool-graf3-<name>-signed.jpg`)
- Dev server URL: `/Artwork/<filename>`
- Dimensions (confirm exact 3840x2160) and file size
- The sampled background color and tint applied to the signature

Ask if they'd like adjustments, a creature swap, a palette swap, or a completely new piece.

## Composition Rules — Making a Real Mascot Piece, Not AI-Cartoon-Slop

These rules separate a convincing graf-character mural from generic "AI cartoon animal." **Include the relevant rules in your prompt** — Gemini responds to explicit technical instructions.

### 1. Two-layer outline system — the Graf3 hero technique

Every character has TWO outlines: a thick charcoal-black brushy primary outline wrapping the silhouette AND every internal feature, plus a single bright orange-peach rim-halo outline tracing only the OUTER silhouette. Hard-edged, even-width, no soft glow.

**Prompt phrase**: "Thick confident charcoal-black (#0F0F12) brushy aerosol-marker outline wrapping the entire silhouette and every internal feature, organic varying line-weight, NOT a uniform vector stroke. A single bright orange-peach (#F08C42) rim-halo outline tracing the OUTER silhouette only, hard-edged and even-width, sitting just outside the black outline — flat color, no gradient, no soft glow"

### 2. Flat cell-shade fills, NOT gradients

Every body-part is built from 2-3 flat tonal zones with hard-edged shadow shapes. NOT airbrushed. NOT smooth gradient. NOT photoreal texture.

**Prompt phrase**: "Flat cell-shaded fills — two to three flat tonal zones per body-part with hard-edged shadow shapes, NO gradients, NO airbrushed blends, NO photoreal texture, the look of marker-and-bucket-paint mural cartooning"

### 3. Sawtooth-spiked fur silhouette

Fur is implied by the silhouette EDGE being jagged, NOT by painting individual hairs. Cluster triangular tufts on back/head/haunches/tail base.

**Prompt phrase**: "Sawtooth-spiked fur silhouette along the back, head crown, shoulders, haunches, and tail base — fur implied by jagged triangular silhouette tufts, NOT painted hairs. Smooth-curve silhouette on belly, snout, paw pads, inner ears"

### 4. Salmon-pink skin accents

Every Graf3 creature gets 3-5 salmon-pink (#F2B0B8) skin moments — inner ears, nose tip, paw pads, tail underside, tongue. Each with a mauve-pink (#C58088) flat shadow shape. These are non-negotiable — they break the grey monotone.

**Prompt phrase**: "Salmon-pink (#F2B0B8) skin accents on inner ears, nose tip, paw pads, tail underside, with mauve-pink (#C58088) flat shadow shapes inside them — chromatic punch against the grey body"

### 5. Lightning-bolt exertion sparks

3-6 salmon-pink lightning-bolt zig-zag shapes scattered around joints and behind the head. Classic comic-book exertion mark, NOT a star-burst, NOT a sparkle. Each with a thin black outline.

**Prompt phrase**: "Three to six salmon-pink (#F2B0B8) lightning-bolt zig-zag exertion sparks scattered around joints under stress, behind the head, and near gripped objects, each with a thin charcoal-black outline — comic-book impact emphasis, NOT decorative sparkles"

### 6. Hard-white wedge eyes, no pupils

Predator-stare eyes — wedge or angled-rectangle shape, hard white, charcoal-black outline, NO pupils. Half-closed angry stare.

**Prompt phrase**: "Hard-white (#FFFFFF) wedge-shaped angry eyes outlined in charcoal-black, no pupils, half-closed predator stare — NOT round, NOT cute, NOT realistic dentition"

### 7. Hard-white triangular fangs locked onto the held prop

Teeth are blocky triangular cartoon chompers, NOT realistic dentition. If the mouth is gripping something, lock the teeth ONTO the prop visually.

**Prompt phrase**: "Hard-white (#FFFFFF) triangular fangs / blocky chompers, charcoal-black outline, locked ONTO the held object — biting into it visually, not floating near it"

### 8. Flat dark charcoal wall background — LOCKED

The piece floats on flat dark charcoal #1A1A1E. NO brick, NO concrete-photo texture, NO white, NO other tags or graffiti context.

**Prompt phrase**: "Flat dark charcoal wall background (#1A1A1E), no brick, no concrete photo, no plywood, no metal panel, no white background, no environmental shadows, no street context, no floor, no horizon, no other graffiti tags or pieces visible — the character is isolated on the flat charcoal wall"

### 9. Held prop for narrative hook

Almost every Graf3 character holds something — food, weapon, tool, stolen object. The prop tells a tiny story. Render the prop with the same flat cell-shade treatment as the body.

**Prompt phrase**: "A held narrative prop ({prop_description}) gripped in mouth, paw, or hand — rendered with the same flat cell-shade fills, hard-edged shadow shapes, and charcoal-black outline as the body, NOT photoreal, NOT vector"

### 10. Anchored low, side-profile, horizontal motion

The character anchors to the lower-middle band of the canvas, runs left-to-right, and is in side-profile or three-quarter view. NEVER front-on / facing camera.

**Prompt phrase**: "Side-profile or three-quarter view (NOT front-on), character running left-to-right across the horizontal 16:9 composition, anchored to the lower-middle band of the canvas, filling 70-85% of the width and 55-75% of the height, leaving breathing room of dark charcoal wall above and below"

### 11. Gallery / Samsung Frame framing (mural mascot mode)

Frame the result as a graffiti-mascot mural pulled into a clean gallery presentation, NOT a street photo, NOT a vector logo, NOT a polished 3D render.

**Prompt phrase**: "Hand-painted spray-cartoon mural technique, marker-and-bucket-paint look, NOT digital vector and NOT photoreal — gallery-grade Samsung Frame TV mural-character presentation, ultra-detailed every flat tonal zone clean, every outline crisp"

---

### How to Use These Rules in Prompts

For best results, include ALL 11 rules in every Graf3 generation. The two-layer outline (rule 1), flat cell-shade (rule 2), sawtooth fur silhouette (rule 3), and dark charcoal background lock (rule 8) are the four most critical — skip any of them and the piece loses its Graf3 identity.

### Master Prompt Template (Grey Rat with Cheese — reference recreation, all key rules)

```
Ultra-detailed flat cell-shaded cartoon-character graffiti mural in the spray-cartoon street-mascot style, rendered on a flat dark charcoal wall background (#1A1A1E) — no brick, no concrete photo, no plywood, no metal panel, no white background, no environmental shadows, no street context, no floor, no horizon, no other graffiti tags or pieces visible, the character is isolated on the flat charcoal wall. The character is a single snarling cartoon grey rat in side-profile, low-prowling pose, lying prone on its haunches with shoulders hunched, gripping a chunk of cadmium-yellow Swiss cheese (#F2C530, with darker yellow-orange #D08820 hole-shadows and hard-white inner-hole highlights) in its front paws and biting down on a hard-black bomb-shape with hard-white triangular fangs. Thick confident charcoal-black (#0F0F12) brushy aerosol-marker outline wrapping the entire silhouette and every internal feature, organic varying line-weight, NOT a uniform vector stroke. A single bright orange-peach (#F08C42) rim-halo outline tracing the OUTER silhouette only, hard-edged and even-width, sitting just outside the black outline — flat color, no gradient, no soft glow. Flat cell-shaded fills — fur midtone spray-grey (#9A9AA0) with deep slate-grey (#5E5E66) flat shadow shapes on the underbelly, far leg, and inside the ear, plus light spray-grey (#B8B8BE) flat highlight shapes on the top of the head and haunches, hard-edged shadow shapes, NO gradients, NO airbrushed blends. Sawtooth-spiked fur silhouette along the back, head crown, shoulders, haunches, and tail base — fur implied by jagged triangular silhouette tufts, NOT painted hairs. Smooth-curve silhouette on belly, snout, paw pads, inner ears. Salmon-pink (#F2B0B8) skin accents on the inner ear, nose tip, and paw pads, with mauve-pink (#C58088) flat shadow shapes inside them. Long pink tail curling out to the right with mauve-pink shadow underside. Five salmon-pink (#F2B0B8) lightning-bolt zig-zag exertion sparks scattered around the shoulders, behind the head, and near the gripped bomb, each with a thin charcoal-black outline. Hard-white (#FFFFFF) wedge-shaped angry eyes outlined in charcoal-black, no pupils, classic predator stare. Hard-white triangular fangs locked onto the black bomb-shape, biting into it. Two small Swiss-cheese coins on the ground in the lower-left margin, same flat cell-shade treatment. The character runs left-to-right across the 16:9 horizontal canvas, filling 80% of the width and 60% of the height, anchored to the lower-middle band. Hand-painted spray-cartoon mural technique, marker-and-bucket-paint look, NOT digital vector and NOT photoreal. Gallery-grade Samsung Frame TV mural-character presentation, ultra-detailed every flat tonal zone clean, every outline crisp. no text, no watermarks
```

---

## Tips for great results

- **Always read the style guide AND style.json first** — Graf3 vocabulary (rim-halo outline, flat cell-shade, sawtooth-spiked fur silhouette, salmon-pink lightning-bolt exertion sparks, flat dark charcoal wall) is the exact language Gemini needs.
- **Specify body tones by name AND hex** — vague "grey fur" won't work. Say "fur midtone spray-grey #9A9AA0, shadow deep slate-grey #5E5E66, highlight light spray-grey #B8B8BE".
- **Always lock the dark charcoal background** — the phrase "flat dark charcoal wall background (#1A1A1E), no brick, no concrete photo, no white" is non-negotiable. Gemini will default to a brick wall, white, or street context if you don't lock it.
- **Always specify the rim-halo color and rule** — "single bright orange-peach (#F08C42) rim-halo outline tracing the OUTER silhouette only, hard-edged, even-width, NOT a soft glow, NOT a gradient, NOT a multi-band stack." Without this phrase Gemini produces a soft halo aura instead.
- **Always close with "no text, no watermarks"** — the NOOL signature is applied AFTERWARD via sign-artwork, never by Gemini.
- **If the result comes back with a brick wall, concrete photo, or white background**, regenerate with the dark-charcoal-wall phrase repeated TWICE, and add "absolutely no brick, no concrete photo texture, no environmental wall — flat painted charcoal only".
- **If the fills come back as smooth gradients or airbrushed**, regenerate with "flat cell-shaded fills with hard-edged shadow shapes, ABSOLUTELY no gradients, no airbrush, no smooth blends — every shadow zone is a separate flat color shape" added explicitly.
- **If the rim-halo comes back as a soft glow or a gradient halo**, regenerate with "the orange-peach rim-halo outline is a HARD-EDGED FLAT line, NOT a soft glow, NOT a radial halo, NOT an airbrushed aura — it is a single even-width orange ring just outside the black outline" added explicitly.
- **If the fur is rendered as painted hairs instead of a sawtooth silhouette**, regenerate with "the fur is rendered ONLY through jagged triangular silhouette tufts on the back/head/haunches — DO NOT paint individual hair strands, the interior fur is FLAT cell-shade only" added explicitly.
- **If the character is front-on or floating dead-center**, regenerate with "side-profile view, anchored to the lower-middle band, NOT facing camera, NOT centered" added explicitly.
- **For Samsung Frame TV output**, always resize to exactly 3840x2160 with Pillow LANCZOS — don't trust the raw generator output to hit that dimension exactly.
- **Use the grey signature PNG** (`nool-signature-grey.png`) for the dark charcoal background — the black-ink PNG will not be visible.
- **Subject swap** — to swap the rat for another creature, keep ALL the Graf3 style rules and only change: (a) the creature anatomy described, (b) the body palette hex values, (c) the held prop, (d) the rim-halo color (swap to cyan or yellow if the body is orange/yellow/black).
