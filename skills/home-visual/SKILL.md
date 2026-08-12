---
name: home-visual
description: Generate lifestyle interior mockups showing an artwork in realistic home settings using EXACT artwork compositing (Pillow overlay, not AI approximation). Use this skill when the user wants to see their artwork in a room, create home visuals, interior mockups, lifestyle shots, or "art in context" images. Trigger on "home visual", "room mockup", "interior mockup", "lifestyle mockup", "art in room", "show in a room", "in situ", or when the user provides an artwork and asks to visualize it in a home setting.
---

# Home Visual — Interior Lifestyle Mockup Skill (Exact Artwork Compositing)

Takes an existing artwork and generates lifestyle interior mockups with the **exact same artwork** composited into each room. The process is:

1. **Gemini** generates empty room backgrounds (no artwork on walls)
2. **Pillow** composites the user's actual artwork onto the wall with a realistic frame and drop shadow

This guarantees the artwork in every mockup is a pixel-perfect match — not an AI approximation.

## Fixed Parameters

- **Room photos**: 2K resolution, 1:1 (square), generated via nano-image
- **Count**: 3 mockups per run (default), or more if the user requests extra rooms
- **Artwork**: Used as-is via Pillow overlay (exact pixel match)

## Workflow

### 1. Get the artwork path

The user must provide or reference the artwork image to place in the mockups. Accept file paths from:
- `public/Artwork/` (signed artwork)
- `public/generated-images/` (raw generated images)
- Any local path the user provides

### 2. Analyze the artwork

Read the artwork image and extract:
- **Dominant colors** (primary + accent palette, e.g., terracotta, sage green, goldenrod, lavender)
- **Style** (impressionist, abstract, photographic, minimalist, etc.)
- **Subject** (landscape, portrait, abstract, botanical, etc.)
- **Overall mood** (calm, vibrant, moody, bright, warm, etc.)

This analysis is critical — it drives BOTH the interior styling AND the color palette of the room itself.

### 3. Color-match the interior to the artwork

**This is the most important step for convincing mockups.** The room interior must feel like it was professionally designed to showcase this specific painting.

#### 3a. Analyze the artwork's color palette

Read the artwork image and extract the dominant colors using Python/Pillow:

```bash
python -c "
from PIL import Image
img = Image.open('<ARTWORK_PATH>').convert('RGB')
# Sample multiple zones
zones = {
    'sky/top': (img.width//2, img.height//6),
    'midground': (img.width//2, img.height//2),
    'foreground/bottom': (img.width//2, img.height*5//6),
}
for name, (x,y) in zones.items():
    r = img.crop((x-50, y-50, x+50, y+50))
    pixels = list(r.getdata())
    avg = tuple(int(sum(c)/len(c)) for c in zip(*pixels))
    print(f'{name}: RGB{avg}')
# Also get overall palette
small = img.resize((50, 50))
pixels = list(small.getdata())
from collections import Counter
# Quantize to dominant colors
quantized = img.quantize(colors=8, method=Image.Quantize.MEDIANCUT)
palette = quantized.getpalette()[:24]
print('Dominant palette:', [tuple(palette[i:i+3]) for i in range(0, 24, 3)])
"
```

Identify:
- **Dominant colors** (2-3 main tones covering the most area)
- **Accent colors** (1-2 vivid spots that add energy)
- **Temperature** (warm, cool, or balanced)
- **Darkest tones** (for furniture/structural elements)

#### 3b. Pass the artwork to Gemini as a reference image

**CRITICAL: Always pass the artwork image to Gemini when generating room backgrounds.** This is the most effective way to achieve color harmony — Gemini can SEE the painting and match the room tones directly, rather than relying on text descriptions alone.

When generating each room background with nano-image, include the `--reference-image` flag:

```bash
node .claude/skills/nano-image/scripts/generate.mjs \
  --prompt "<room prompt with color instructions>" \
  --resolution "2K" \
  --aspect-ratio "1:1" \
  --reference-image "<ARTWORK_PATH>"
```

The prompt should still include explicit color instructions (see below), but the reference image gives Gemini the full visual context.

#### 3c. Weave the painting's colors into the room description

In addition to passing the image, describe the color matching explicitly in the room prompt:

- **Wall color** — warm cream, soft white, or light tinted to complement the palette
- **Throw pillows and textiles** — use the painting's accent colors
- **Rugs** — muted tones pulled from the painting's secondary colors
- **Decorative accents** — vases, blankets, ceramics in the painting's palette
- **Wood tones** — match furniture warmth/coolness to the painting's temperature

**Example color matching:**
A post-impressionist pastoral with terracotta, sage green, goldenrod, and lavender → Room uses:
- Terracotta and sage green throw pillows on a cream sofa
- Goldenrod blanket draped over a basket
- Muted terracotta and cream patterned rug
- Warm oak furniture to match the golden tones

