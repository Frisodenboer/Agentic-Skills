#!/usr/bin/env python3
"""
Composite artwork into room photos for lifestyle mockups.

Generates a framed artwork (with mat, frame, and drop shadow),
then overlays it onto a generated room photo at the specified position.
"""

import argparse
import os
from PIL import Image, ImageFilter, ImageDraw

FRAME_COLORS = {
    "natural_wood": (178, 153, 118),
    "black": (35, 35, 35),
    "white": (238, 238, 238),
}

# Default positioning per room type: y_pct, scale, frame style
ROOM_DEFAULTS = {
    "living-room":   {"y_pct": 0.18, "scale": 0.38, "frame": "natural_wood"},
    "bedroom":       {"y_pct": 0.15, "scale": 0.32, "frame": "natural_wood"},
    "hallway":       {"y_pct": 0.22, "scale": 0.30, "frame": "black"},
    "reading-nook":  {"y_pct": 0.16, "scale": 0.35, "frame": "natural_wood"},
    "dining-area":   {"y_pct": 0.18, "scale": 0.38, "frame": "black"},
    "home-office":   {"y_pct": 0.12, "scale": 0.35, "frame": "white"},
    "entryway":      {"y_pct": 0.16, "scale": 0.30, "frame": "natural_wood"},
}


def create_framed_artwork(artwork_path, target_width, frame_style="natural_wood", no_mat=False):
    """Resize artwork, add optional white mat, add colored frame, add inner shadow."""
    art = Image.open(artwork_path).convert("RGBA")

    # Resize to target width, maintain aspect ratio
    aspect = art.width / art.height
    target_height = round(target_width / aspect)
    art = art.resize((target_width, target_height), Image.LANCZOS)

    # Mat (off-white border) — skip if no_mat
    if no_mat:
        inner_img = art
    else:
        mat_px = max(8, round(target_width * 0.025))
        mat_w = target_width + mat_px * 2
        mat_h = target_height + mat_px * 2
        inner_img = Image.new("RGBA", (mat_w, mat_h), (250, 248, 245, 255))
        inner_img.paste(art, (mat_px, mat_px), art)

    # Frame (colored border) proportional to artwork size
    fw = max(6, round(target_width * 0.025))
    frame_color = FRAME_COLORS.get(frame_style, FRAME_COLORS["natural_wood"])
    frame_w = inner_img.width + fw * 2
    frame_h = inner_img.height + fw * 2
    frame_img = Image.new("RGBA", (frame_w, frame_h), frame_color + (255,))
    frame_img.paste(inner_img, (fw, fw), inner_img)

    # Inner frame edge shadow (subtle bevel/depth effect)
    inner_shadow = Image.new("RGBA", (frame_w, frame_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(inner_shadow)
    sw = max(2, round(fw * 0.4))
    draw.rectangle(
        [fw - sw, fw - sw, frame_w - fw + sw, frame_h - fw + sw],
        fill=(0, 0, 0, 22),
    )
    inner_shadow = inner_shadow.filter(ImageFilter.GaussianBlur(2))
    frame_img = Image.alpha_composite(frame_img, inner_shadow)

    return frame_img


def composite_artwork_into_room(
    room_path,
    artwork_path,
    output_path,
    room_type=None,
    x=-1,
    y=-1,
    scale=-1,
    frame_style=None,
    no_mat=False,
    shadow_blur=18,
    shadow_offset=(6, 6),
    shadow_opacity=45,
):
    """Place framed artwork onto a room photo with realistic drop shadow."""
    room = Image.open(room_path).convert("RGBA")

    # Apply room-type defaults if not overridden
    defaults = ROOM_DEFAULTS.get(room_type, ROOM_DEFAULTS["living-room"])
    if scale < 0:
        scale = defaults["scale"]
    if frame_style is None:
        frame_style = defaults["frame"]

    # Calculate artwork dimensions
    target_width = round(room.width * scale)
    framed = create_framed_artwork(artwork_path, target_width, frame_style, no_mat=no_mat)

    # Default position: centered horizontally, upper area per room type
    if x < 0:
        x = (room.width - framed.width) // 2
    if y < 0:
        y = round(room.height * defaults["y_pct"])

    # Create drop shadow on full-size canvas (allows blur to feather properly)
    shadow = Image.new("RGBA", room.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow)
    draw.rectangle(
        [
            x + shadow_offset[0],
            y + shadow_offset[1],
            x + framed.width + shadow_offset[0],
            y + framed.height + shadow_offset[1],
        ],
        fill=(0, 0, 0, shadow_opacity),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(shadow_blur))

    # Composite layers: room + shadow + framed artwork
    result = Image.alpha_composite(room, shadow)
    result.paste(framed, (x, y), framed)

    result.convert("RGB").save(output_path, "JPEG", quality=95)

    file_size = os.path.getsize(output_path) / 1024
    print(f"Composited: {output_path}")
    print(f"  Room: {room.width}x{room.height}px")
    print(f"  Framed artwork: {framed.width}x{framed.height}px (scale={scale:.0%})")
    print(f"  Position: ({x}, {y})")
    print(f"  Frame style: {frame_style}")
    print(f"  File size: {file_size:.0f} KB")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Composite artwork into room photo for lifestyle mockup"
    )
    parser.add_argument("--room", required=True, help="Path to room background photo")
    parser.add_argument("--artwork", required=True, help="Path to artwork image")
    parser.add_argument("--output", required=True, help="Output path for mockup")
    parser.add_argument(
        "--room-type",
        default=None,
        choices=list(ROOM_DEFAULTS.keys()),
        help="Room type for default positioning",
    )
    parser.add_argument(
        "--x", type=int, default=-1, help="X position (-1 = centered)"
    )
    parser.add_argument(
        "--y", type=int, default=-1, help="Y position (-1 = auto per room type)"
    )
    parser.add_argument(
        "--scale",
        type=float,
        default=-1,
        help="Art width as fraction of room width (-1 = auto per room type)",
    )
    parser.add_argument(
        "--frame",
        default=None,
        choices=["natural_wood", "black", "white"],
        help="Frame style (default varies by room type)",
    )
    parser.add_argument(
        "--no-mat",
        action="store_true",
        help="Skip the white mat border between artwork and frame",
    )
    parser.add_argument("--shadow-blur", type=int, default=18)
    parser.add_argument("--shadow-opacity", type=int, default=45)

    args = parser.parse_args()
    composite_artwork_into_room(
        args.room,
        args.artwork,
        args.output,
        room_type=args.room_type,
        x=args.x,
        y=args.y,
        scale=args.scale,
        frame_style=args.frame,
        no_mat=args.no_mat,
        shadow_blur=args.shadow_blur,
        shadow_opacity=args.shadow_opacity,
    )
