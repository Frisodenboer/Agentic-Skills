# Pen-Ink-BW — Style Guide

> A general-purpose monochrome pen-and-ink illustration style, usable for any subject matter — not limited to coastal/nautical themes.

## Style Definition

**Pen-Ink-BW** is a hand-drawn pen-and-ink illustration style: loose, imperfect black ink linework — heavy cross-hatching for shading, slightly wobbly confident sketch lines, no ruler-straight edges. There is **no color layer, no flat wash, no tone fill of any kind**. The linework must stand entirely on its own as a complete, finished black-and-white drawing on bare white paper — every value change (shadow, depth, texture) is built from ink density (line weight, cross-hatch frequency, stipple, scribble) rather than from a filled color or grey patch.

The subject is whatever the user asks for — a portrait, an animal, a botanical study, a building, a still life, a map, a vehicle, an object, a scene, anything. Only the technique (pure black ink, pure white ground, tone from line density alone) is fixed; the subject matter is open.

## Lineage DNA

- **Classic pen-and-ink illustration**: engraving-adjacent cross-hatch and stipple shading, in the tradition of scientific/naturalist illustration and woodcut linework — where all tone is built from line density, never from flat fill
- **Sketchbook illustration**: loose pen cross-hatch shading, visible construction lines, the confident imperfection of a fast observational drawing rather than a finished vector illustration
- Applicable across any subject domain: natural history plates (animals, botanicals), architectural studies, portraiture, still life, maps and diagrams, vehicles and machines, everyday objects

---

## The Core Rule — No Color, No Wash, Pure White Ground

This is the trait that makes or breaks the style, and the one thing that must never be dropped from any prompt, regardless of subject.

- The canvas/background is **pure white, `#FFFFFF`, completely bare** — no color wash, no grey tone fill, no paper texture tint, no vignette shading applied to the ground.
- Ink is **pure black** — no color, no sepia, no blue-black, no colored ink of any kind.
- **This is a flat isolated illustration, not a photograph of a physical object.** A recurring failure mode: the model interprets "sketchbook" or "hand-drawn" too literally and renders a *photo of an open notebook on a wooden desk*, or draws the linework on visibly aged/grained/cream-toned paper. Both are failures — they introduce a non-white background (wood grain, page shadow, paper texture/tint) that violates the pure-white-canvas rule. Every prompt must explicitly rule this out: no sketchbook page, no book binding or spine, no desk/table surface, no visible paper grain/fiber texture, no cream or off-white toning, no background scene or setting beyond what's needed for the subject itself — just the subject's ink linework floating on flat, solid, pure white, the way a scanned or vectorized line illustration would look isolated on a blank page.
- **No flat fills or tone patches anywhere in the image.** Every shadow, every area of visual weight, every sense of depth or material must come from line work alone: denser cross-hatching, tighter stippling, or thicker line weight — never a solid or gradient fill dropped behind or inside the linework.
- Midtones and shadows are built by **layering cross-hatch density** (light single-direction hatch for a pale midtone, criss-crossed double-hatch for a mid shadow, dense stippled or triple-hatched black for the deepest shadow) — a controlled greyscale value range achieved purely through line, the way a traditional engraving or woodcut builds tone.
- No print-registration or color-offset effects of any kind — this is a clean, single-layer ink drawing, not a print simulation.

**Prompt phrase**: "Pure black ink linework on a completely bare, flat, solid white background, #FFFFFF, no color of any kind, no flat fills, no grey wash or tone patches anywhere, no paper grain or fiber texture, no cream or off-white toning — every shadow and area of depth built entirely from line density: light single-direction hatching for pale midtones, criss-crossed cross-hatching for mid shadows, dense stippled or triple-hatched black for the deepest shadows, exactly like a traditional engraving or woodcut built from line alone. This is a flat isolated illustration, like a clean scan or vector cutout — NOT a photograph of a sketchbook, NOT resting on a wooden desk or table, NOT showing a page, book spine, or binding, NOT set in an unrelated background scene — only the subject's ink linework floating on blank white space, nothing else in frame"

## The Linework