**Color-matching rule:** Every color element in the room should have a direct lineage back to the painting's palette. The result should be that the artwork looks like it belongs in the space — as though the interior was designed around the painting rather than the other way around.

### 4. Select 3+ interior settings

Choose 3 diverse settings from the rotation below. Pick settings that complement the artwork's style and palette. The user may also request extra rooms beyond the default 3.

1. **living-room** — low-profile sofa, minimal coffee table, potted plant, white/light walls, natural light from a window
2. **bedroom** — simple bed with linen bedding, nightstand with small lamp, light oak accents, soft daylight
3. **hallway** — narrow console table, small decorative object, warm wall sconce lighting, clean white walls
4. **reading-nook** — armchair with throw blanket, floor lamp, small bookshelf, warm ambient light
5. **dining-area** — wooden dining table with chairs, pendant light, simple centerpiece, open airy feel
6. **home-office** — clean desk, desk chair, small shelf, task lighting, focused productive atmosphere
7. **entryway** — console table, key dish, coat hooks, welcoming light
8. **country-living-room** — slipcovered sofa, rustic oak furniture, patterned rug, farmhouse aesthetic, warm earthy palette
9. **scandinavian-living-room** — light wood, clean lines, sheepskin throw, muted palette, soft Nordic light

Ensure variety — don't pick 3 similar rooms.

### 5. Craft the room prompts (EMPTY rooms)

Each prompt describes a **photorealistic interior photograph WITHOUT any artwork on the walls**. The wall area must be clean, well-lit, and ready for compositing. Room colors should be color-matched to the painting's palette (see step 3).

**Mandatory elements per prompt:**
- A specific room type with furniture described concretely (materials, colors, shapes)
- **Colors pulled from the painting's palette** — textiles, accents, rugs, and decorative objects in the artwork's dominant and accent colors
- The wall above the main furniture piece must be described as **clean, smooth, and unadorned** — no artwork, photos, or decorations
- **No plants, branches, twigs, or foliage** in positions that would intersect with the wall where the artwork will be composited (keep botanical elements to the sides or foreground only)
- Lighting source and quality — even, flattering light on the wall area
- Camera angle: straight-on, eye-level, interior design photography style
- Minimal styling props that complement the art's palette

**Prompt structure:**
```
Photorealistic interior design photograph, straight-on eye-level view of a [room type with style]. [Furniture description with materials and colors from painting palette]. [Textile and accent descriptions using painting colors]. The wall above the [main furniture piece] is clean, smooth, and completely unadorned — no artwork, photographs, mirrors, or wall decorations of any kind. The blank wall is well-lit with even lighting. [Lighting description]. [Props and decorative accents in painting colors]. [Style adjective], aspirational home styling. Interior design magazine quality. Shot with a 35mm lens, natural perspective, no distortion. No text, no watermarks. No artwork on the walls.
```

**Example prompt (color-matched to terracotta/sage/goldenrod painting):**
```
Photorealistic interior design photograph, straight-on eye-level view of a warm country style living room. A cream slipcovered sofa with terracotta and sage green throw pillows sits against a warm cream wall. A rustic oak coffee table with natural grain sits in the foreground with a small ceramic vase and a stack of linen-bound books. To the right, a woven basket with a folded goldenrod yellow blanket draped over the edge. The wall above the sofa is clean, smooth, and completely unadorned — no artwork, photographs, mirrors, or wall decorations of any kind. The blank wall is well-lit with warm golden natural light from a window with sheer linen curtains on the left side. Warm oak hardwood floor with a muted terracotta and cream patterned rug. A single brass table lamp with a linen shade on a rustic oak side table on the left. Warm, inviting, country farmhouse aesthetic with earthy tones of terracotta, sage green, goldenrod, and cream. Interior design magazine quality. Shot with a 35mm lens, natural perspective, no distortion. No text, no watermarks. No artwork on the walls.
```

### 6. Generate all room backgrounds

Run nano-image for each room sequentially (each with a different room prompt). **Always pass the artwork as a reference image** so Gemini can see the colors and match the room interior:

```bash
cd "C:/Claude Code Projects/Art Project" && node .claude/skills/nano-image/scripts/generate.mjs \
  --prompt "<room prompt with explicit color instructions from the artwork's palette>" \
  --resolution "2K" \
  --aspect-ratio "1:1" \
  --reference-image "<ARTWORK_PATH>"
```

The `--reference-image` flag is mandatory — it ensures Gemini sees the actual artwork and generates room interiors with matching colors.

Wait for each to complete before starting the next. Record the generated filenames.

After generation, visually inspect each room photo to verify:
- The wall is clean and empty (no surprise artwork or decorations)
- No plants/twigs intersect the wall area where the artwork will go
- Lighting is even on the wall surface

If any room has issues, regenerate that specific room with an adjusted prompt before proceeding to compositing.

### 7. Composite the actual artwork into each room

Run the compositing script for each room:

