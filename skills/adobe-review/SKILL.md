---
name: adobe-review
description: Review images and their metadata CSV against Adobe Stock's submission standards before upload — the generative-AI-specific rules (rights/legal restrictions on titles and keywords, the "Created using generative AI tools" and "People and Property are fictional" checkboxes, Photos vs Illustrations vs Vector vs Video asset-type selection, model/property release requirements), the separate Illustrative Editorial Collection (IEC) track (100+ download eligibility gate, real-brand/newsworthy conceptual imagery rules, date/location titling, 5-50 keyword requirements — and the hard rule that generative AI content is never eligible for IEC), the general baseline quality/technical/spam standards every submission must meet (JPEG/sRGB/4-100MP/45MB tech specs, no watermarks/effects/vignettes/B&W conversion, no near-duplicate crops or flips), and title/keyword craft (70-character title limit, keyword ordering strategy, general-vs-specific keyword levels, location+country pairing, and full category descriptions for all 21 Adobe Stock categories). Use this skill whenever the user wants to check, review, audit, or verify content is ready for Adobe Stock submission or upload, wants a CSV/metadata reviewed for compliance, wants help writing or improving a title/keyword list for stock submission, asks "is this ready for stock", "will this get rejected/flagged by Adobe", asks about illustrative editorial or IEC eligibility, asks about Adobe Stock technical specs, category selection, or file requirements, or is preparing generative AI artwork for a stock photo/illustration marketplace. Also trigger on "adobe stock review", "adobe review", "stock compliance check", "genai stock policy", "adobe stock rejection", "adobe stock checklist", "illustrative editorial", "IEC eligibility", "adobe stock tech specs", "adobe stock category", "stock keywords", or similar phrases — even without the word "Adobe" if the user references stock-photo submission standards for AI-generated content.
---

# Adobe Review — Adobe Stock Generative AI Submission Checker

Review generated artwork and its Adobe Stock metadata (title, keywords, category, releases) against Adobe's published standards for generative-AI content **before** the user uploads, so rejections get caught locally instead of by Adobe's review team.

## Policy Reference

The condensed checklist below is derived from five source policy documents in `references/`:

- `adobe-stock-genai-policy.md` — generative-AI-specific submission rules, plus the Illustrative Editorial Collection (IEC) section
- `adobe-stock-quality-standards.md` — the general baseline quality, technical spec, and legal/spam rules that apply to every submission regardless of how it was made
- `adobe-stock-metadata-guide.md` — how to actually craft good titles and keywords (ordering strategy, construction rules, language consistency, real examples) — read this whenever the user wants title/keyword text drafted or improved, not just checked for policy violations
- `adobe-stock-categories.md` — full description of all 21 categories plus guidance for picking between overlapping ones

Read the relevant file when a case is ambiguous or the condensed checklist below doesn't cover something specific the user is asking about — the source docs have more nuance and examples than what's summarized here.

**Important limitation**: Adobe's policy references an external list of restricted/copyrighted artist names that isn't reproduced here. This skill cannot definitively check a name against that list — when a title or keyword contains what looks like a person's name (real or plausibly a working artist), flag it as a caution requiring the user's own judgment rather than silently passing or failing it.

## Workflow

### 1. Locate what's being reviewed

Ask for, or infer from context, the CSV metadata file (e.g., `public/out/<date>/adobe-stock-metadata.csv`) and the associated image file(s) in the same folder. If the user only points at a CSV, resolve each row's `Filename` against files in the same directory. If they only point at an image, check for a sibling CSV.

Read both the CSV and the actual image — the image matters for asset-type classification (Photos vs Illustrations) and for spotting anatomy/quality problems that only show up visually, not from metadata alone.

**Check whether this is a standard submission or an Illustrative Editorial Collection (IEC) submission.** IEC is a separate content track with its own rules (Section G below) — ask if it's unclear, since the checklist differs. If the content came from any of this project's generative art skills (Pen-Coastal, Graf1-3, Pastoral-Frame, Abstract-Expressionist, etc.), skip straight to the answer in Section G: **GenAI content is never eligible for IEC**, full stop — don't run the rest of the IEC checklist on it.

### 2. Run the checklist per asset

For **each row** in the CSV, work through the categories below and record a clear verdict: **PASS**, **FIX NEEDED** (specific, correctable), or **BLOCKED** (a legal/rights issue that needs a human decision, not an automatic fix).

#### A. Rights & legal (title + keywords + known prompt, if available)