- Pure black ink, uniform-ish weight with natural pen-pressure variation, never a clean vector stroke
- Confident, slightly wobbly, hand-drawn quality — visible sketch energy, not ruler-straight
- **Cross-hatching and stippling** are the only shading tools — used for whatever texture the subject calls for (fur, fabric weave, stone, metal, foliage, skin, wood grain, glass) — anything that would have been a color wash or flat shadow in a color illustration
- Scribbled loose linework for organic texture: fur, grass, foliage, hair, clouds — rendered as energetic overlapping scribbles, not individually drawn strands
- Thin single-line construction for structural/mechanical elements: window frames, rigging, wiring, joints, architectural edges, contour guides
- Vary line weight deliberately: a thicker outer contour line reads at a distance, thinner interior lines carry the cross-hatch texture — this is what gives the piece graphic punch without any color

**Prompt phrase**: "loose confident black ink pen linework with natural pressure variation, dense cross-hatching and stippling for all shading and texture, scribbled energetic linework for organic texture (fur, foliage, hair, grass), thin single-line strokes for structural and mechanical details, deliberate line-weight contrast between bold outer contours and finer interior texture lines, hand-drawn quality, not vector-smooth"

## Palette

There is no palette. This is the entire point of the style.

| Element | Value |
|---------|-------|
| Ink | Pure black, `#000000` |
| Ground | Pure white, `#FFFFFF`, completely bare canvas |
| Everything else | Built from line density only — no grey fills, no color, no tint |

**Prompt phrase**: "strictly black and white, pure black ink `#000000` on a pure white `#FFFFFF` canvas, absolutely no color, no sepia, no grey flat-fill washes — only white paper and black line"

## Subject Matter

This is a general-purpose skill — the subject can be anything the user asks for. Some example domains this style handles well:

- **Portraits and figures** — cross-hatched skin shadow, stippled or scribbled hair, fabric-fold linework for clothing
- **Animals and wildlife** — scribbled fur/feather texture, cross-hatched musculature and shadow
- **Botanicals and nature** — engraving-style scientific-illustration plates: flowers, leaves, trees, fungi, shells
- **Architecture and interiors** — structural line construction, cross-hatched material shadow (brick, stone, wood, glass)
- **Vehicles and machines** — thin single-line mechanical/structural detail, cross-hatched metal shading
- **Still life and objects** — everyday objects rendered with full tonal range from line density alone
- **Maps and diagrams** — line-based cartographic or schematic illustration in the same ink language
- **Scenes and landscapes** — when a background/setting is the actual subject (rather than an unwanted artifact), describe it explicitly as part of the composition so it isn't mistaken for the "no background scene" failure mode below

When the user names a subject, ask only what's genuinely ambiguous (which specific animal/building/object, what pose or angle, how much surrounding context vs. isolated study) — don't force every generation through a fixed motif checklist the way a themed skill would.

## Composition

Three composition modes, chosen based on end use rather than subject:

- **Vignette grid** — 3-6 related studies (or facets of one subject) scattered at varied scale/rotation across the canvas, one or two enclosed in thin hand-drawn rectangular frames, dotted-bead or hatched divider lines separating regions. Good for a busy sketchbook-page or specimen-plate feel.
- **Single hero subject** (recommended default for wall art) — one subject rendered big and centered or on a rule-of-thirds point, filling most of the frame, on a completely bare white ground so the linework and cross-hatch density carry the entire composition.
- **Copy-space / editorial banner** — for magazine spreads, web banners, or anywhere text will be overlaid. The subject sits confidently in one third of the frame (left or right, picked deliberately, not centered), while the remaining half-to-two-thirds of the frame stays bare white paper with at most one small secondary element, no competing detail.

**Prompt phrase (vignette grid)**: "scattered vignette composition with 3-6 related studies at varied scale and slight rotation across a bare white canvas, one or two enclosed in a thin hand-drawn rectangular frame border, thin hatched divider lines structuring the layout"

**Prompt phrase (single hero subject)**: "a single large [subject] filling most of the frame, placed at a rule-of-thirds point, rendered in full cross-hatched and stippled pen-and-ink detail with a clear range of tonal values built from line density alone, set against a completely bare white background so the subject and its linework read clearly at a distance"

**Prompt phrase (copy-space / editorial banner)**: "strong asymmetric editorial composition with the [subject] positioned in the [left/right] third of the frame; the opposite half to two-thirds of the composition stays bare white paper — at most one small secondary element, no other visual clutter — leaving generous open negative space suitable for magazine or banner text overlay"

