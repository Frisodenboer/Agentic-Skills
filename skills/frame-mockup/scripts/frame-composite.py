#!/usr/bin/env python3
"""
Drop a 16:9 artwork into the Nool base frame template.

The base frame template is a 2048x2048 square image with a natural oak wood
frame in 16:9 format on a white wall with soft drop shadows. This script
replaces the inner painting area with the user's artwork.
"""

import argparse
import os
from PIL import Image

# Project root (4 levels up from this script)
PROJECT_ROOT = os.path.normpath(os.path.join(
    os.path.dirname(__file__), "..", "..", "..", ".."
))
BASE_FRAME = os.path.join(
    PROJECT_ROOT, "public", "generated-images", "Nool_Base_Frame_Etsy.jpg"
)

# Inner painting area bounds (pixel coordinates in the 2048x2048 template)
# These define where the artwork content goes (inside the white mat)
# Includes 12px bleed on each side to prevent any white gaps
INNER_LEFT = 393
INNER_TOP = 550
INNER_WIDTH = 1243
INNER_HEIGHT = 702

# Optional: outer mat area bounds (if you want to cover the mat too)
# MAT_LEFT = 430
# MAT_TOP = 690
# MAT_WIDTH = 1240
# MAT_HEIGHT = 700


def composite_artwork_into_frame(artwork_path, output_path, frame_path=None, cover_mat=False):
    """Place a 16:9 artwork into the Nool base frame template."""
    if frame_path is None:
        frame_path = BASE_FRAME

    if not os.path.exists(frame_path):
        print(f"Error: Frame template not found at {frame_path}")
        return

    frame = Image.open(frame_path).convert("RGBA")
    artwork = Image.open(artwork_path).convert("RGBA")

    print(f"Frame template: {frame.width}x{frame.height}px")
    print(f"Artwork: {artwork.width}x{artwork.height}px")

    # Determine target area
    if cover_mat:
        left, top, w, h = 430, 690, 1240, 700
    else:
        left, top, w, h = INNER_LEFT, INNER_TOP, INNER_WIDTH, INNER_HEIGHT

    # Resize artwork to fill the target area (maintain 16:9 aspect, cover mode)
    # The artwork should be 16:9, so it should fit naturally
    artwork_aspect = artwork.width / artwork.height
    target_aspect = w / h

    # Use cover mode: resize so artwork covers the entire area
    if artwork_aspect > target_aspect:
        # Artwork is wider — scale to match height, crop sides
        scale = h / artwork.height
    else:
        # Artwork is taller — scale to match width, crop top/bottom
        scale = w / artwork.width

    new_w = round(artwork.width * scale)
    new_h = round(artwork.height * scale)
    artwork_resized = artwork.resize((new_w, new_h), Image.LANCZOS)

    # Center-crop to exact target dimensions
    crop_x = (new_w - w) // 2
    crop_y = (new_h - h) // 2
    artwork_cropped = artwork_resized.crop((crop_x, crop_y, crop_x + w, crop_y + h))

    # Paste artwork into frame
    frame.paste(artwork_cropped, (left, top))

    # Save as JPEG
    frame.convert("RGB").save(output_path, "JPEG", quality=95)

    file_size = os.path.getsize(output_path) / 1024
    print(f"Output: {output_path}")
    print(f"  Artwork placed at ({left}, {top}), size {w}x{h}px")
    print(f"  Artwork scaled from {artwork.width}x{artwork.height} to {new_w}x{new_h}, cropped to {w}x{h}")
    print(f"  File size: {file_size:.0f} KB")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Drop a 16:9 artwork into the Nool base frame template"
    )
    parser.add_argument("--artwork", required=True, help="Path to 16:9 artwork image")
    parser.add_argument("--output", required=True, help="Output path for framed mockup")
    parser.add_argument(
        "--frame",
        default=None,
        help="Path to frame template (default: Nool_Base_Frame_Etsy.jpg)",
    )
    parser.add_argument(
        "--cover-mat",
        action="store_true",
        help="Cover the white mat area too (larger artwork placement)",
    )

    args = parser.parse_args()
    composite_artwork_into_frame(args.artwork, args.output, args.frame, args.cover_mat)
