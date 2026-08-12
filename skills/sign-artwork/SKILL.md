---
name: sign-artwork
description: Apply the NOOL artist signature to a generated image. Use this skill after generating any artwork that should be signed with the NOOL brand. Triggers on "sign the artwork", "add signature", "stamp it", "sign this", "add the NOOL signature", or when the user wants to finalize a generated image with the artist mark.
---

# Sign Artwork — Apply NOOL Signature

Applies the NOOL handwritten signature to the bottom-right area of any generated image. Automatically samples the color of the signature placement zone and tints the signature to blend harmoniously with the surrounding artwork.

## Signature Source File

- **`public/Artwork/nool-signature.png`** — Transparent PNG with Kalam-font handwriting reading "Nool" in black ink. This is the single source file — the script tints it dynamically to match each painting.

## Workflow

### 1. Get the image path

The user will provide or reference the image to sign.

### 2. Sign the image

```bash
cd "C:/Claude Code Projects/Art Project" && python -c "
from PIL import Image
import os

painting_path = '<PATH_TO_IMAGE>'
output_path = '<OUTPUT_PATH>'

painting = Image.open(painting_path).convert('RGBA')
sig_src = Image.open('public/Artwork/nool-signature.png').convert('RGBA')

# Scale signature to ~4.2% of painting width
scale = int(painting.width * 0.042)
padding_x = 120
padding_y = 100
x = painting.width - scale - padding_x
y = painting.height - int(sig_src.height * (scale / sig_src.width)) - padding_y

# Sample the average color in the signature zone
sig_h = int(sig_src.height * (scale / sig_src.width))
region = painting.crop((x, y, x + scale, y + sig_h))
pixels = list(region.convert('RGB').getdata())
avg_r = sum(p[0] for p in pixels) / len(pixels)
avg_g = sum(p[1] for p in pixels) / len(pixels)
avg_b = sum(p[2] for p in pixels) / len(pixels)
brightness = (avg_r + avg_g + avg_b) / 3

print(f'Sampled zone color: RGB({avg_r:.0f}, {avg_g:.0f}, {avg_b:.0f}), brightness: {brightness:.0f}/255')

# Calculate tint color: lighten for dark bg, darken for light bg
if brightness < 128:
    tint_r = min(255, int(avg_r + (255 - avg_r) * 0.30))
    tint_g = min(255, int(avg_g + (255 - avg_g) * 0.30))
    tint_b = min(255, int(avg_b + (255 - avg_b) * 0.30))
    print(f'Dark background -> tint: RGB({tint_r}, {tint_g}, {tint_b})')
else:
    tint_r = max(0, int(avg_r * 0.55))
    tint_g = max(0, int(avg_g * 0.55))
    tint_b = max(0, int(avg_b * 0.55))
    print(f'Light background -> tint: RGB({tint_r}, {tint_g}, {tint_b})')

# Apply tint to signature
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
print(f'Signature tint: RGB({tint_r}, {tint_g}, {tint_b}) on {painting.width}x{painting.height}px canvas')
print(f'File size: {os.path.getsize(output_path) / 1024:.0f} KB')
"
```

### 3. Present the result

Tell the user:
- The signed image file path
- The sampled background color and the tint applied
- The dev server URL: `/Artwork/<filename>`

## Color-sampling logic

The script samples all pixels in the signature placement zone and calculates the average RGB:

1. **Average brightness < 128** (dark background) -> Lightens the sampled color by 30% to create a subtle warm tint that reads against the dark area while harmonizing with its color temperature
2. **Average brightness >= 128** (light background) -> Darkens the sampled color by 45% for legibility while maintaining color harmony

The tint is applied as 85% tint / 15% original ink blend, with 75% opacity — this creates a signature that's legible but looks like it belongs in the painting.

## Signature sizing

Default: **~4.2% of painting width**. Adjust if requested:
- Bigger: `0.06` or `0.08`
- Smaller: `0.03` or `0.02`

## Signature positioning

Default offset from bottom-right corner:
- **padding_x = 120** (from right edge)
- **padding_y = 100** (from bottom edge)

## Output naming

- `img-20260405-mountain.jpg` -> `nool-mountain-lake-signed.jpg`
- Strip original prefix, add descriptive name and `-signed`

## Tips

- Always use `Image.LANCZOS` for high-quality downscaling
- Always output as JPEG quality 95
- Always pass `sig` as third argument to `paste()` for alpha masking
- Never overwrite the original unsigned image
- If user manually requests a specific tint color, override auto-detection

## Why PIL overlay, not prompt-based signing?

Gemini cannot reliably render legible text in generated images. Asking the model to "add a signature reading 'Nool'" produces inconsistent, often unreadable results. The PIL overlay using a transparent signature PNG is the only method that guarantees a clean, legible, correctly positioned signature every time.

**All art generation skills (atmospheric-cityscape, Pastoral-Frame, etc.) are configured to generate images WITHOUT signatures in the prompt, then apply the NOOL signature via this skill as a post-processing step.**
