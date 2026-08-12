---
name: analyze-style
description: Analyze a PDF document to extract its visual and textual style — typography, color palette, photography style, layout patterns, brand voice, and visual hierarchy — and save a comprehensive style report as a markdown file. Use this skill whenever the user wants to extract the style, look, feel, design language, or brand identity from a PDF document. Also trigger when the user asks to "analyze a brochure", "reverse-engineer the design", "figure out the style of this PDF", "extract the brand guidelines", or wants to understand how a document looks so they can replicate it. This is the go-to skill for any PDF style extraction or design analysis task in this project.
---

# Analyze Style — PDF Style Extraction

This skill reads a PDF document and produces a detailed style report capturing everything needed to reproduce its visual identity across new materials (web pages, social media, print, etc.). The report is saved as a markdown file in `public/style-report/`.

## Why this matters

Marketing teams need brand consistency. When someone hands you a polished brochure or campaign PDF and says "make the website look like this," you need more than vague impressions — you need specific, actionable details about typography, colors, spacing, imagery style, and tone of voice. This skill extracts all of that into a single reference document.

## Workflow

### 1. Get the PDF path

Ask the user which PDF they want analyzed. They might give you:
- A file path (e.g., `docs/brochure.pdf`)
- A filename to search for
- A description ("the marketing deck in the docs folder")

If they give a vague description, use Glob to find likely candidates and confirm with them.

### 2. Read and analyze the PDF

Use the Read tool to examine the PDF. For PDFs over 10 pages, read in batches of 15-20 pages at a time (the Read tool supports a `pages` parameter like `"1-15"`, `"16-30"`, etc.).

As you read each page, study it carefully and take note of:

**Typography**
- Heading fonts and styles (size relative to body, weight, case, letter-spacing)
- Body text characteristics (serif vs sans-serif, weight, line height feel)
- Any display or decorative fonts used for callouts, quotes, or accents
- How text hierarchy works: H1 → H2 → H3 → body → caption progression

**Color Palette**
- Primary brand color(s) — the dominant colors that define the look
- Secondary/accent colors — used for highlights, CTAs, dividers
- Background colors — main background, section alternates, card backgrounds
- Text colors — headings, body, muted/secondary text
- Describe colors using both a name and approximate hex code where possible (e.g., "deep navy blue, approximately #1a2744")

**Photography & Imagery Style**
- Subject matter — what's being shown (people, products, abstract, nature, etc.)
- Mood/tone — energetic, calm, luxurious, technical, warm, clinical
- Color grading — warm tones, cool tones, desaturated, high-contrast, natural
- Composition patterns — close-up, wide shot, centered, rule-of-thirds, overhead
- Treatment — full-bleed, rounded corners, bordered, overlapping, with duotone filters
- Illustration style if applicable — flat, 3D, hand-drawn, geometric, isometric

**Layout & Spacing**
- Overall grid feel — single column, two-column, asymmetric, magazine-style
- Whitespace usage — generous/airy vs compact/dense
- Section structure — how content blocks are divided and separated
- Alignment patterns — left-aligned, centered, mixed
- Card or container styles if used

**Brand Voice & Tone**
- Formality level — corporate, conversational, playful, authoritative
- Sentence style — short punchy, long descriptive, question-driven
- Vocabulary — technical jargon, simple language, industry-specific terms
- Call-to-action style — direct, suggestive, urgent
- Any taglines, slogans, or recurring phrases

**Visual Hierarchy & Design Elements**
- How the eye is guided through each page
- Use of dividers, rules, shapes, or decorative elements
- Icon style if present — outline, filled, duotone, custom illustrations
- Logo placement and treatment
- Any distinctive graphic motifs or patterns (gradients, geometric shapes, textures)

### 3. Compile the style report

Synthesize your observations into a well-structured markdown report. The report should be actionable — a designer or developer reading it should be able to recreate the visual feel of the document without seeing the original.

Use this template structure:

```markdown
# Style Report: [Document Name]

> Analyzed from: [filename] | Date: [today's date] | Pages: [count]

## Executive Summary
[2-3 sentences capturing the overall design personality — the "elevator pitch" of the style]

## Typography

### Headings
[Details about heading styles, hierarchy]

### Body Text
[Details about body text]

### Special Text Treatments
[Callouts, quotes, captions, labels]

## Color Palette

### Primary Colors
[Color name — approximate hex — where/how used]

### Secondary & Accent Colors
[Color name — approximate hex — where/how used]

### Background & Neutral Colors
[Color name — approximate hex — where/how used]

### Text Colors
[Color name — approximate hex — where/how used]

## Photography & Imagery

### Style Overview
[Overall mood, tone, and approach]

### Subject Matter
[What's shown in the images]

### Treatment & Composition
[How images are cropped, filtered, placed]

## Layout & Spacing

### Grid & Structure
[Column layout, section patterns]

### Whitespace & Density
[Spacing approach]

### Component Patterns
[Cards, containers, repeated layout blocks]

## Brand Voice & Tone

### Writing Style
[Formality, sentence structure, vocabulary]

### Messaging Patterns
[CTAs, taglines, recurring themes]

## Visual Elements & Motifs

### Icons & Graphics
[Style of any icons, illustrations, decorative elements]

### Logos & Brand Marks
[Placement, sizing, treatment]

### Distinctive Patterns
[Any unique graphic motifs, textures, shapes]

## Recommendations for Reproduction
[Practical tips for recreating this style in web/digital/print — what CSS properties, what Tailwind classes, what image direction to give a photographer or AI image generator]
```

### 4. Save the report

- Create the output directory if it doesn't exist: `public/style-report/`
- Derive the filename from the PDF name: strip the `.pdf` extension, convert to lowercase kebab-case, and append `-style-report.md`
  - Example: `Marketing Brochure 2024.pdf` → `marketing-brochure-2024-style-report.md`
- Write the report using the Write tool
- Tell the user where the file was saved and give a brief summary of the key style findings

## Tips for thorough analysis

- Look at multiple pages to identify consistent patterns vs one-off treatments. The recurring elements are the brand — one-off elements are creative variations.
- When you're unsure about exact colors, describe them relative to common references ("similar to Tailwind's slate-800", "close to a Tiffany blue").
- Pay attention to what's *not* there — minimal designs are defined as much by what they exclude as what they include. Note if the design avoids drop shadows, gradients, borders, etc.
- For photography style, think about what brief you'd give to a photographer or what prompt you'd use with an AI image generator to get similar results. Include that in the report — it's extremely actionable.