```bash
cd "C:/Claude Code Projects/Art Project" && python .claude/skills/home-visual/scripts/composite.py \
  --room "public/generated-images/<room-photo-filename>" \
  --artwork "<ARTWORK_PATH>" \
  --output "public/generated-images/home-visual-<room-type>.jpg" \
  --room-type "<room-type>" \
  --no-mat
```

**Recommended defaults (based on testing):**
- Use `--no-mat` by default — artwork sits directly inside the frame border, no white mat. This looks cleaner and more modern.
- Use `--scale 0.38` to `0.42` for living rooms (larger art as focal point)
- Use `--scale 0.30` to `0.35` for smaller rooms (hallway, entryway)
- Use `--y 400` for living rooms (sits nicely above furniture)

**Room types:** `living-room`, `bedroom`, `hallway`, `reading-nook`, `dining-area`, `home-office`, `entryway`, `country-living-room`

**All optional overrides:**
- `--x 480 --y 400` — manual position (default: centered horizontally, auto y per room type)
- `--scale 0.42` — artwork width as fraction of room width (default varies by room type, 0.30–0.38)
- `--frame natural_wood` — frame style: `natural_wood`, `black`, `white` (default varies by room type)
- `--no-mat` — skip the white mat border, artwork sits directly in the frame (recommended)
- `--shadow-blur 18` — drop shadow softness (default 18)
- `--shadow-opacity 45` — drop shadow darkness (default 45)

Run all composites sequentially. After each, show the result to the user for positioning feedback before moving on, or batch all and present together if the user prefers.

### 8. Present the results

After all mockups are composited:
- Show all file paths
- Show the dev server URLs: `/generated-images/home-visual-<room-type>.jpg`
- Report dimensions and file sizes
- Confirm the artwork is the exact original (not an AI approximation)

**Output naming:**
```
public/generated-images/home-visual-living-room.jpg
public/generated-images/home-visual-bedroom.jpg
public/generated-images/home-visual-hallway.jpg
public/generated-images/home-visual-country-living-room.jpg
```

### 9. Ask for feedback

Ask the user:
- Does the artwork position/size look right in each room?
- Want to adjust x/y position or scale on any mockup?
- Want to adjust the frame style?
- Want to regenerate any rooms with different settings?

If the user asks to adjust position or size, re-run only the compositing step with new `--x`, `--y`, or `--scale` values — no need to regenerate the room background.

## Compositing Details

### Frame styles
Each room type has a default frame style, matching the interior mood:
- **natural_wood** — Warm light wood tone (living-room, bedroom, reading-nook, entryway, country-living-room)
- **black** — Matte black minimal frame (hallway, dining-area)
- **white** — Clean white frame (home-office)

### Artwork sizing (default per room type)
| Room | Scale | Y position |
|------|-------|------------|
| living-room | 38% | 400px (from top) |
| bedroom | 32% | 15% from top |
| hallway | 30% | 22% from top |
| reading-nook | 35% | 16% from top |
| dining-area | 38% | 18% from top |
| home-office | 35% | 12% from top |
| entryway | 30% | 16% from top |
| country-living-room | 42% | 400px (from top) |

### Frame construction
The compositing script builds each frame in layers:
1. **Artwork** — resized to target dimensions with `Image.LANCZOS`
2. **Mat** — off-white border (~2.5% of artwork width) — skipped when `--no-mat` is used
3. **Frame** — colored border (~2.5% of artwork width)
4. **Inner shadow** — subtle darkening on inner frame edge for depth
5. **Drop shadow** — soft shadow behind frame on room canvas (blur 18, opacity 45)

## Tips for great results

- **Color-match the room to the painting** — this is the single biggest quality lever. **Always pass the artwork as `--reference-image` to Gemini** so it can see the actual colors. ALSO describe the matching explicitly in the text prompt — both together produce the best results. Every color element in the room should trace back to the painting's palette.
- **Empty walls are critical** — every room prompt MUST include "no artwork on the walls" to ensure a clean compositing surface
- **No botanical wall intersections** — avoid plants, twigs, or branches that would overlap the wall where the artwork will be placed. Keep plants to the sides or foreground
- **Even wall lighting** — specify "well-lit with even lighting" so the wall doesn't have harsh shadows that clash with the composited artwork
- **Straight-on camera** — the compositing assumes a flat wall. Never describe angled or perspective shots
- **Match frame to room style** — natural wood for Scandinavian/country/modern, black for industrial/contemporary, white for minimal/coastal
- **Use `--no-mat` by default** — cleaner look, artwork fills more of the frame area
- **Keep rooms uncluttered** — the artwork is the star. 2-3 furniture pieces and 1-2 props maximum per scene
- **If position looks wrong**, adjust `--y` and `--scale` manually — generated rooms vary in ceiling height and furniture placement
- **Dark wall rooms** — if the generated room has dark walls, the natural_wood or white frame will pop more than black
- **Artwork can be signed or unsigned** — the compositing uses whatever image you provide as-is
