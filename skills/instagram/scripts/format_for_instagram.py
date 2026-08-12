#!/usr/bin/env python3
"""
Fit an image to an Instagram format by cropping or padding to the exact
target pixel dimensions, per references/instagram-specs.md.

Usage:
  python format_for_instagram.py --image "public/Artwork/nool-piece.jpg" --format square
  python format_for_instagram.py --image "public/Artwork/nool-piece.jpg" --format portrait --mode pad --pad-style blur
  python format_for_instagram.py --image "public/Artwork/nool-piece.jpg" --format all --mode crop

Formats: profile, square, landscape, portrait, portrait-3-4, story, reel, all
Modes: crop (default, center-crop to aspect then resize) | pad (fit whole
image inside the canvas, fill the rest with a blurred cover or flat color)
"""

import argparse
import os
from datetime import date

from PIL import Image, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
OUTPUT_BASE = os.path.join(ROOT, "public", "instagram")

FORMATS = {
    "profile": (320, 320),
    "square": (1080, 1080),
    "landscape": (1080, 566),
    "portrait": (1080, 1350),
    "portrait-3-4": (1080, 1440),
    "story": (1080, 1920),
    "reel": (1080, 1920),
}

ALL_SET = ["profile", "square", "landscape", "portrait", "story"]


def crop_to_fill(img: Image.Image, target_w: int, target_h: int, focus_x: float, focus_y: float) -> Image.Image:
    src_w, src_h = img.size
    target_ratio = target_w / target_h
    src_ratio = src_w / src_h

    if src_ratio > target_ratio:
        # source is relatively wider than target -> crop width, keep full height
        new_w = int(src_h * target_ratio)
        new_h = src_h
        max_x = src_w - new_w
        x = int(max_x * focus_x)
        y = 0
    else:
        # source is relatively taller than target -> crop height, keep full width
        new_w = src_w
        new_h = int(src_w / target_ratio)
        x = 0
        max_y = src_h - new_h
        y = int(max_y * focus_y)

    cropped = img.crop((x, y, x + new_w, y + new_h))
    return cropped.resize((target_w, target_h), Image.LANCZOS)


def pad_to_fill(img: Image.Image, target_w: int, target_h: int, pad_style: str, pad_color: str) -> Image.Image:
    src_w, src_h = img.size
    scale = min(target_w / src_w, target_h / src_h)
    fit_w, fit_h = int(src_w * scale), int(src_h * scale)
    fitted = img.resize((fit_w, fit_h), Image.LANCZOS)

    if pad_style == "color":
        canvas = Image.new("RGB", (target_w, target_h), pad_color)
    else:
        # blurred cover as background, so letterboxing matches the image itself
        cover_scale = max(target_w / src_w, target_h / src_h)
        cover_w, cover_h = int(src_w * cover_scale), int(src_h * cover_scale)
        cover = img.resize((cover_w, cover_h), Image.LANCZOS)
        cx = (cover_w - target_w) // 2
        cy = (cover_h - target_h) // 2
        cover = cover.crop((cx, cy, cx + target_w, cy + target_h))
        canvas = cover.filter(ImageFilter.GaussianBlur(radius=40))

    paste_x = (target_w - fit_w) // 2
    paste_y = (target_h - fit_h) // 2
    canvas.paste(fitted, (paste_x, paste_y))
    return canvas


def process_one(img: Image.Image, fmt: str, mode: str, focus_x: float, focus_y: float,
                 pad_style: str, pad_color: str) -> Image.Image:
    target_w, target_h = FORMATS[fmt]
    if mode == "pad":
        return pad_to_fill(img, target_w, target_h, pad_style, pad_color)
    return crop_to_fill(img, target_w, target_h, focus_x, focus_y)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True)
    parser.add_argument("--format", required=True, choices=list(FORMATS.keys()) + ["all"])
    parser.add_argument("--mode", default="crop", choices=["crop", "pad"])
    parser.add_argument("--focus-x", type=float, default=0.5, help="0.0-1.0, horizontal crop bias (crop mode only)")
    parser.add_argument("--focus-y", type=float, default=0.5, help="0.0-1.0, vertical crop bias (crop mode only)")
    parser.add_argument("--pad-style", default="blur", choices=["blur", "color"], help="pad mode background style")
    parser.add_argument("--pad-color", default="#FFFFFF", help="hex color, used when --pad-style color")
    args = parser.parse_args()

    if not os.path.isfile(args.image):
        raise SystemExit(f"Error: image not found: {args.image}")

    focus_x = min(1.0, max(0.0, args.focus_x))
    focus_y = min(1.0, max(0.0, args.focus_y))

    today = date.today().isoformat()
    out_dir = os.path.join(OUTPUT_BASE, today)
    os.makedirs(out_dir, exist_ok=True)

    base_name = os.path.splitext(os.path.basename(args.image))[0]
    img = Image.open(args.image).convert("RGB")

    formats_to_run = ALL_SET if args.format == "all" else [args.format]

    for fmt in formats_to_run:
        result = process_one(img, fmt, args.mode, focus_x, focus_y, args.pad_style, args.pad_color)
        target_w, target_h = FORMATS[fmt]
        out_name = f"{base_name}-ig-{fmt}-{target_w}x{target_h}.jpg"
        out_path = os.path.join(out_dir, out_name)
        result.save(out_path, "JPEG", quality=95)
        print(f"{fmt}: {target_w}x{target_h} -> {out_path} ({os.path.getsize(out_path) / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
