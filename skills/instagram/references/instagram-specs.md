# Instagram Image Size Reference

> Source: Adobe Express's public Instagram sizing guide. Video/Reel-specific mechanics (frame rate, 4GB/60s limits, 15-second story segments) are noted for completeness but this skill only produces static images — this project has no video generation pipeline.

## Complete size reference

All figures below are Instagram's stated **minimum** resolution at the given aspect ratio — this skill always exports at exactly these pixel dimensions (not below them), since going smaller only risks Instagram upscaling and softening the image.

| Visual type | Aspect ratio | Minimum resolution |
|---|---|---|
| Profile photo | 1:1 | 320 × 320 px |
| Square feed post | 1:1 | 1080 × 1080 px |
| Vertical feed post | 4:5 (or 3:4) | 1080 × 1350 px (or 1080 × 1440 px) |
| Horizontal feed post | 1.91:1 | 1080 × 566 px |
| Stories | 9:16 | 1080 × 1920 px |
| Reels cover/thumbnail | 9:16 | 1080 × 1920 px |

Notes:
- **Profile photo** displays as a circle in the app, so keep the important part of the composition within a centered circular safe area — don't rely on the square corners.
- **Vertical feed post** has two acceptable ratios: **4:5** (1080×1350, the more common recommendation) and **3:4** (1080×1440, slightly taller). This skill defaults to 4:5 unless the user asks for 3:4.
- **Square feed post** is what the main grid crops every post down to regardless of upload ratio, so any format should still read reasonably when center-cropped to 1:1.

Portrait (4:5) is generally the strongest choice for feed reach since it occupies the most vertical screen space without being cropped by the grid preview.

## Stories & Reels

| Format | Dimensions | Aspect ratio | Notes |
|--------|-----------|---------------|-------|
| Story | 1080 × 1920 px | 9:16 | Full-screen vertical. Photos display 5 seconds; this skill produces the still image only. |
| Reel (upload/cover) | 1080 × 1920 px | 9:16 | Same pixel target as Stories — Instagram recommends full-screen vertical for Reels regardless of the source footage's original orientation. |

Reel display behavior varies by surface even though the upload dimension is the same: appears 9:16 in the Reels tab, 4:5 in-feed, and 1:1 in the profile grid thumbnail — Instagram derives all three from the one 1080×1920 upload, so there's no need to separately export different Reel crops.

## Video specs (reference only — not produced by this skill)

- Max file size: 4 GB
- Max post video length: 60 seconds
- Ideal horizontal video aspect ratio: 16:9 (matches sideways smartphone recording)
- Story/Reel video segments: 15 seconds each, up to 4 in a row (60 seconds total) before re-recording is required

## Choosing crop vs. pad for artwork

Instagram's dimensions rarely match this project's native output (most art skills default to 3840×2160, a 16:9 Samsung Frame TV canvas). Two honest ways to fit that into an Instagram format:

- **Crop** — cut the source down to the target aspect ratio, then scale to exact pixels. Loses whatever's outside the crop box. Fine when the subject has room to spare or is already centered (e.g., a single hero motif).
- **Pad** — scale the whole image down to fit inside the target canvas untouched, then fill the leftover space (a blurred/extended version of the same image, or a flat color). Preserves the full composition but adds visible borders/letterboxing.

A single hero-motif piece (e.g., Pen-Coastal's single-object compositions) usually crops well. A wide panoramic landscape or a busy vignette-grid composition usually pads better, since cropping a 16:9 panorama down to 1:1 or 9:16 can cut off a meaningful chunk of the piece.
