# Adobe Stock — Titles & Keywords Metadata Guide

> Source: Adobe's public contributor guidance on crafting titles and keywords. This governs the actual text quality of metadata — layered on top of the legal restrictions in `adobe-stock-genai-policy.md` and the technical/quality baseline in `adobe-stock-quality-standards.md`.

Buyers search by keyword, and Adobe Stock's search engine surfaces content by title + keywords. Generic or inaccurate metadata means real buyers who need exactly this content will never find it — accuracy and specificity are what make metadata work, not just presence.

## Preplanning (relevant when crafting a generation prompt, not just after the fact)

Gather specific details up front rather than defaulting to generic terms — specificity is what makes metadata marketable:

- Names of animal species (not just "animal" or "bird")
- Names of cuisines (not just "food")
- Types of clothing and hairstyles
- Model/community-approved demographic characteristics (race, ethnicity, cultural background, etc.) — only ever factual, never guessed
- Names of equipment or processes
- Specific actions or event names

Brand names, logos, and trademarks must still be avoided/removed regardless of how specific they'd make the metadata — specificity never overrides the IP restriction.

## Language

Titles and keywords must be in a **single, consistent language** matching whatever is selected in the Contributor portal's "I'm writing title & keywords in" dropdown. A mismatch between the dropdown selection and the actual metadata language means the content won't surface in search at all — this is a silent failure, not a rejection, so it's easy to miss.

Local language is encouraged for content with local relevancy (people, uniforms, traditional dress, regional architecture, regional flora/fauna) — but the dropdown selection must be switched to match, and it does not persist between sessions.

## Titles

- Titles are short, factual, plain-language descriptions — not formal sentences, not keyword lists strung together
- **Hard limit: 70 characters or fewer** — titles become part of the Adobe Stock URL and need to work in web search results, so this is stricter than it might seem
- Accurate, relevant, descriptive, precise
- Never include: company/brand/product names; artist names (including single-name artists); real known people; fictional character names; names of creative works (movie, franchise, comic, art, design, architecture)
- Never reference other creative work stylistically, even without naming it — banned phrasings include **"...in the style of...", "...inspired by...", "...influenced by...", "...in the tradition of...", "...drawing on..."**
- When describing people: always use caring, engaged language. Never demeaning, derogatory, endangering, or injurious language about people, cultures, heritage, beliefs, practices, or identity

### Effective title examples (from Adobe's own guidance)

- "Gay couple hugging in the park"
- "Aerial view of Mount Bromo, Indonesia"
- "Woman in laboratory with face mask and gloves"
- "Senior woman flexing her muscles on beach"
- "Illustration of Boxer dog with glasses"

Note the pattern: plain descriptive phrase, subject + setting/action, no keyword stuffing, well under 70 characters.

### Auto-title feature (Adobe Stock contributor portal)

The portal can suggest up to 3 English-only titles per file (skipped if the file already carries title metadata). Suggestions often lack the specific detail buyers search for — if a suggestion is used as a starting point, add missing specifics: location, species name, cuisine name, GenAI labeling, or demographic detail from a release. Not directly relevant to this project's workflow (metadata is written manually via the export script), but useful context if the user is ever hand-editing in the portal.

## Keywords

**Keyword order is the single most important lever for discoverability.** Arrange by importance — most important first. The first 10 keywords carry outsized search weight (this is repeated across every Adobe Stock policy doc for a reason).

- Up to **49 keywords** allowed. Be descriptive but not verbose — match complexity to the content, don't pad.
- Cover: who/what is the subject, what action is depicted, what's the setting, and any specific/unique distinguishing details.
- Bring the individual words/concepts from the title into the top 10 keywords for a search-relevance bump.

### Keyword construction rules

- **Separate descriptive elements from subjects into individual keywords.** Don't combine "white fluffy pup" into one keyword — list "white", "fluffy", "young animal", "pup" separately, since combined phrases don't translate or surface correctly. Natural compound terms are the exception — "Arctic Fox" or a scientific name like "Vulpes lagopus" work fine as single keywords.
- **Include both general and specific levels.** E.g., "animal", "mammal", "carnivora" alongside "Arctic Fox" — specificity alone isn't enough if the general category terms are missing.
- **Locations need their country.** A city/state/province alone is ambiguous (London, England vs. London, Ontario) — always pair with country. Never include multiple or conflicting locations for one asset; buyers expect accuracy and conflicting location claims damage trust.
- **Conceptual/mood keywords** — feelings, mood, trends (solitude, childhood, milestones, conservation) are valid and valuable, but must genuinely apply. "Cold" fits an ice cube; "heat" doesn't.
- **Number of people** — always state it: "one person", "three people", or "nobody" if none. Never use people's actual names as keywords.
- **Setting descriptors** — indoors/outdoors, day/night, sunny/cloudy, etc.
- **Viewpoint** — high-angle view, directly above, aerial view, drone point of view, etc., when applicable.
- **Demographic information** — only when known and factual (from an actual model release, never guessed), using language the model/community would recognize as accurate.
- No third-party IP or IP-adjacent terms as keywords (same restriction as titles).
- No artist names, real people's names, or fictional character names as keywords (same restriction as titles).

### Effective keyword set examples (from Adobe's own guidance)

- *Title: "Aerial view of Mount Bromo, Indonesia"* — Keywords: Mount Bromo, active volcano, volcano, national park, crater, cloud, mountain, sky, landscape, nature, scenic, tranquil scene, calmness, geology, travel, aerial view, outdoors, twilight, nobody, Indonesia, Asia, Java, East Java, Bromo Tengger Semeru National Park, Tengger Mountains
- *Title: "Illustration of Boxer dog with glasses"* — Keywords: boxer dog, dog, one animal, eyeglasses, head, serious, black, red, yellow, screen print, rustic, humor, vintage, retro, pet, nobody, animal

The Boxer-dog example is worth noting directly: it's an *illustration*, uses "screen print", "vintage", "retro" as legitimate style/technique keywords, and correctly includes "nobody" since no people are depicted — the same shape of keyword set this project's art skills should be producing.

## Demographic information from model releases

Only relevant when a piece depicts a person. Source demographic keywords from the actual model release, never from assumption — accuracy matters more than completeness here.
