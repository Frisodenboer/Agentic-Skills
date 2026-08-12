# Graf2 — Chrome-Metallic Blockbuster Graffiti Style Guide

> Written from close analysis of reference piece `Graf_Style_02.jpg` on 2026-04-22.
> Core identity: **chrome-metallic blockbuster** with dual-metallic fills (silver chrome + copper/bronze), multi-plane volumetric 3D bevels, dark near-black background, and warm amber outer glow.

## Style Definition

**Graf2 Chrome Blockbuster** — bold rounded-edge inflated blockbuster letterforms executed with **dual-metallic chrome fills** (bright silver-chrome highlight zones transitioning to warm copper-bronze shadow zones), reinforced by thick dark outlines with electric-cyan inner-edge highlights, given volumetric depth through **multi-plane beveled 3D construction** (3-4 distinct tonal planes per letter), set against a **dark near-black background** (#0A0A1A), warmed by a soft **amber-orange outer glow halo**, and punctuated by sharp white/cyan star-burst chrome reflections and controlled chrome-matched drips. The entire piece floats on dark void — museum exhibition / Samsung Frame TV night-mode / premium dark-background product presentation.

## Lineage DNA

- **New York Subway Chrome Pieces** (Seen, Dondi, Blade, 1980s): inflated block letters with chrome/metallic fills, thick outlines, 3D depth
- **European Chrome Tradition** (Loomit, Daim, Delta, 1990s-2000s): refined chrome rendering, multi-tonal metallic surfaces, polished execution
- **Blockbuster Writing** (Cope2, T-Kid, 1990s): bold inflated letters with wide proportions, rounded corners, confident presence
- **Modern Chrome Evolution** (2010s-present): dual-metallic effects, beveled face construction, dark-background gallery presentation
- **Dark-Mode Gallery Aesthetic** (Samsung Frame / museum wall / Etsy dark listing): piece on dark void, premium product styling, no street context

---

## The Core Technique — DUAL-METALLIC CHROME, not flat fills

The defining characteristic of Graf2: every letter surface is a **dual-metallic chrome treatment** with distinct tonal zones simulating polished metal reflecting a directional light source. This is NOT a flat silver fill, NOT a single-color metallic spray — it is a carefully controlled multi-tonal surface that reads as real chrome.

### Where dual-metallic chrome appears (EVERY one of these is a multi-tonal metallic, not a flat fill)

1. **Letter body fills** — primary dual-metallic effect: silver-chrome highlight (#E8E8E8 to #FFFFFF) on upper-left face, midtone silver (#B0B0B0 to #C0C0C0) on center, copper-bronze (#B87333 to #D4956A) on lower-right shadow
2. **3D bevel faces** — each of the 3-4 tonal planes is a different shade of chrome: near-white top face, mid-silver front face, dark gunmetal shadow face, near-black deep crevice
3. **Outer glow halo** — warm amber-to-orange gradient (#E8943A to #0A0A1A), dense near letters, dissolving into the dark background
4. **Drip accents** — each drip inherits the shadow-tonal value of its parent letter (dark chrome or copper-bronze)
5. **Optional chrome sheen reflection** — a subtle bright streak across the midtone face simulating a reflected light source

### The metallic-tone lexicon

Use these exact tone descriptors when prompting — they map to the chrome tones visible in the reference piece:

| Zone | Tone Name | Hex Range | Description |
|------|-----------|-----------|-------------|
| **Highlight** | White-hot chrome | #E8E8E8 to #FFFFFF | Brightest zone, where light hits directly |
| **Mid-highlight** | Bright silver | #C8C8C8 to #E0E0E0 | Transition from highlight to midtone |
| **Midtone** | Classic silver chrome | #A0A0A0 to #C0C0C0 | The main visible chrome surface |
| **Mid-shadow** | Warm bronze | #C09050 to #D4956A | First shadow zone, picking up copper warmth |
| **Shadow** | Deep copper-bronze | #B87333 to #8A5A28 | Dark shadow with warm metallic undertone |
| **Deep shadow** | Dark gunmetal | #404050 to #303040 | Cool-toned dark metallic |
| **Crevices** | Near-black chrome | #1A1A2E to #0A0A14 | Darkest tones, almost black with metallic hint |

The key to the dual-metallic effect is the **warm/cool split**: highlight and midtone zones read as cool silver-chrome, while shadow zones introduce warm copper-bronze tones. This warm-cool interplay is what separates a convincing chrome piece from flat gray paint.

---

## The Outline System — Thick dark + cyan inner highlight

Graf2 uses a different outline system than Graf1's three-band stack. Here the outline is a single heavy dark line with one internal highlight accent.

| Layer | Color | Width (relative to letter height) | Position |
|-------|-------|-----------------------------------|----------|
| **Primary outline** | Dark charcoal-black #1A1A2E | ~4-5% | Full loop around every letter, heavy and confident |
| **Inner highlight** | Electric cyan #00D4FF | ~1-1.5% | Runs along the inside of the outline on the TOP and LEFT edges only — catches light |

### The rule

- **Primary outline** is a full, even loop around every letter — thick, dark, confident. This is the dominant edge.
- **Cyan inner highlight** is NOT a full loop — it runs only along the top and left inner edges of the outline, creating a lit-edge effect where the chrome surface catches light. It fades out on the bottom and right edges.
- The contrast between the dark outline and the cyan highlight creates the "lit edge" that makes chrome read as reflective metal.

### Outline color swaps by palette

| Fill Palette | Primary Outline | Inner Highlight |
|--------------|-----------------|-----------------|
| Silver Chrome (default) | Charcoal-black #1A1A2E | Electric cyan #00D4FF |
| Rose Gold | Deep burgundy #2A1020 | Warm pink #FF8AC4 |
| Gunmetal | Near-black #0D0D14 | Ice-blue #8ED4F0 |
| Platinum Ice | Slate blue #1A2040 | White-silver #E8F0FF |
| Molten Copper | Dark brown-black #1A0D0A | Gold-amber #FFD060 |

**Rule of thumb:** the inner highlight is always a BRIGHT accent that contrasts with the dark outline. It should feel like light catching a polished edge.

---

## The Background — DARK NEAR-BLACK, full stop

### The rule (non-negotiable)

The piece floats on a **dark near-black background (#0A0A1A)** with a subtle cool-blue undertone. Premium dark-mode gallery presentation.

**NO**:
- No white background (Graf1 is white — Graf2 is the dark counterpart)
- No wall texture (no concrete, no brick, no metal, no plywood)
- No environmental context (no alley, no subway, no sidewalk, no street)
- No floor, ground, horizon, or environmental shadow
- No warm-gray or midtone background — it must be DARK

**YES**:
- Deep near-black #0A0A1A with subtle cool-blue undertone
- Warm amber-orange glow dissolves into the dark background behind the letters
- Drips appear to float on the dark surface (no ground plane)
- Chrome reflections and star bursts pop against the dark void
- The composition is "isolated" on dark the way a museum piece is lit against dark walls

### Prompt phrase to lock it in

> "Dark near-black background (#0A0A1A) with a subtle cool-blue undertone, no wall texture, no concrete, no white, no environmental shadows, no street context, no floor, no horizon, the piece floats on dark void like a gallery exhibition on dark museum walls, Samsung Frame TV in night-mode presentation."

---

## Letterform Philosophy

### Blockbuster Block-Letter Construction

- **Bold and inflated, not interlocking**: Letters sit side by side in a confident row, each one a self-contained block form. They do NOT weave into each other like wildstyle.
- **Rounded edges**: Corners are soft and inflated, like the letters were blown up with air — pillow-like volume. NOT sharp arrows, NOT shard-like points.
- **Wide proportions**: Blockbuster letters are WIDE — horizontally expansive, not narrow or condensed. They fill space with presence.
- **Chunky geometric forms**: The underlying geometry is simple — rectangles, rounded rectangles, and soft curves. No complex angular ribbon-work.
- **Legibility-adjacent**: While Gemini won't spell real words, the letter SHAPES should look like they COULD be read — they're simpler and bolder than wildstyle, closer to actual block letterforms.
- **Consistent baseline**: Unlike wildstyle's wavy baseline, blockbuster letters sit on a relatively even line. They can vary slightly in height but not wildly.
- **No arrow tips, no serif flags**: Unlike Graf1 wildstyle, blockbuster letters do not extend into arrow tips or flag-serifs. Their edges terminate in smooth rounded forms.

### Letterform vocabulary for prompts

- "bold blockbuster letterforms"
- "inflated block letters"
- "rounded-edge chunky letters"
- "wide-proportion geometric block forms"
- "pillow-like inflated volume"
- "smooth curved corners"
- "bold confident row of block shapes"
- "chrome-blockbuster letterforms"

### Terms to AVOID in prompts

- "wildstyle" / "interlocking" / "interwoven" (that is Graf1)
- "arrow-tipped" / "serif-extended" / "shard counter-spaces" (that is Graf1)
- "graffiti font" / "Urban font" / "street font"
- "spells X" / "reads X" / "the word X"
- "bubble letters" (too soft and rounded — blockbuster has more geometric structure)
- "neon sign" / "LED"
- "white background" (Graf2 is DARK background)

---

## Drip and Splatter Accents

### Drip rules

- **Quantity**: 2-3 drips across the whole piece, NOT a curtain
- **Origin**: Drips fall from letter bottoms or the lowest edge of a chrome face — never from the middle of a surface
- **Length**: Short to medium — 5-10% of letter height
- **Color**: Each drip inherits the **shadow tonal value** of its parent letter — dark chrome silver or copper-bronze
- **Drip head**: Small rounded bead at the tip, slightly wider than the drip shaft
- **Outline**: Drips have a thin dark-outline line around them, matching the primary outline system

### Metallic splatter accents

- **Quantity**: 8-15 tiny dots scattered around letter edges
- **Colors**: Mix of silver specks, copper-bronze specks, and dark chrome specks
- **Placement**: Concentrated near the outer edges of the letters where overspray would land
- **Size**: Very small — 1-3 pixels equivalent at full resolution, subtle aerosol realism
- **Purpose**: Proves this is spray-can chrome work, not a digital vector or 3D render

---

## Star-Burst Chrome Reflections

### Star bursts

- **Quantity**: 3-5 across the piece
- **Shape**: Classic four-point specular reflection — two crossed lines with a bright center, sharp and crisp
- **Color**: Pure white or very pale cyan (#E8F8FF to #7FDCF4 range)
- **Size variation**: 2-3 medium (2-3% of piece height) and 1-2 small (1-1.5%)
- **Placement**: ONLY on the brightest chrome highlight faces where polished metal would catch and focus direct light
- **Purpose**: These are SPECULAR REFLECTIONS on chrome, not decorative sparkles — they must look like light bouncing off a polished surface
- **Never on shadow faces** — star bursts only appear where the chrome is brightest

### Chrome sheen streaks (optional)

- 1-2 subtle bright streaks running across the midtone chrome face, simulating a reflected light source (like a fluorescent tube reflecting off polished metal)
- Very thin, very subtle — not a dominant element
- White or near-white, low opacity

---

## The Warm Amber Halo (outer glow on dark background)

### Halo rules

- **Shape**: Radial, extending 15-25% beyond the letter silhouette on all sides
- **Inner edge**: Dense warm amber (#E8943A), concentrated just outside the outline
- **Mid**: Soft orange-amber glow, warming and desaturating outward
- **Outer edge**: Dissolves completely into the dark near-black (#0A0A1A) background — NOT a hard edge, NOT visible in the corners
- **Irregularity**: The halo follows the letter silhouette loosely, slightly stronger in some spots — NOT a perfect circle
- **Purpose**: Creates depth, separates the chrome letters from the dark void, adds warmth to the cool metallic tones

### Palette swaps for the halo

- Silver Chrome → warm amber halo (default)
- Rose Gold → soft rose-pink halo
- Gunmetal → cool steel-blue halo
- Platinum Ice → pale ice-white halo
- Molten Copper → deep orange-red halo

---

## 3D Multi-Plane Beveled Construction

### The bevel-plane system

Unlike Graf1's single-gradient drop-block, Graf2 uses a **multi-plane bevel** where each letter has 3-4 visible tonal faces, each a different shade of chrome. This is the key to volumetric chrome realism.

| Plane | Tone | Hex Range | Description |
|-------|------|-----------|-------------|
| **Top face (highlight)** | White-hot chrome | #D8D8D8 to #F0F0F0 | Brightest face, catching direct light |
| **Front face (midtone)** | Silver chrome | #909090 to #B0B0B0 | The main visible surface |
| **Shadow face** | Dark gunmetal | #404050 to #606070 | The face turned away from light |
| **Deep crevice** | Near-black | #1A1A2E to #0A0A14 | Where faces meet, deepest shadow |

### Bevel rules

- **Direction**: Consistent light source from upper-left — highlight faces are always top and left, shadow faces are always bottom and right
- **Depth**: 8-12% of letter height, uniform across all letters
- **Tonal separation**: Each face must be VISUALLY DISTINCT from the next — a clear tonal step, not a gradual gradient
- **Edge highlight**: A thin (1-pixel equivalent) white or near-white hairline along the edge where the highlight face meets the midtone face — suggests a sharp chrome bevel catching light
- **No gradient within a face**: Each plane is a relatively even tone — the gradient happens BETWEEN planes, not within them

### How this differs from Graf1's drop-block

- Graf1: single block projecting down-left, ONE gradient inside it (cobalt to navy to black)
- Graf2: multi-plane bevel with 3-4 DISTINCT tonal faces, each its own even shade, separated by hairline edges

---

## Composition

### Format

**Horizontal banner** — blockbuster chrome pieces fill horizontal space.

- **DEFAULT AND ONLY STANDARD**: 16:9 at 3840x2160px (Samsung Frame TV)
- 21:9 or 2:1 panoramic acceptable but non-default
- 1:1 / 9:16 are off-spec — blockbuster chrome does NOT work vertical without major adjustment

### Layout Zones (on dark near-black)

```
+----------------------------------------------------+
|                                                    |
|     dark void (breathing room)                     |
|                                                    |
|       WARM AMBER HALO (radial, -> dark void)       |
|      +----------------------------------------+    |
|      |                                        |    |
|      |  BLOCKBUSTER CHROME BLOCK LETTERS      |    |
|      |  (dual-metallic fills, 3D bevel faces, |    |
|      |   dark outlines, cyan highlights,      |    |
|      |   star-burst reflections)              |    |
|      |                                        |    |
|      +----------------------------------------+    |
|       /drip  /drip              /drip              |
|                                                    |
|     dark void                                      |
+----------------------------------------------------+
              dark near-black background (#0A0A1A)
```

### Placement Rules

- **Letters fill 60-70% of the width** — leaves margin for halo + breathing dark void
- **Letters occupy the middle 40-60% of the height** — halo and void live above/below
- **Relatively even baseline** — blockbuster letters sit on a fairly level line, not the wavy wildstyle baseline
- **Slight asymmetry acceptable** — minor rightward or leftward lean feels natural, but blockbuster is generally more centered and balanced than wildstyle
- **3D bevel extends down and to the right** beyond the main letter bounds, adding depth
- **Drips hang down** from letter bottoms, floating on the dark void

### Eye Flow

1. Lock onto the chrome star-burst reflections (brightest points)
2. Follow the highlight-to-shadow gradient across the dual-metallic surfaces
3. Read the letter row left to right, taking in the rounded blockbuster forms
4. Trace the 3D bevel depth on each letter
5. Return to admire the warm amber glow halo and chrome drip details

---

## Mood

**Polished, industrial, premium — a chrome exhibition piece with dark-museum presentation quality.**

- **Metallic** — the dual-chrome treatment reads as real polished metal, not paint
- **Bold** — blockbuster letters are wide, inflated, confident — they OWN the space
- **Premium** — the dark background and warm glow give a high-end gallery feel
- **Industrial** — chrome references subway trains, industrial metalwork, polished steel
- **Dark-luxury** — the near-black background with amber glow is like a jewelry display case
- **Confident** — clean execution, consistent bevel planes, deliberate star-burst placement

---

## Reusable Prompt Templates

### Full Style Prefix (Graf2 — chrome metallic on dark background)

```
Ultra-detailed photorealistic chrome-metallic blockbuster graffiti piece rendered as a premium dark-mode product shot on a dark near-black background (#0A0A1A) with subtle cool-blue undertone — no wall, no concrete, no grit, no environmental context, no floor, no horizon, the piece floats on dark void like a gallery exhibition on dark museum walls. Bold inflated blockbuster letterforms with wide proportions and soft rounded corners fill the horizontal composition — chunky geometric block shapes with smooth curved edges, inflated pillow-like volume, letters sitting side by side in a confident row. Letter bodies are filled with a dual-metallic chrome effect — a bright silver-chrome highlight zone of near-white on the upper-left face, transitioning smoothly through a midtone silver on the center face, into a warm copper-bronze shadow on the lower-right face, consistent light direction across the entire piece, polished-metal reflective surface. Thick dark charcoal-black outline around every letter with a bright electric-cyan highlight line running along the inside of the outline on the top and left edges only, creating a lit-edge effect. Multi-plane volumetric 3D beveled construction on every letter — top bevel face bright near-white chrome, front face midtone silver, bottom-right shadow face dark gunmetal to deep charcoal, deepest crevices near-black, with a thin white hairline separating each tonal plane. Soft warm amber-orange airbrush glow aura radiating behind the letters into the dark background, dense amber near the silhouette dissolving into dark near-black at the outer edge. Three to five sharp white or pale-cyan four-point star-burst specular reflections on the brightest chrome faces. A handful of fine metallic micro-splatter dots around the letter edges. Clean-cut chrome-piece technique, confident polished execution. Gallery-grade dark-mode presentation, ultra-detailed, every chrome tonal plane smooth, every bevel edge crisp.
```

### Short Style Shorthand

```
Chrome-metallic blockbuster graffiti, dark near-black background #0A0A1A (no wall, no white, no concrete), bold inflated rounded-edge block letters with dual-metallic chrome fills (silver-chrome highlight + copper-bronze shadow), thick dark outline with cyan inner-edge highlight, multi-plane volumetric 3D bevel (3-4 distinct tonal faces), warm amber outer-glow halo dissolving into dark void, 3-5 star-burst specular reflections on chrome, chrome-matched drips from letter bottoms, metallic splatter accents, ultra-detailed polished chrome technique, gallery / Samsung Frame dark-mode presentation
```

### Style Keyword Matrix

| Dimension | Keywords |
|-----------|----------|
| Background | dark near-black #0A0A1A, cool-blue undertone, dark void, museum wall, Samsung Frame TV night-mode, dark gallery, premium dark presentation, no white, no concrete |
| Fills | dual-metallic chrome, silver-chrome highlight, copper-bronze shadow, polished metal, reflective surface, highlight-to-shadow gradient, warm-cool split |
| Outlines | thick dark charcoal outline, electric-cyan inner highlight, lit-edge effect, top-left highlight accent |
| 3D | multi-plane bevel, volumetric construction, 3-4 tonal faces, near-white top face, midtone silver front, dark gunmetal shadow, near-black crevices, hairline edge separation |
| Halo | warm amber-orange glow, radial aura, dissolving into dark background, silhouette-following |
| Highlights | star-burst specular reflections, chrome reflections, four-point stars, white/pale-cyan, on brightest faces only |
| Drips | chrome-matched, dark chrome or copper-bronze, rounded beads, from letter bottoms, 2-3 total |
| Splatter | metallic micro-splatter, silver/copper/dark-chrome specks, aerosol realism, around letter edges |
| Letterforms | blockbuster, inflated, rounded-edge, wide proportions, chunky block shapes, smooth corners, pillow-like volume, side by side |
| Technique | chrome piece, metallic spray, dual-metallic, polished metal, chrome bumper, polished steel |
| Mood | polished, industrial, premium, bold, confident, dark-luxury, gallery-grade chrome |

### Signature Chrome Palettes (with outline pairs)

**Silver Chrome (house default)** — Silver-chrome highlight (#E8E8E8 to #FFFFFF) / midtone silver (#B0B0B0 to #C0C0C0) / copper-bronze shadow (#B87333 to #D4956A) fill / charcoal-black #1A1A2E outline / electric cyan #00D4FF inner highlight / warm amber halo

**Rose Gold** — Rose-pink highlight (#F0C0C8 to #FFE0E8) / midtone rose-gold (#C8A0A8 to #E0B0B8) / deep rose-copper shadow (#8A4050 to #6A2838) fill / deep burgundy #2A1020 outline / warm pink #FF8AC4 inner highlight / rose-pink halo

**Gunmetal** — Cool silver highlight (#C8C8D0 to #E0E0E8) / gunmetal midtone (#707078 to #909098) / deep slate shadow (#303038 to #404048) fill / near-black #0D0D14 outline / ice-blue #8ED4F0 inner highlight / cool steel-blue halo

**Platinum Ice** — Ice-white highlight (#F0F4FF to #FFFFFF) / platinum midtone (#C0C8D8 to #D8E0F0) / cool silver shadow (#8090A0 to #A0A8B8) fill / slate blue #1A2040 outline / white-silver #E8F0FF inner highlight / pale ice-white halo

**Molten Copper** — Bright copper highlight (#E0A050 to #F0C070) / midtone copper (#B07830 to #D09040) / deep burnt-copper shadow (#6A3A18 to #8A4A20) fill / dark brown-black #1A0D0A outline / gold-amber #FFD060 inner highlight / deep orange-red halo

### Example Prompts

**House Default — Silver Chrome**

```
[Full Style Prefix, Silver Chrome palette]. The piece reads as a confident row of bold inflated blockbuster block letterforms across the horizontal composition, each letter sitting side by side with smooth rounded corners and wide proportions. The dual-metallic chrome fills transition from near-white highlight on the upper-left faces through midtone silver on the center to warm copper-bronze on the lower-right shadow faces, consistent light direction throughout. The warm amber halo is wide and soft, extending about 20% beyond the letter silhouettes and dissolving cleanly into the dark near-black background. Four star-burst specular reflections catch light on the brightest chrome faces. Two drips hang from the lower letter edges in dark copper-bronze. Ultra-detailed, gallery-grade dark-mode presentation. No text, no watermarks, no signatures.
```

**Rose Gold — Pink Chrome**

```
[Full Style Prefix, Rose Gold palette]. Letter bodies are filled with a rose-gold dual-metallic chrome effect — rose-pink highlight on the upper-left faces, midtone rose-gold on the center, deep rose-copper on the shadow faces. Deep burgundy outline with warm pink inner-edge highlight on top and left edges. Multi-plane bevel with rose-pink top face, rose-gold midtone face, and deep rose shadow faces. Soft rose-pink halo aura dissolves into the dark background. Star bursts are warm white-pink. Chrome drips in deep rose-copper. Studio-isolated on dark near-black #0A0A1A — no wall, no context. Ultra-detailed. No text, no watermarks, no signatures.
```

**Gunmetal — Cold Steel**

```
[Full Style Prefix, Gunmetal palette]. Letter bodies feature a gunmetal dual-metallic effect — cool silver highlight on upper-left faces, gunmetal midtone on center, deep slate on shadow faces. Near-black outline with ice-blue inner-edge highlight. Multi-plane bevel with cool-toned faces from ice-silver to dark slate. Cool steel-blue halo aura dissolves into the dark background. Star bursts are pure white with ice-blue tint. Chrome drips in deep slate. Ultra-detailed gallery presentation, dark background. No text, no watermarks, no signatures.
```

**Molten Copper — Liquid Metal**

```
[Full Style Prefix, Molten Copper palette]. Letter bodies are filled with a molten copper dual-metallic effect — bright copper highlight (#E0A050 to #F0C070) on upper-left faces, midtone copper on center, deep burnt-copper shadow on lower-right faces. Dark brown-black outline with gold-amber inner-edge highlight. Multi-plane bevel with copper-gold top face, warm copper midtone, and deep burnt umber shadow. Deep orange-red halo aura dissolves into the dark background. Star bursts are warm gold-white. Chrome drips in deep burnt copper. Ultra-detailed. No text, no watermarks, no signatures.
```
