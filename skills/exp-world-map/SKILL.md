---
name: exp-world-map
description: Generate abstract expressionist world map paintings where continents are clearly visible through interlocking organic and geometric color shapes. Uses Hofmann push-pull dynamics, high-chroma palettes, visible gestural brushwork, and Samsung Frame TV 4K output (3840x2160, 16:9). Use this skill when the user wants to create world map art, abstract map paintings, cartographic art, globe art, continent art, or any artwork combining world map shapes with abstract expressionist style. Also trigger on "world map", "abstract map", "exp world map", "map painting", "continent art", "globe painting", or when the user wants a map rendered as fine art.
---

# Exp-World-Map — Abstract Expressionist World Map Skill

Generate abstract expressionist paintings where the shapes of the world map continents are clearly visible and recognizable, rendered entirely in the abstract expressionist style with interlocking color shapes, push-pull dynamics, and visible impasto brushwork. Optimized for Samsung Frame TV at 3840x2160 (16:9).

## Concept

The continents (North America, South America, Europe, Africa, Asia, Australia/Oceania) emerge as clusters of abstract expressionist color shapes. Landmasses are recognizable through the arrangement of saturated color fields, not through realistic cartographic depiction. Ocean areas between continents contrast in cooler tones. The result reads as "abstract expressionist painting" first, "world map" second — but the map must be findable when you look for it.

## Style Foundation

This skill builds on the Abstract Expressionist skill. Read `references/style-guide.md` before generating — it contains the full palette, technique keywords, composition rules, and prompt templates. The key difference: instead of pure non-representational abstraction, the interlocking color shapes are arranged to form recognizable continental landmasses.

## Available Color Themes

Each theme provides a distinct palette while maintaining the abstract expressionist style. Pick a theme based on the user's request, or cycle through them for variety.

### 1. Primary Triadic (Default)
- **Landmasses**: Cadmium Red, Cadmium Yellow, Tangerine Orange
- **Oceans**: Cerulean Blue, Ultramarine, Lime Green
- **Accents**: Burnt Sienna, Magenta, Titanium White
- **Mood**: Classic Hofmann, balanced warm-cool tension

