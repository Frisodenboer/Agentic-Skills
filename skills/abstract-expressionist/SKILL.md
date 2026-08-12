---
name: abstract-expressionist
description: Generate bold abstract expressionist paintings with interlocking organic and geometric color shapes, high-chroma triadic palettes, visible gestural brushwork, and Hofmann-style push-pull color dynamics. Inspired by Abstract Expressionism, Color-Field painting, and mid-century gestural abstraction. Use this skill when the user wants to create abstract art, abstract expressionist paintings, color-field compositions, gestural abstract work, non-representational art, Hofmann-style push-pull paintings, de Kooning-inspired abstraction, or any artwork featuring bold interlocking color shapes with visible brushwork. Also trigger on "abstract expressionist", "color field", "gestural abstract", "push pull painting", "abstract composition", "non-representational", "lyrical abstraction", "mid-century abstract", or similar phrases.
---

# Abstract-Expressionist — Gestural Color-Field Abstraction Skill

Generate bold abstract expressionist paintings featuring interlocking organic and geometric shapes in saturated triadic color harmonies with visible impasto brushwork and push-pull spatial dynamics. Inspired by Hans Hofmann, Willem de Kooning, Joan Mitchell, and the mid-century Abstract Expressionist movement.

## Style Reference

The complete style guide lives in `references/style-guide.md`. **Read it before generating** to internalize the palette, techniques, and composition rules. Key principles:

- **Palette**: Cadmium Red, Cerulean Blue, Cadmium Yellow, Lime Green, Burnt Sienna, Ultramarine, Titanium White — primary triadic harmony with complementary tension
- **Lighting**: Diffused, omnidirectional studio light — drama comes from color contrast, not chiaroscuro
- **Technique**: Thick impasto light passages, thin fluid darks, palette knife edges, scumbled transitions, wet-on-wet blending, dry-brush drag
- **Mood**: Vital, energetic, exuberant, passionate — structured chaos with deliberate control beneath spontaneity
- **Composition**: All-over composition with interlocking curvilinear and angular forms, no single focal point, push-pull color dynamics creating spatial depth

## Workflow

### 1. Understand the request

Determine what the user wants:
- **A specific color palette?** (e.g., "warm reds and golds", "cool blues and greens", "primary colors only")
- **A mood/energy level?** (e.g., "calm and meditative", "explosive and chaotic", "lyrical and flowing")
- **Or just "generate one"?** — use defaults (primary triadic palette, balanced energy, mixed organic/geometric forms)

If the request is vague, propose 2-3 directions and let the user pick.

### 2. Read the style guide

Read `.claude/skills/Abstract-Expressionist/references/style-guide.md` to load the full palette, technique keywords, and prompt templates.

### 3. Confirm generation parameters

Ask the user:

**a. Aspect ratio**
Options: `1:1` `4:3` `16:9` `3:4`
Default: **4:3** (classic canvas proportion)

**b. Resolution**
Options: `512` `1K` `2K` `4K`
Default: **2K** (good balance of detail and generation speed)

