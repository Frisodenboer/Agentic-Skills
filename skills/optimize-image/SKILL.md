---
name: optimize-image
description: Convert and optimize images for website usage — resize, compress, and convert to WebP format. Use this skill whenever the user wants to optimize an image for the web, convert an image to WebP, reduce image file size, compress a photo for their site, prepare images for production, or mentions that images are "too large" or "too heavy" for their website. Also trigger when the user asks to batch-convert images, make images web-ready, or wants smaller file sizes without losing quality.
---

# Optimize Image — WebP Conversion for Web

This skill converts images (JPG, PNG, TIFF, BMP) to WebP format, optimized for website usage. It resizes to web-appropriate dimensions, compresses with high visual quality, and reports the file size savings. Output goes to `public/converted_to_webp/`.

## Why WebP?

WebP delivers 25–35% smaller file sizes than JPEG at equivalent visual quality. Every major browser supports it. For a marketing website, this means faster page loads, better Core Web Vitals scores, and a smoother user experience — especially on mobile.

## Workflow

### 1. Confirm the image and settings

When the user provides an image to optimize, confirm these settings before converting:

- **Quality**: Default **85** (out of 100). This is a sweet spot — visually indistinguishable from the original for most web use cases. Offer to adjust: lower (70–80) for background images where size matters more, higher (90–95) for hero banners or product shots where every detail counts.
- **Max width**: Default **1920px**. Images wider than this get resized down (preserving aspect ratio). This covers full-width hero banners on most screens. Offer to adjust if the user has specific needs (e.g., 1140px for a content-width banner, 800px for a card image).

Present it like:
> "I'll convert this to WebP at **quality 85** with a max width of **1920px**. Want to adjust either of these?"

### 2. Run the conversion

Use the bundled Python script:

```bash
python .claude/skills/optimize-image/scripts/convert_to_webp.py "<input-path>" --quality 85 --max-width 1920
```

The script handles:
- Reading the input image (JPG, JPEG, PNG, TIFF, BMP)
- Resizing if wider than max-width (preserving aspect ratio)
- Converting to WebP at the specified quality
- Generating a clean kebab-case filename from the original
- Saving to `public/converted_to_webp/`
- Printing before/after stats

### 3. Report the results

After conversion, tell the user:
- The output file path
- Original vs. new file size and percentage reduction
- Final image dimensions
- The web-accessible URL (when dev server is running): `/converted_to_webp/<filename>`

**Example output:**
> Converted `uridan-banner-amazon.jpg` → `uridan-banner-amazon.webp`
> - Size: 1.8 MB → 285 KB (84% smaller)
> - Dimensions: 2752×1536 → 1920×1072
> - Web URL: `/converted_to_webp/uridan-banner-amazon.webp`

### 4. Batch conversion

If the user provides multiple images or asks to convert all images in a folder, run the script for each file. You can loop through them in Bash:

```bash
for img in public/generated-images/*.jpg; do
  python .claude/skills/optimize-image/scripts/convert_to_webp.py "$img" --quality 85 --max-width 1920
done
```

Report a summary table after all conversions complete.
