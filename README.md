# Agentic Skills

A Claude Code marketplace of agent skills, each installable on its own.

## Install

```
/plugin marketplace add Frisodenboer/Agentic-Skills
/plugin install youtube-titles@agent-marketplace
```

Run `/plugin marketplace update agent-marketplace` to pick up new skills and updates.

## Skills

### Art styles

Each generates a new original piece in a fixed house style, at 3840x2160 (16:9) unless asked otherwise. All of them call `nano-image` to render, so they need `GEMINI_API_KEY` set.

| Skill | Invoke | What it does |
| :--- | :--- | :--- |
| `abstract-expressionist` | `/abstract-expressionist` | Bold interlocking color shapes, high-chroma triadic palettes, Hofmann push-pull brushwork |
| `atmospheric-cityscape` | `/atmospheric-cityscape` | Panoramic impressionist skylines as luminous silhouettes over reflective water |
| `exp-world-map` | `/exp-world-map` | Abstract expressionist world maps where the continents stay recognizable |
| `graf1` | `/graf1` | Wildstyle graffiti — aerosol gradient fills, 3D drop-blocks, on pure white |
| `graf2` | `/graf2` | Chrome-metallic blockbuster letters with beveled 3D faces, on near-black |
| `graf3` | `/graf3` | Flat cell-shaded spray-cartoon street mascots on a charcoal wall |
| `pastoral-frame` | `/pastoral-frame` | Post-impressionist patchwork farmland under layered mountains and dusk skies |
| `pen-coastal` | `/pen-coastal` | Coastal pen-and-ink with color washes misregistered from the linework, screen-print style |
| `pen-ink-bw` | `/pen-ink-bw <subject>` | Any subject in pure black ink on pure white — tone from line density alone |
| `art-from-reference` | `/art-from-reference <image>` | Reads a reference image and generates a new piece inspired by it |

### Image tooling

| Skill | Invoke | What it does |
| :--- | :--- | :--- |
| `nano-image` | `/nano-image <prompt>` | Generates images via Google Gemini (`@google/genai`). Needs `GEMINI_API_KEY` |
| `zai-image` | `/zai-image <prompt>` | Generates images via Zhipu AI GLM-Image. Needs `ZHIPU_API_KEY` |
| `optimize-image` | `/optimize-image <path>` | Resizes and converts images to WebP, reporting the size savings |
| `instagram` | `/instagram <image>` | Crops an existing image to Instagram feed, Story/Reel, and profile sizes |
| `home-visual` | `/home-visual <artwork>` | Composites the exact artwork into AI-generated interior rooms (Pillow, not AI approximation) |

### Content and review

| Skill | Invoke | What it does |
| :--- | :--- | :--- |
| `youtube-titles` | `/youtube-titles <topic>` | Generates 10 browse-optimized, SEO-friendly YouTube titles (max 54 chars) for a video topic |
| `adobe-review` | `/adobe-review` | Audits images and their metadata CSV against Adobe Stock's submission rules before upload |
| `analyze-style` | `/analyze-style <pdf>` | Extracts typography, color, imagery, and brand voice from a PDF into a style report |
| `create-skill` | `/create-skill <name> [description]` | Scaffolds a new skill in this repo's structure and registers it in the marketplace |

## Layout

```
.claude-plugin/marketplace.json   catalog — one entry per installable skill
skills/<name>/SKILL.md            the skill itself, plus any scripts/ or references/
```

Each marketplace entry points at the repository root and names one skill directory:

```json
{
  "name": "youtube-titles",
  "source": "./",
  "skills": ["./skills/youtube-titles"],
  "strict": false
}
```

`strict: false` makes the marketplace entry the complete definition, so skills need no `plugin.json`. Because each entry names its own path, a directory in `skills/` that no entry references is not distributed. Five are kept that way on purpose:

| Unlisted skill | Why |
| :--- | :--- |
| `gbp-post` | Specific to one Google Business Profile; needs local OAuth credentials |
| `sign-artwork` | Applies the NOOL signature from `public/Artwork/nool-signature.png`, a brand asset that does not ship |
| `frame-mockup` | Composites into `public/generated-images/Nool_Base_Frame_Etsy.jpg`, likewise not shipped |
| `frontend-design` | Anthropic's own Apache-2.0 skill, vendored here for local use rather than redistributed |
| `skill-creator` | Anthropic's own Apache-2.0 skill; `create-skill` covers this repo's structure instead |

They still load in this repo — they are just not installable by anyone else.

No entry declares a `version`. Versions resolve from the git commit SHA, so pushing a commit is enough to ship an update. Adding a `version` would pin the skill and stop updates until the string changes.

## Adding a skill

Run `/create-skill <name>`, or by hand: create `skills/<name>/SKILL.md` with `name` and `description` frontmatter, add an entry to `.claude-plugin/marketplace.json`, then validate:

```bash
claude plugin validate .
```
