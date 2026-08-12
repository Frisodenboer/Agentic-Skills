# Adobe Stock Category IDs

Adobe Stock's bulk-upload CSV requires a single numeric category ID per asset. Pick the closest match for the piece's subject:

| ID | Category |
|----|----------|
| 1 | Animals |
| 2 | Buildings and Architecture |
| 3 | Business |
| 4 | Drinks |
| 5 | The Environment |
| 6 | States of Mind |
| 7 | Food |
| 8 | Graphic Resources |
| 9 | Hobbies and Leisure |
| 10 | Industry |
| 11 | Landscape |
| 12 | Lifestyle |
| 13 | People |
| 14 | Plants and Flowers |
| 15 | Culture and Religion |
| 16 | Science |
| 17 | Social Issues |
| 18 | Sports |
| 19 | Technology |
| 20 | Transport |
| 21 | Travel |

## Defaults for Pen-Coastal motifs

- **Seashells, rope, anchors, portholes (isolated object studies)** → `8` Graphic Resources (works as a standalone design/decor asset)
- **Beach cottages, dune scenes, harbor/coastline compositions** → `21` Travel or `11` Landscape, whichever reads more strongly as the subject
- **Vignette-grid / textile-pattern compositions** → `8` Graphic Resources (pattern/print-design use case)

When unsure, default to `8` — Pen-Coastal pieces are illustrative decor assets first, literal travel photography second.

## CSV column reference

Adobe Stock's contributor bulk-metadata CSV uses these columns, in this order:

| Column | Notes |
|--------|-------|
| `Filename` | Must exactly match the filename of the file being uploaded (case-sensitive) |
| `Title` | Plain descriptive sentence, no ALL CAPS, no keyword stuffing, ~10-15 words reads best |
| `Keywords` | Comma-separated, no `#`, most relevant terms first, aim for 15-30 covering subject / technique / palette / mood |
| `Category` | Single ID from the table above |
| `Releases` | Comma-separated release filenames; leave blank for illustration with no real people/property |

`export_for_stock.py` writes this format automatically — see the workflow in `SKILL.md`.
