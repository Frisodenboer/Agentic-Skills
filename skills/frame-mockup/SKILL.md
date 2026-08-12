---
name: frame-mockup
description: Drop a 16:9 artwork into the Nool base frame template — a photorealistic natural oak wood frame on a white wall with soft drop shadows. Produces a clean, gallery-style product mockup. Use this skill when the user wants to create a framed product mockup, Etsy listing image, gallery mockup, or wants to show their artwork in the Nool wooden frame. Trigger on "frame mockup", "framed mockup", "product mockup", "Etsy mockup", "gallery mockup", "put in frame", "frame it", "drop in frame".
---

# Frame Mockup — Nool Wooden Frame Product Mockup

Takes a 16:9 artwork and composites it into the **Nool Base Frame** template — a photorealistic natural oak wood frame on a clean white wall with soft directional drop shadows. The result is a ready-to-use product mockup ideal for Etsy listings, portfolios, or print-on-demand previews.

## Base Frame Template

- **File**: `public/generated-images/Nool_Base_Frame_Etsy.jpg`
- **Size**: 2048x2048px (1:1 square)
- **Frame**: Light natural oak, modern slim profile (~1cm visible width)
- **Inner format**: 16:9 panoramic
- **Shadows**: Soft directional drop shadows (upper-left light source)
- **Background**: Clean warm white wall, slight texture

## Inner Artwork Placement

The artwork is placed inside the frame, within the white mat border:

| Property | Value |
|----------|-------|
| **X offset** | 433px |
| **Y offset** | 703px |
| **Width** | 1243px |
| **Height** | 702px |
| **Aspect ratio** | ~1.83:1 (fits 16:9 artwork) |

## Workflow

### 1. Get the artwork path

The user provides a 16:9 artwork image. Accept:
- `public/Artwork/` (signed artwork — recommended)
- `public/generated-images/` (raw generated images)
- Any local path

The artwork should be 16:9 aspect ratio (e.g., 3840x2160 for Samsung Frame TV). Other ratios will be cover-cropped to fit.

### 2. Run the frame composite script

```bash
cd "C:/Claude Code Projects/Art Project" && python .claude/skills/frame-mockup/scripts/frame-composite.py \
  --artwork "<ARTWORK_PATH>" \
  --output "public/generated-images/frame-mockup-<description>.jpg"
```

**Optional flags:**
- `--frame <path>` — Use a different frame template (default: `Nool_Base_Frame_Etsy.jpg`)
- `--cover-mat` — Cover the white mat area too (artwork extends to the frame edge instead of inside the mat)

### 3. Present the result

Tell the user:
- The output file path
- Dev server URL: `/generated-images/frame-mockup-<description>.jpg`
- The dimensions and file size
- Note that the artwork is the exact original pixel-for-pixel (resized to fit, not AI-regenerated)

**Output naming convention:**
```
public/generated-images/frame-mockup-<artwork-name>.jpg
```

Example:
```
public/generated-images/frame-mockup-patchwork-pastoral.jpg
```

### 4. Ask for feedback

Ask the user:
- Does the placement look good?
- Want to adjust the positioning?
- Need a different frame template?

## Script Details

The compositing script (`frame-composite.py`) works by:

1. **Opening** the base frame template (2048x2048)
2. **Opening** the artwork image
3. **Resizing** the artwork to cover the inner target area (maintains aspect ratio with cover-mode cropping)
4. **Pasting** the resized artwork into the frame at the precise pixel coordinates
5. **Saving** as JPEG quality 95

The placement is pixel-precise — no AI generation involved. The artwork is the exact original image, only resized to fit the frame opening.

## Tips

- **Best with signed artwork** — sign the artwork first using the sign-artwork skill, then frame it
- **Works with any 16:9 image** — generated art, photos, digital art all work
- **Non-16:9 images** — will be center-cropped to fit (cover mode), so some edges may be trimmed
- **The white mat is preserved** — by default the thin white mat border remains visible inside the frame
- **Use `--cover-mat`** for a frame-only look without the mat border