Reject or flag anything that:
- Names a real, identifiable person (living or historical)
- Names an artist whose work is still in copyright, or closely echoes a distinctive named artist's style as a keyword (e.g., "in the style of [artist]")
- Names a fictional character or references a specific copyrighted creative work (a film title, game title, book title, franchise name)
- Implies depiction of an actual newsworthy event (a specific real event, disaster, election, etc.)
- Names a government agency (FBI, NASA, NHS, etc.)
- References third-party intellectual property — brand names, logos, trademarked product names

This is a hard filter: **BLOCKED** items must be removed or reworded before submission, not just noted.

#### B. Generative AI labeling (portal checkboxes — cannot be automated here)

This skill can't click Adobe's upload-portal checkboxes for the user, but it should always surface a reminder:
- **"Created using generative AI tools"** must be checked for every asset in this project (all artwork here is AI-generated) — no exceptions, regardless of subject.
- **"People and Property are fictional"** must be checked if the image depicts a person or recognizable property that looks real but isn't (common for photorealistic portrait-style generations). Leave unchecked if there are no recognizable people/property in the piece at all.
- If the image is based on or intended to portray an identifiable real person, a **model release** is required — flag this as BLOCKED, since a release can't be generated after the fact for a person who doesn't exist.

#### C. Asset type classification