### 2. Jewel Tones
- **Landmasses**: Deep Ruby (#9B111E), Royal Purple (#7851A9), Gold (#CFB53B)
- **Oceans**: Sapphire (#0F52BA), Emerald (#50C878), Deep Teal (#008080)
- **Accents**: Amethyst (#9966CC), Burnished Copper (#B87333), Pearl White (#F5F5F5)
- **Mood**: Opulent, luxurious, rich depth with metallic energy

### 3. Warm Dominant
- **Landmasses**: Vermillion (#E34234), Cadmium Orange (#FF6103), Indian Yellow (#E3A857)
- **Oceans**: Phthalo Blue (#000F89), Viridian (#40826D), Cerulean
- **Accents**: Alizarin Crimson (#8B1A1A), Naples Yellow (#F6D365), Raw Umber
- **Mood**: Fiery, passionate, warm-advancing continents against cool ocean depths

### 4. Cool Dominant
- **Landmasses**: Cobalt Blue (#0047AB), Teal (#008080), Sage Green (#BCB88A)
- **Oceans**: Deep Indigo (#4B0082), Payne's Gray (#536878), Dark Ultramarine
- **Accents**: Ice Blue (#99FFFF), Frosted Lavender (#E6E6FA), Warm Ochre (#CC7722)
- **Mood**: Icy, meditative, cool continents floating in deep indigo voids

### 5. Earth Tones
- **Landmasses**: Raw Sienna (#D68A00), Burnt Umber (#8A3324), Terra Cotta (#E2725B)
- **Oceans**: Slate Blue (#6A8E7E), Payne's Gray, Dark Olive (#3B3C36)
- **Accents**: Ochre (#CC7722), Warm Ivory, Sap Green (#507D2A)
- **Mood**: Organic, grounded, ancient cartographic feel with selective chroma

### 6. Neon/Electric
- **Landmasses**: Hot Pink (#FF69B4), Electric Yellow (#FFFF00), Neon Orange (#FF6600)
- **Oceans**: Electric Blue (#00FFFF), Deep Purple (#301934), Vivid Magenta (#FF00FF)
- **Accents**: Acid Green (#7FFF00), Titanium White, Black structural accents
- **Mood**: Explosive, high-energy, cyberpunk-meets-action-painting

## Workflow

### 1. Determine parameters

Ask the user (or infer from context):
- **Color theme**: Which of the 6 themes above? Default: Primary Triadic.
- **Energy level**: Calm/meditative, moderate, or explosive? Default: moderate.
- **Map emphasis**: How recognizable should the continents be? "Strongly visible" (continents dominant) or "Subtly emerging" (abstract first, map second)? Default: strongly visible.

### 2. Read the style guide

Read `.claude/skills/exp-world-map/references/style-guide.md` to load the full palette, technique keywords, and prompt templates. This is the same guide as the Abstract Expressionist skill — the foundation is identical, only the subject (world map) changes.

### 3. Craft the prompt

Build the generation prompt using this structure:

```
[Style Prefix from style guide]. [World map subject — continents formed by color shapes]. [Theme-specific palette description]. [Brushwork and texture details]. [Compositional dynamics — push-pull, all-over, form tension, value anchoring, luminous activation]. [Ocean vs landmass contrast strategy]. [Energy/mood note]. Ultra-detailed gallery-quality fine art painting. No text, no watermarks.
```

**Critical prompt elements:**
- Name the continents explicitly: "North America, South America, Europe, Africa, Asia, and Australia"
- Describe the landmass-ocean contrast strategy: warm advancing landmasses vs cool receding oceans
- Include at least 4 composition rules from the style guide
- Always close with "No text, no watermarks" (NOT "no signatures")

**Example prompt (Primary Triadic theme):**
```
Oil painting on textured canvas, abstract expressionist composition with interlocking organic and geometric color shapes forming the recognizable shapes of the world map continents. The landmasses of North America, South America, Europe, Africa, Asia, and Australia emerge as clusters of warm advancing cadmium red, cadmium yellow, and tangerine orange shapes colliding against cool receding cerulean blue, ultramarine, and lime green ocean passages between them. Hans Hofmann push-pull color dynamics create spatial depth where continental forms advance and oceanic voids recede, with deep burnt sienna and raw umber anchoring continental edges and pale titanium white and warm ivory shapes activating negative space along coastlines. Thick visible impasto brushwork with physical surface relief on lighter passages, thinner fluid washes on darker ocean areas, sharp palette knife boundaries alongside soft wet-on-wet blending, complementary vibration at red-green and blue-orange boundaries, rhythmic color echo of all hues at different scales, density gradient lighter above denser below. Ultra-detailed gallery-quality fine art with all-over visual energy, deliberate compositional structure beneath gestural spontaneity, the world map clearly recognizable through the arrangement of saturated color fields rather than realistic cartographic depiction. No text, no watermarks.
```

### 4. Generate the image

Use the nano-image skill:

```bash
cd "C:/Claude Code Projects/Art Project" && node .claude/skills/nano-image/scripts/generate.mjs \
  --prompt "<your crafted prompt>" \
  --resolution "4K" \
  --aspect-ratio "16:9"
```

Ensure `public/generated-images/` exists before generating.

### 5. Resize to exact Samsung Frame TV dimensions

```bash
python -c "
from PIL import Image
img = Image.open('<generated-image-path>')
resized = img.resize((3840, 2160), Image.LANCZOS)
out = '<path-without-ext>-3840x2160.jpg'
resized.save(out, 'JPEG', quality=95)
import os
print(f'Saved: {out}')
print(f'Dimensions: {resized.size}')
print(f'File size: {os.path.getsize(out) / 1024:.0f} KB')
"
```

### 6. Sign the artwork (MANDATORY — NEVER SKIP)

Every generated world map MUST be signed with the NOOL signature before delivery. There are no exceptions. The unsigned image in `public/generated-images/` is not the final product — only the signed version in `public/Artwork/` should be presented to the user.

**Why PIL overlay, not prompt-based signing?** Gemini cannot reliably render legible text. The overlay method guarantees a clean, correctly positioned signature every time. Signature files: `public/Artwork/nool-signature.png` (black ink) and `public/Artwork/nool-signature-grey.png` (grey ink for dark backgrounds).

You can also use the **sign-artwork** skill (`/sign-artwork`) as an alternative method.

Apply the NOOL signature via PIL overlay with color-sampled tinting:

```bash
cd "C:/Claude Code Projects/Art Project" && python -c "
from PIL import Image
import os

painting_path = '<resized-image-path>'
output_path = 'public/Artwork/nool-<descriptive-name>-signed.jpg'

painting = Image.open(painting_path).convert('RGBA')
sig_src = Image.open('public/Artwork/nool-signature.png').convert('RGBA')

scale = int(painting.width * 0.042)
padding_x = 120
padding_y = 100
x = painting.width - scale - padding_x
y = painting.height - int(sig_src.height * (scale / sig_src.width)) - padding_y

sig_h = int(sig_src.height * (scale / sig_src.width))
region = painting.crop((x, y, x + scale, y + sig_h))
pixels = list(region.convert('RGB').getdata())
avg_r = sum(p[0] for p in pixels) / len(pixels)
avg_g = sum(p[1] for p in pixels) / len(pixels)
avg_b = sum(p[2] for p in pixels) / len(pixels)
brightness = (avg_r + avg_g + avg_b) / 3

print(f'Sampled zone color: RGB({avg_r:.0f}, {avg_g:.0f}, {avg_b:.0f}), brightness: {brightness:.0f}/255')

if brightness < 128:
    tint_r = min(255, int(avg_r + (255 - avg_r) * 0.30))
    tint_g = min(255, int(avg_g + (255 - avg_g) * 0.30))
    tint_b = min(255, int(avg_b + (255 - avg_b) * 0.30))
else:
    tint_r = max(0, int(avg_r * 0.55))
    tint_g = max(0, int(avg_g * 0.55))
    tint_b = max(0, int(avg_b * 0.55))

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

### 7. Present the result

Show the user ONLY the signed image — never present the unsigned version as the final product:
- The prompt used
- **Signed image path** (`public/Artwork/nool-<name>-signed.jpg`) — this is the deliverable
- Dimensions (3840x2160) and file size
- Signature tint details (sampled zone color and applied tint)
- Dev server URL: `/Artwork/<filename>`

## Tips

- **Continent visibility is the hardest part** — be explicit in the prompt about which continents should appear and how they should be formed by color shapes. Name them all.
- **Ocean-landmass contrast is essential** — without it, the map disappears into pure abstraction. Always describe the contrast strategy (warm land vs cool ocean, or theme-appropriate variant).
- **For "subtly emerging" maps**, reduce the contrast between landmass and ocean — use closer values and softer edges while keeping the continental shapes.
- **Dark anchoring passages work best along continental edges** — they define the coastlines while grounding the composition.
- **White/cream luminous shapes along coastlines** create natural highlights that reinforce the map shape.
- **Push-pull dynamics map perfectly to land-ocean**: warm advancing landmasses, cool receding oceans. This is the natural compositional strategy.
- **Generate at 4K** for Samsung Frame TV quality — include "ultra-detailed" and "gallery-quality" in prompts.
- **If the map isn't visible enough**, add more explicit continental shape descriptions to the prompt. If it's too literal, soften the edges and increase the abstract layering.
- **Always sign with NOOL** — every world map must be signed via PIL overlay before delivery. Never deliver an unsigned image. The signature file is `public/Artwork/nool-signature.png`. Use grey signature (`nool-signature-grey.png`) for very dark backgrounds.
