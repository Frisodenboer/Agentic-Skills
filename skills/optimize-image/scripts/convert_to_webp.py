"""Convert an image to WebP format optimized for web usage."""

import argparse
import os
import re
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow is not installed. Run: pip install Pillow")
    sys.exit(1)


def to_kebab_case(name: str) -> str:
    """Convert a filename to lowercase kebab-case."""
    name = os.path.splitext(name)[0]
    # Replace spaces, underscores, and camelCase boundaries with hyphens
    name = re.sub(r'[_\s]+', '-', name)
    name = re.sub(r'([a-z])([A-Z])', r'\1-\2', name)
    # Remove non-alphanumeric characters except hyphens
    name = re.sub(r'[^a-z0-9-]', '', name.lower())
    # Collapse multiple hyphens
    name = re.sub(r'-+', '-', name).strip('-')
    return name


def format_size(size_bytes: int) -> str:
    """Format bytes into a human-readable string."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"


def convert(input_path: str, quality: int = 85, max_width: int = 1920) -> None:
    output_dir = os.path.join(os.getcwd(), "public", "converted_to_webp")
    os.makedirs(output_dir, exist_ok=True)

    if not os.path.isfile(input_path):
        print(f"Error: File not found: {input_path}")
        sys.exit(1)

    supported = {'.jpg', '.jpeg', '.png', '.tiff', '.tif', '.bmp'}
    ext = os.path.splitext(input_path)[1].lower()
    if ext not in supported:
        print(f"Error: Unsupported format '{ext}'. Supported: {', '.join(sorted(supported))}")
        sys.exit(1)

    original_size = os.path.getsize(input_path)
    img = Image.open(input_path)

    # Convert to RGB if needed (e.g., RGBA PNGs, CMYK TIFFs)
    if img.mode in ('RGBA', 'LA'):
        # Composite onto white background for WebP
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[-1])
        img = background
    elif img.mode != 'RGB':
        img = img.convert('RGB')

    original_dims = img.size

    # Resize if wider than max_width
    if img.width > max_width:
        ratio = max_width / img.width
        new_height = int(img.height * ratio)
        img = img.resize((max_width, new_height), Image.LANCZOS)

    # Generate output filename
    original_name = os.path.basename(input_path)
    kebab_name = to_kebab_case(original_name)
    output_filename = f"{kebab_name}.webp"
    output_path = os.path.join(output_dir, output_filename)

    # Handle name collisions
    counter = 1
    while os.path.exists(output_path):
        output_filename = f"{kebab_name}-{counter}.webp"
        output_path = os.path.join(output_dir, output_filename)
        counter += 1

    # Save as WebP
    img.save(output_path, 'WEBP', quality=quality, method=6)

    new_size = os.path.getsize(output_path)
    reduction = ((original_size - new_size) / original_size) * 100

    print(f"Converted: {original_name} -> {output_filename}")
    print(f"  Size: {format_size(original_size)} -> {format_size(new_size)} ({reduction:.0f}% smaller)")
    print(f"  Dimensions: {original_dims[0]}x{original_dims[1]} -> {img.width}x{img.height}")
    print(f"  Quality: {quality}")
    print(f"  Output: public/converted_to_webp/{output_filename}")
    print(f"  Web URL: /converted_to_webp/{output_filename}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert image to WebP for web usage")
    parser.add_argument("input", help="Path to the input image")
    parser.add_argument("--quality", type=int, default=85, help="WebP quality (1-100, default: 85)")
    parser.add_argument("--max-width", type=int, default=1920, help="Max width in px (default: 1920)")
    args = parser.parse_args()

    convert(args.input, args.quality, args.max_width)