Look at the actual image and confirm the CSV/upload asset type matches:
- **Photos** — camera-realistic, subjects that exist in real life, respects human/animal anatomy
- **Illustrations** — artistic, painterly, linework, fantasy or stylized concepts (this is the correct type for essentially everything this project's art skills produce — Pen-Coastal, Graf1/2/3, Pastoral-Frame, Abstract-Expressionist, etc.)
- **Vector** — only for true vector output
- **Video** — only for video

Flag a mismatch as **FIX NEEDED** with the correct type named.

#### D. Title & keyword quality

Full detail and worked examples in `references/adobe-stock-metadata-guide.md` — read it when drafting new titles/keywords, not just when auditing existing ones.

**Title:**
- **Hard limit: 70 characters or fewer** (not the ~200-character room the field technically allows — Adobe explicitly recommends staying under 70 so the title works in web search results and the Adobe Stock URL). Flag anything over 70 as FIX NEEDED, not just a soft caution.
- Plain, natural phrase describing the subject — not a formal sentence, not a list of keywords strung together
- No ALL CAPS, no keyword stuffing
- Does **not** contain "generative AI", "AI generated", "Midjourney", "Stable Diffusion", a specific model name, or other GenAI tooling references — the checkbox already covers this, and Adobe explicitly says don't repeat it
- Does **not** contain repetitive technical generation parameters (aspect-ratio flags, seeds, weights, resolution codes, platform-specific syntax like `--ar 16:9` or `--v 6`)
- Does **not** reference other creative work stylistically, even without naming it — banned constructions: **"in the style of...", "inspired by...", "influenced by...", "in the tradition of...", "drawing on..."**. This applies to titles, keywords, *and* the generation prompt itself, not just the final metadata.
- No trademarked names (Porsche, Ferrari, etc.), camera specifications (Nikon, 4K, etc.), or mismatched content-type descriptors (the word "video" on a still image)
- Language depicting people is caring and engaged — never demeaning, derogatory, endangering, or injurious language about people, cultures, heritage, beliefs, practices, or identity

**Keywords:**
- **Keyword order matters more than any other keyword factor** — most important terms first, since the first 10 carry outsized search weight. If the order looks arbitrary (e.g., alphabetical, or generic terms leading with specific ones buried), flag it as FIX NEEDED and propose a reordering.
- At least the individual words/concepts from the title also appear somewhere in the top 10 keywords
- Up to 49 keywords allowed — descriptive but not verbose, matched to the content's actual complexity, not padded
- Keywords cover: subject, action/technique depicted, setting, and any specific distinguishing detail — not just a flat list of nouns
- Descriptive elements are separated into individual keywords rather than glued into phrases (e.g., "white", "fluffy", "young animal" as separate keywords, not "white fluffy young animal" as one) — natural compound terms and species names are the exception (e.g., "Arctic Fox" as one keyword is correct)
- Includes both general and specific levels where relevant (e.g., "shell", "mollusk" alongside "whelk shell", not just the specific term alone)
- Any depicted location includes its country, and never conflicting/multiple locations for one asset
- Conceptual/mood keywords (solitude, nostalgia, tranquility, etc.) are welcome but must genuinely apply to the piece — don't add mood words the image doesn't support
- If people are depicted: include a count keyword ("one person", "three people") or "nobody" if none — never a person's actual name as a keyword
- Setting/viewpoint descriptors (indoors/outdoors, day/night, aerial view, etc.) are included when relevant
- Demographic keywords, if used, are factual and sourced from an actual release — never guessed
- No trademarked names, camera specs, or mismatched content-type words (same restriction as title)
- No third-party IP-adjacent terms
- Keyword list is genuinely descriptive rather than padded with irrelevant or repetitive terms — flag obvious keyword spam

**Language:**
- Title and all keywords are in one consistent language. A batch that mixes languages, or that's written in a language other than what the user says they'll select in the Contributor portal's "I'm writing title & keywords in" dropdown, won't surface in search at all — flag this as FIX NEEDED even though it's not visually obvious from the CSV alone; ask the user which language they intend if it's unclear.

**Category:**
- Category ID is a real Adobe Stock category (1-21) that plausibly matches the subject — see `references/adobe-stock-categories.md` for full descriptions and guidance on picking between overlapping categories (e.g., Landscape vs. Travel, Graphic Resources vs. People)

#### E. Model/property release requirements

- No recognizable real people or property in the piece → no release needed, note this explicitly as PASS so the user doesn't second-guess it
- Fictional-but-realistic person/property → needs the "People and Property are fictional" checkbox (see B), no release file needed
- Based on / intended to portray a specific real, identifiable person → **BLOCKED**, needs an actual model release the user must obtain — this skill cannot resolve it

#### F. Quality & spam

- Note any visible anatomy problems if the piece leans photorealistic (extra/missing fingers, malformed faces, physically impossible limbs) — less relevant for the deliberately stylized/illustrative art skills in this project, but check anyway
- Flag if the image looks converted to black-and-white or duotone — Adobe wants the flexibility of full color, so this is a rejection risk, not a style choice
- Flag any visible sunrays/flares, mirrored/kaleidoscope/repeating-pattern effects, generic filter effects, or added vignettes/frames — these read as amateur post-processing gimmicks to Adobe's reviewers
- Flag any visible text or watermark baked into the image itself — **this includes the house NOOL signature**. Adobe Stock uploads should not carry it: the signed copy in `public/Artwork/` is the portfolio/gallery deliverable, but the file that actually gets exported for stock (via `export_for_stock.py`) must be the unsigned, resized artwork. If a CSV row points at a filename that's clearly the signed version (e.g., named `nool-*-signed.jpg`), flag it as FIX NEEDED and recommend re-exporting from the pre-signature file instead.
- Note visible noise, dust, or over-aggressive sharpening/denoising artifacts if present — hard to fully assess from a compressed preview, but call out anything obvious

**GenAI-specific curation (this is where most real risk lives for this project's batch-generation workflow):**

Adobe explicitly warns that dozens of variations from one prompt with only minor changes get refused for similarity — this matters here because `export_for_stock.py` accumulates every piece generated in a day into one shared CSV, so a session of iterative test generations can easily turn into an accidental spam batch if not curated before submission.

- If the CSV contains multiple rows, check whether they represent **genuinely different concepts** (different motif, different composition, different idea) or just **visual variations on one generation** (same motif re-rendered, recolored, or reframed) — flag the latter as spam risk, not just "similar."
- Explicitly flag any pair/group in the batch that's a: flipped or rotated version of another; the same image with a different filter/effect applied; a background-color or minor-color variant; a similar composition/subject with no substantive conceptual change; or a different crop/aspect-ratio of the same underlying image.
- Recommend curating down to the strongest piece(s) per concept before submission rather than uploading everything the session produced — this is a proactive recommendation to make even when nothing in the CSV is technically BLOCKED, since Adobe's guidance frames this as a judgment call about selection, not just a rule to check against.
- Check that each row's title/keywords actually describe what's distinctive about *that* piece rather than reusing near-identical metadata across similar rows — generic or copy-pasted metadata across a batch is itself a spam signal independent of the images.

#### H. Technical specifications

Check the actual image file against Adobe's hard technical limits:

| Spec | Requirement |
|------|-------------|
| Format | JPEG |
| Color space | sRGB |
| Resolution | 4 MP minimum, 100 MP maximum |
| File size | 45 MB maximum |

Flag as **FIX NEEDED** (with the specific number) if the file falls outside any of these — e.g., a raw generator output that's a PNG needs converting to JPEG, or a file under 4 MP needs upscaling from source (not just naive enlargement, which Adobe's quality guidance separately warns against) or regenerating at higher resolution.

#### G. Illustrative Editorial Collection (IEC) — only when the user is targeting this track

IEC is conceptual imagery illustrating articles on current events/newsworthy topics, often featuring real brands and products (signage, cans, cars, computers), licensed for editorial use only. It is **not** the same as traditional editorial (documenting an actual occurring/occurred event) — Adobe doesn't accept traditional editorial at all. Full detail in `references/adobe-stock-genai-policy.md`.

**First and hardest gate: is the content generative AI?** If yes — **BLOCKED, unconditionally**. GenAI content cannot be submitted to IEC under any circumstances (this is stated both in the main GenAI policy and the IEC policy). Since every asset produced by this project's art skills is GenAI, IEC essentially never applies here — say so plainly and stop the IEC review rather than working through the rest of this checklist on AI-generated content.

If the content is genuinely **not** AI-generated (e.g., a real photograph the user is asking you to review separately), continue:

- **Contributor eligibility** — IEC requires 100+ downloads in the contributor's account history. This skill has no way to verify that; flag it as something only the user can confirm, and note that the "This is Illustrative Editorial content" checkbox only appears in their portal if they qualify.
- **Content restrictions** — flag as BLOCKED if the image contains: recognizable people; a restricted event (convention, sports game); a tight crop of copyrighted/trademarked material (stamps, fine art, privacy-sensitive content); a digitally created/manipulated trademarked logo (social media icons are the one exception); or a collage.
- **Asset type** — photos, illustrations, or vector only. No video for IEC.
- **Technical quality** — properly exposed, meets standard file-format/size specs, and any post-processing/cropping must not change the content's context or meaning.
- **Title** — must accurately describe the content **and include date and location** (e.g., "General view of the Funko headquarters sign under dark clouds on February 2, 2019 in Everett, Washington"). Flag a title missing either date or location as FIX NEEDED.
- **Keywords** — must have **5 to 50** keywords (not the general Adobe Stock keyword guidance). The first 10 carry the most search weight, so brand names and the most important terms should lead; include the capture location if relevant.
- **Portal step reminder** — the "This is Illustrative Editorial content" checkbox must be checked on every single submission, not just once per account.

### 3. Report results

Present a per-asset summary, ordered PASS → FIX NEEDED → BLOCKED so blocking issues are impossible to miss. For each FIX NEEDED item, propose the specific corrected text (reworded title, trimmed/expanded keyword list, corrected category). For each BLOCKED item, explain why it can't be auto-fixed and what the user needs to decide or obtain.

### 4. Apply fixes (only with confirmation)

If the user agrees with proposed fixes, edit the CSV directly to reflect them. Don't silently rewrite the CSV without showing the proposed changes first — metadata edits are the user's call, especially anything touching keywords they may have specific SEO intent behind.

### 5. Final readiness statement

End with an explicit **ready to submit** / **not ready — N blocking issues** verdict per asset, plus a one-line reminder of the two portal checkboxes from section B, since those happen in Adobe's UI at upload time and this skill can never verify them directly.

## Tips

- **Every asset from this project's art skills needs "Created using generative AI tools" checked.** There's no scenario in this codebase where that's optional — don't let a review pass silently skip mentioning it.
- **Don't try to fully resolve artist-name ambiguity yourself.** If a keyword or title contains a name that could plausibly be a working artist, flag it for the user rather than guessing whether that specific artist's work is still in copyright.
- **Illustrations, not Photos, is the default asset type for this project** — everything produced by the house style skills (Pen-Coastal, Graf1-3, Pastoral-Frame, Abstract-Expressionist, atmospheric-cityscape, etc.) is stylized/illustrative, never camera-realistic.
- **IEC essentially never applies to this project's output.** Every art skill here produces generative AI content, and GenAI is categorically barred from the Illustrative Editorial Collection — don't spend time running the full IEC checklist on it, just state the disqualification and move on.
- **Check the technical specs (category H) even though they seem mechanical** — a resolution or file-size miss is an instant, avoidable rejection that's easy to catch locally before upload.
- **The 70-character title limit is easy to blow past without noticing** — a natural-sounding descriptive title can hit 90-100 characters before it feels long. Always count it, don't eyeball it.
- **Keyword order isn't cosmetic** — Adobe's own guidance calls it the single most important lever for discoverability. Don't just check that the right words exist; check that the most important ones lead.
- **When a category choice is genuinely ambiguous (e.g., Landscape vs. Travel), say so rather than silently picking one** — it's a judgment call Adobe leaves to the contributor, and the "right" answer depends on how the piece is meant to be marketed, which is the user's call.
- **A clean CSV still isn't a guarantee of acceptance** — this skill catches policy-text violations and metadata quality issues, not Adobe's subjective creative/quality bar. Say so plainly rather than promising approval.
- **The batch-CSV export pattern in this project is a real spam risk, not a hypothetical one.** Because `export_for_stock.py` appends every piece generated that day to one shared CSV, a session of "try a few variations" test generations can accumulate into an accidental near-duplicate batch. Always look at the full day's CSV as a set, not just row-by-row, and proactively recommend trimming to the strongest piece(s) per concept before the user submits.
