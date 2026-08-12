# Adobe Stock Category IDs

Adobe Stock's bulk-upload CSV requires a single numeric category ID per asset. Pick the closest match for the piece's actual subject — since this skill spans any subject matter, all 21 categories are in play, not just one or two defaults:

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

## Choosing a category

Pick based on what the piece is actually a drawing *of*, not the technique:

- An animal/creature study → `1` Animals
- A building, cathedral, cottage, or interior → `2` Buildings and Architecture
- A plant, flower, tree, or botanical study → `14` Plants and Flowers
- A portrait or figure study → `13` People
- A car, boat, plane, or other vehicle → `20` Transport
- A landscape or coastal/nature scene as the subject itself → `11` Landscape or `21` Travel, whichever reads stronger
- An isolated object/still-life study (tools, instruments, everyday objects, decorative motifs) → `8` Graphic Resources
- A map or diagram → `16` Science or `8` Graphic Resources depending on whether it reads as informational or decorative

When genuinely unsure, default to `8` — isolated black-and-white ink studies work as illustrative decor assets first.

## CSV column reference

Adobe Stock's contributor bulk-metadata CSV uses these columns, in this order:

| Column | Notes |
|--------|-------|
| `Filename` | Must exactly match the filename of the file being uploaded (case-sensitive) |
| `Title` | Plain descriptive sentence, no ALL CAPS, no keyword stuffing, ~10-15 words reads best |
| `Keywords` | Comma-separated, no `#`, most relevant terms first, aim for 15-30 covering subject / technique / black and white / mood |
| `Category` | Single ID from the table above |
| `Releases` | Comma-separated release filenames; leave blank for illustration with no real people/property |

`export_for_stock.py` writes this format automatically — see the workflow in `SKILL.md`.
