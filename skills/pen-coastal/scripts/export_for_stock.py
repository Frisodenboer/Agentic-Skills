#!/usr/bin/env python3
"""
Copy a finished Pen-Coastal artwork into a dated export directory and append
an Adobe Stock bulk-upload metadata row for it.

Usage:
  python export_for_stock.py \
    --image "public/Artwork/nool-pen-coastal-whelk-shell-signed.jpg" \
    --title "Hand-Drawn Pen and Ink Whelk Seashell Coastal Illustration" \
    --keywords "pen and ink,illustration,coastal,seashell,cross hatch,screen print,nautical,hand drawn,seaside,beach,sketch,teal,terracotta,wall art,textile print" \
    --category 8

Each run of this skill should call this script once per finished piece.
All pieces generated on the same day land in the same dated folder under
public/out/<YYYY-MM-DD>/ and share one CSV, so the folder is a
ready-to-zip Adobe Stock upload batch.
"""

import argparse
import csv
import os
import shutil
from datetime import date

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
EXPORT_BASE = os.path.join(ROOT, "public", "out")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True, help="Path to the finished (signed) artwork file")
    parser.add_argument("--title", required=True, help="Adobe Stock title / caption")
    parser.add_argument("--keywords", required=True, help="Comma-separated keyword list (no spaces required after commas)")
    parser.add_argument("--category", required=True, type=int, choices=range(1, 22), help="Adobe Stock category ID (1-21)")
    parser.add_argument("--releases", default="", help="Comma-separated release filenames, if any (usually blank for illustration)")
    args = parser.parse_args()

    if not os.path.isfile(args.image):
        raise SystemExit(f"Error: image not found: {args.image}")

    today = date.today().isoformat()
    export_dir = os.path.join(EXPORT_BASE, today)
    os.makedirs(export_dir, exist_ok=True)

    filename = os.path.basename(args.image)
    dest_path = os.path.join(export_dir, filename)
    shutil.copy2(args.image, dest_path)

    csv_path = os.path.join(export_dir, "adobe-stock-metadata.csv")
    is_new = not os.path.isfile(csv_path)

    keywords = ",".join(k.strip() for k in args.keywords.split(",") if k.strip())

    with open(csv_path, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if is_new:
            writer.writerow(["Filename", "Title", "Keywords", "Category", "Releases"])
        writer.writerow([filename, args.title, keywords, args.category, args.releases])

    print(f"Copied artwork to: {dest_path}")
    print(f"Metadata CSV: {csv_path}")
    print(f"Row added - Title: \"{args.title}\" | Category: {args.category} | Keywords: {keywords.count(',') + 1}")


if __name__ == "__main__":
    main()