---

## Master Prompt Template

```
Hand-drawn black-and-white pen-and-ink illustration with the loose confident linework quality of a classic sketchbook artist, rendered purely in ink with no color of any kind. [Subject description — e.g. "a large detailed barn owl in flight with cross-hatched wing shading" / "a vintage typewriter with cross-hatched metal shadow and stippled key texture" / "a tall gothic cathedral facade with hatched stone-course shading"]. Loose confident black ink linework with natural pressure variation, dense cross-hatching and stippling for all shading and texture, scribbled energetic linework for any organic texture (fur, foliage, hair), deliberate line-weight contrast between bold outer contours and finer interior texture lines, hand-drawn quality, not vector-smooth. Pure black ink `#000000` on a completely bare, flat, solid white `#FFFFFF` canvas — no color, no sepia, no grey flat-fill washes, no tone patches, no paper grain or fiber texture, no cream/off-white toning anywhere. Every shadow and area of depth is built entirely from line density: light single-direction hatching for pale midtones, criss-crossed cross-hatching for mid shadows, dense stippled or triple-hatched black for the deepest shadows, exactly like a traditional engraving or woodcut. This is a flat isolated illustration, like a clean scan or vector cutout — NOT a photograph of a physical sketchbook or notebook, NOT resting on a wooden desk or table, NOT showing a page edge, book spine, or binding, NOT set in any unrelated background scene — only the subject's ink linework floating on blank white space, nothing else in frame. [Composition instruction — vignette grid, single hero subject, or copy-space/editorial, per style guide]. Gallery-quality fine art black-and-white ink illustration, ultra-detailed cross-hatching. No text, no watermarks.
```

---

## Tips for great results

- **Verify the background is actually `#FFFFFF`, don't just eyeball it.** Gemini in particular tends to render a background that reads as "white" to the eye but is actually a light grey (e.g. RGB 240-244) — a few percent off pure white. Sample a handful of pixels away from the subject (e.g. `img.getpixel((5,5))` and the other corners) to check. If it's not ~255 across the board, apply a linear levels stretch rather than regenerating blind: measure the background level from the corners, then scale every pixel by `255/background_level` per channel (clipped at 255). This pushes true white all the way to `#FFFFFF` while leaving black ink at 0 and only mildly lightening mid-grey hatching — reliably fixes the "off-white paper" problem without re-rolling the whole generation.
- **Watch for the "photo of a physical sketchbook" failure mode.** If a result comes back showing an open notebook on a wooden desk, a visible page/binding, or the linework on cream/grained paper instead of flat pure white, the model took "sketchbook" too literally. Regenerate with the explicit negatives from the style guide ("NOT a photograph of a sketchbook, NOT on a wooden desk, no page or binding, no paper grain, only ink linework floating on blank white space").
- **The "no color, no wash, pure white ground" instruction is the one thing that must never be dropped**, no matter the subject. If it's missing, the model tends to add a light grey tone fill or sepia tint by default — restate "strictly black and white, pure white #FFFFFF background, no grey fills, no tint" if that happens.
- **If the result looks flat or low-contrast**, add "strong tonal range from bright white paper to dense black ink shadow, built entirely from cross-hatch and stipple density, no mid-grey flat fills" — the whole style depends on line density doing the work color used to do.
- **If the result looks too clean/vector**, add "hand-drawn imperfection, slightly wobbly confident linework, visible pen pressure variation, NOT a clean vector illustration".
- **If cross-hatching is missing or too light**, add "dense, heavy cross-hatched and stippled shading with visible individual pen strokes" and name the specific area that needs it.
- **For the vignette-grid composition**, cap it at 5-6 elements — more than that and the model tends to lose linework quality per element.
- **For the single-hero-subject composition**, this style still works well at Samsung Frame TV scale (3840x2160) because cross-hatch detail reads clearly at large size, and pure black-on-white holds up well against any TV art-mode frame color.
- **Subject-specific texture needs naming.** Don't rely on "cross-hatching" alone to imply the right material feel — name what the hatching is depicting ("cross-hatched fur shading", "stippled stone texture", "hatched fabric folds") so the model renders the correct kind of density pattern for that material.