**c. Customization** (optional — only if the user hasn't already specified)
- Palette family (primary triadic, warm dominant, cool dominant, earth tones, jewel tones)
- Energy level (calm/meditative, moderate, explosive/chaotic)
- Form emphasis (organic curvilinear, angular geometric, mixed interlocking)
- Surface quality (heavy impasto, moderate texture, smooth glazes)
- Color temperature (warm dominant, cool dominant, balanced)
- Accent elements (metallic gold, neon accents, muted earth passages)

### 4. Craft the prompt

Build the generation prompt by combining:

1. **The style prefix** from the style guide (the "Full Style Prefix" or "Short Style Shorthand")
2. **Palette-specific description** based on the user's request
3. **Quality markers**: "ultra-detailed", "gallery-quality fine art", "museum-quality oil painting"
4. **Closing instruction**: "no text, no watermarks" (do NOT include "no signatures" — the artwork will be signed separately via the sign-artwork skill)

The prompt should be 3-6 sentences, rich in visual detail. Show it to the user before generating so they can adjust.

**Prompt structure:**
```
[Style Prefix] [Specific palette and form description]. [Brushwork and texture details]. [Spatial and compositional dynamics]. [Mood and energy note]. No text, no watermarks.
```

**Example:**
```
Oil painting on textured canvas, abstract expressionist composition with interlocking organic and geometric color shapes. A dynamic field of overlapping curved forms and sharp angular planes in saturated cadmium red, cerulean blue, cadmium yellow, and lime green, with deep burnt sienna and ultramarine passages providing grounding weight. Pale off-white and cream shapes activate negative space and create luminous contrast against the saturated masses. Thick visible impasto brushwork on lighter passages, thinner fluid darks, palette knife edges at color boundaries. Hans Hofmann push-pull color dynamics where warm advancing reds and yellows collide with cool receding blues and greens, creating spatial depth without perspective. Varied edge quality from sharp defined boundaries to soft wet-on-wet blurred transitions. Energetic, vital, exuberant mood with deliberate structure beneath apparent spontaneity. Gallery-quality fine art painting. No text, no watermarks.
```

### 5. Generate the image

Use the nano-image skill to generate:

```bash
cd "C:/Claude Code Projects/Art Project" && node .claude/skills/nano-image/scripts/generate.mjs \
  --prompt "<your crafted prompt>" \
  --resolution "<user-chosen: 512|1K|2K|4K>" \
  --aspect-ratio "<user-chosen: 1:1|4:3|16:9|3:4>"
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

Ask if they'd like adjustments, a variation, or a different composition.

## Composition Rules — Creating Dynamic Abstract Energy

These rules transform flat color shapes into compositions with genuine visual power. **Include the relevant rules in your prompt** — Gemini responds well to explicit compositional instructions.

### 1. Push-Pull Dynamics — Hofmann's Spatial Engine

Create depth through color temperature alone: warm, saturated colors (reds, yellows, oranges) advance toward the viewer while cool colors (blues, greens, violets) recede. This push-pull creates spatial vibration on a flat surface — the foundational technique of this style.

**Prompt phrase**: "Hans Hofmann push-pull color dynamics where warm advancing reds and yellows collide with cool receding blues and greens, creating spatial depth without linear perspective"

### 2. All-Over Composition — No Dead Zones

Energy distributed across the entire canvas. No single focal point — every region holds visual interest. The eye circulates through the composition rather than settling. This prevents the "background problem" where large areas become inert filler.

**Prompt phrase**: "All-over composition with visual energy distributed across the entire canvas, no single focal point, every region containing active color relationships and gestural marks"

### 3. Form Tension — Curves Against Angles

Interplay between soft, sweeping curvilinear forms and sharp, angular geometric planes. Curves provide lyrical flow; angles provide disruptive energy. Their collision creates the visual tension that keeps the eye engaged.

**Prompt phrase**: "Dynamic tension between sweeping curvilinear organic forms and sharp angular geometric planes cutting through them, creating constant visual conflict and resolution"

### 4. Value Anchoring — Darks Ground the Composition

Strategic placement of deep dark passages (raw umber, dark ultramarine, deep maroon) that anchor the composition and prevent it from floating. Darks provide gravitational weight. Without them, even vibrant colors feel unmoored.

**Prompt phrase**: "Strategic dark anchoring passages in deep raw umber and dark ultramarine providing gravitational weight, preventing the composition from floating entirely in mid-to-high values"

### 5. Luminous Activation — Whites as Energy Sources

Bright white and pale cream shapes act as "energy sources" — areas where the eye rests and resets. They activate negative space and create the highest contrast against saturated color masses. These are not empty spaces but deliberate luminous events.

**Prompt phrase**: "Pale off-white and cream luminous shapes acting as energy sources, creating high contrast against saturated color masses and activating negative space"

### 6. Complementary Vibration — Color Buzz

Place complementary colors (red/green, blue/orange, yellow/purple) in direct adjacency. At their boundary, the eye perceives optical vibration — a visual "buzz" that creates energy without physical movement. This is the engine of visual excitement.

**Prompt phrase**: "Complementary color vibration where saturated red meets green and blue meets orange at direct boundaries, creating optical energy at the edges between color zones"

### 7. Varied Surface — Texture as Composition

Alternate thick impasto ridges (light passages) with thin fluid washes (dark passages). The physical texture variation itself becomes a compositional element — the eye reads surface quality as spatial information. Thick = close, thin = distant.

**Prompt phrase**: "Varied paint surface with thick impasto ridges on lighter passages and thin fluid washes on darker areas, surface texture itself creating spatial depth"

### 8. Rhythmic Color Echo — Visual Rhymes

Repeat specific hues in multiple locations across the canvas at different scales and intensities. A vivid green in the upper right, a muted version of the same green in the lower left. These color echoes create visual rhymes that unify the composition across distance.

**Prompt phrase**: "Rhythmic color echoes where specific hues repeat at multiple locations in varying scales and intensities, creating visual rhymes that unify the entire composition"

### 9. Density Gradient — Gravitational Pull

Subtle variation in visual density and paint thickness across the canvas. The painting can increase in density and weight from top to bottom (lighter/airier above, heavier/denser below), creating a natural gravitational pull that mirrors physical experience.

**Prompt phrase**: "Subtle density gradient with lighter more luminous passages above transitioning to heavier denser paint application below, creating natural gravitational flow through the composition"

---

### How to Use These Rules in Prompts

**For best results**, include 3-5 of these rules explicitly in each generation prompt. Pick the ones most relevant to the desired effect:

- **Balanced, classic abstract**: Rules 1, 2, 3, 4, 5 (push-pull, all-over, form tension, value anchoring, luminous activation)
- **High energy, explosive**: Rules 1, 3, 6, 7, 9 (push-pull, form tension, complementary vibration, varied surface, density gradient)
- **Calm, meditative**: Rules 2, 5, 8, 9 (all-over, luminous activation, color echo, density gradient)
- **Complex, layered**: Rules 1, 3, 4, 7, 8 (push-pull, form tension, value anchoring, varied surface, color echo)

### Master Prompt Template (All Rules Combined)

```
[Style Prefix]. A dynamic field of interlocking organic curves and sharp angular geometric planes in saturated complementary colors. Hans Hofmann push-pull color dynamics with warm advancing colors colliding against cool receding zones. All-over composition with visual energy distributed across every region. Strategic dark anchoring passages in deep raw umber and dark ultramarine providing gravitational weight. Pale off-white luminous shapes creating high-contrast energy sources against saturated masses. Complementary color vibration at boundaries between opposing hues. Varied paint surface with thick impasto on lights and thin washes on darks. Rhythmic color echoes unifying the composition. Subtle density gradient from luminous above to dense below. No text, no watermarks.
```

---

## Tips for great results

- **Always read the style guide first** — the specific color names and technique terms make a huge difference in prompt quality.
- **Abstract art needs explicit compositional instructions** — without "push-pull", "all-over composition", or "interlocking forms", the model tends toward simple color blocks or blended gradients.
- **High chroma is essential** — explicitly name saturated colors (cadmium red, cerulean blue, lime green) to prevent the model from defaulting to muted or pastel tones.
- **Impasto and visible brushwork must be requested** — always include "thick visible impasto brushstrokes", "gestural mark-making", and "palette knife texture" or the model will produce smooth, digital-looking results.
- **If the first result is too photographic**, add "loose visible impasto brushstrokes, abstract expressionist mark-making, painted texture on canvas, non-representational" to the prompt.
- **If the result is too chaotic**, add "underlying compositional structure, deliberate color placement, balanced warm-cool distribution" to ground it.
- **For 4K generations**, always include "ultra-detailed" and "gallery-quality" to maximize detail density.
- **The style works well in both landscape and square formats** — square (1:1) creates intimate compositions, 4:3 or 16:9 creates panoramic energy fields.
- **Dark anchoring passages are critical** — without them, abstract compositions tend to float and feel incomplete. Always include deep dark passages.
- **Use composition rules explicitly in prompts** — Gemini responds to "push-pull dynamics", "all-over composition", "complementary vibration" as technical instructions.
- **White/cream luminous shapes are the secret weapon** — they prevent the composition from becoming a uniform saturated field and create the "breathing room" that lets individual colors shine.
