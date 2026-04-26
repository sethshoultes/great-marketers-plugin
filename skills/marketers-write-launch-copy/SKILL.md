---
name: marketers-write-launch-copy
description: Produce channel-specific launch copy from an existing positioning doc. Default produces email, social, press, and web. With --channel, produces only the named channel. Reads marketing/positioning/<slug>.md (must exist), .great-authors/voice.md, and the underlying artifact (manuscript or trailer). Dispatches the right persona for each channel — Ogilvy for email/web long copy; Bernbach or Wells Lawrence for social-headline-driven; press release uses Barton register for institutional, Tina Brown register (cross-plugin) for editorial. Output saves to marketing/copy/<slug>-<channel>.md.
---

# /marketers-write-launch-copy <project> [--channel <c>] [--persona <name>]

Produce channel-specific launch copy.

## What this does

Takes an established positioning doc and generates copy for one or more channels. Each channel has its own format conventions (subject lines + previews for email; thread structure for social; lede + dateline + boilerplate for press; H1 + subhead + body for web). The skill enforces those conventions and dispatches the right persona for each.

The positioning doc must already exist — this skill does not invent positioning. If `marketing/positioning/<slug>.md` is missing, the skill points the user at `/marketers-write-positioning` and stops.

## When to use

- Positioning is established (via `/marketers-write-positioning` or via direct `/marketers-channel` work) and the campaign needs channel copy.
- A specific channel needs new copy for an A/B test, a re-launch, or a sequence (default behavior: produce all four channels in one pass; with `--channel`, produce one).

Not for: positioning work itself (use `/marketers-write-positioning`); long-form sales pages (those are their own skill, filed for v1.0 as `/marketers-write-landing-page`).

## Instructions for Claude

When this skill is invoked:

1. **Resolve the project root** the same way `/marketers-write-positioning` does. Verify `.great-authors/`, the underlying artifact (manuscript or film), and the positioning doc all exist. If `marketing/positioning/<slug>.md` is missing, report:
   ```
   No positioning doc found at marketing/positioning/<slug>.md.
   Run /marketers-write-positioning <project> first; then re-run this skill.
   ```
   And stop.

2. **Parse arguments:**
   - `--channel <c>`: one of `email`, `social`, `press`, `web`. If omitted, produce all four.
   - `--persona <name>`: explicit persona override. If omitted, the skill auto-selects per channel (see below).

3. **Read the inputs:**
   - `marketing/positioning/<slug>.md` — the canonical positioning
   - `.great-authors/voice.md` — voice rules
   - `.great-authors/project.md` — title, genre, premise
   - The underlying artifact's most representative excerpt (for a book: the opening paragraphs; for a film: the trailer's opening shot description)
   - `publishers/jacket-copy/<slug>.md` if it exists (jacket copy is congruent with marketing copy; congruence test)

4. **Auto-select the persona per channel** unless `--persona` overrides:

   | Channel | Default persona | Reason |
   |---|---|---|
   | `email` | `david-ogilvy-copywriter` | Long-copy direct response; subject line is the headline |
   | `social` | `bill-bernbach-creative` | Short, witty, image-paired; "the consumer is intelligent" works in feed |
   | `press` | `bruce-barton-narrative` | Institutional register; the corporation telling its own story |
   | `web` | `david-ogilvy-copywriter` | Long-form landing copy; the headline does 80% of the work |

   For an unconventional product or campaign, the orchestrator may want different defaults; `--persona <name>` lets them override.

5. **For each channel selected, dispatch the persona** via the Agent tool with the brief below.

6. **The brief to each dispatched persona** must include:
   - The positioning doc (full text)
   - Voice rules from `voice.md`
   - The artifact excerpt (for the persona to ground their copy in real material, not just the positioning's abstract claims)
   - The channel format (described below)
   - The output target: `marketing/copy/<slug>-<channel>.md`
   - Length target per channel (below)

7. **Channel formats and length targets:**

### email

```markdown
---
title: <Project>
slug: <slug>-email
channel: email
persona: <persona-slug>
created: YYYY-MM-DD
---

# Email Copy: <Project>

## Subject line (3-5 candidates)
- <Candidate 1 — 6-9 words; promise the proposition>
- ...

## Preview text (under email subject in inbox)
<25-40 chars; extends the subject promise>

## Email body
<350-700 words. Subject promise paid off in opening sentence. Long copy outsells short copy when the promise warrants it. Single CTA, named in the closing paragraph. The CTA links to the work or to a landing page.>

## Call to action
<The one action you want the reader to take. Phrase it as the reader's verb, not the marketer's.>
```

### social

```markdown
---
title: <Project>
slug: <slug>-social
channel: social
persona: <persona-slug>
created: YYYY-MM-DD
---

# Social Copy: <Project>

## Twitter/X (3 variants)
- <Variant 1 — under 280 chars; image-paired; one promise per post>
- ...

## LinkedIn (1 variant)
<Long-form post, 600-1,200 chars; first-person founder voice or third-person editorial; the proposition framed for a professional audience>

## Substack notes / micro-blog (3 variants)
- <Short standalone bites; quotable; each carries one proof point from the positioning's evidence section>
```

### press

```markdown
---
title: <Project>
slug: <slug>-press
channel: press
persona: <persona-slug>
created: YYYY-MM-DD
---

# Press Release: <Project>

FOR IMMEDIATE RELEASE
<Date>

## Headline
<Single declarative line. Names the project, the proposition, and the angle in one breath.>

## Lede (1 paragraph)
<Five Ws — what is happening, who is doing it, when, where, why this is news. The angle from the positioning doc carries this paragraph.>

## Body (3-5 paragraphs)
<Background. Quotes from the author/creator. Quotes from credible third parties if available. The proof points from the positioning's evidence section, distributed across paragraphs.>

## Boilerplate
<2-3 sentences about the author / company / project context. Reusable across all press materials.>

## Press contact
<Name, email, phone. The orchestrator fills these in from the bible if present.>

###
```

### web

```markdown
---
title: <Project>
slug: <slug>-web
channel: web
persona: <persona-slug>
created: YYYY-MM-DD
---

# Web Copy: <Project>

## H1 (the page's load-bearing headline)
<Single declarative. Often the proposition, lightly transformed.>

## Subhead (one sentence under the H1)
<Extends the headline; names what the visitor will get from reading on.>

## Lede paragraph
<150-250 words. Earns the visitor's continued attention. The first sentence pays off the H1.>

## Body sections (3-5 sections, each with H2 + 100-200 word body)
<Each H2 names a single proof point from the positioning's evidence section. Body delivers the proof.>

## CTA section
<Single CTA, named clearly. The button text is the visitor's verb.>
```

8. **Save each generated file** to `marketing/copy/<slug>-<channel>.md`. If a file exists at the path, ask whether to overwrite, save as `-v2`, or skip per file.

9. **Report:**
   ```
   📝 Launch copy generated.

   Project:     <title>
   Positioning: marketing/positioning/<slug>.md (read)
   Channels:    <list of channels produced, with persona used per channel>

   Files:
   - marketing/copy/<slug>-email.md   (Ogilvy, <N> words)
   - marketing/copy/<slug>-social.md  (Bernbach, <N> chars across 7 variants)
   - marketing/copy/<slug>-press.md   (Barton, <N> words)
   - marketing/copy/<slug>-web.md     (Ogilvy, <N> words)

   Next:
   - Review each file. Sutherland (/marketers-channel sutherland) is a strong reviewer for behavioral risk before publish.
   - Cross-check congruence with publishers/jacket-copy/<slug>.md if it exists.
   ```

## What the skill does NOT do

- Does not invent positioning. The positioning doc is the contract; this skill obeys it.
- Does not write the manuscript or trailer. Quotes from the work must be exact — not paraphrased — and attributed.
- Does not deploy. The copy lands as files; the user (or another tool) publishes.
- Does not produce variants for A/B testing. That's filed for v1.0 as `/marketers-ab-test-copy`.
- Does not write press contact details. The orchestrator fills them in from the bible.

## Notes

- The skill produces **one persona per channel by default**. For a unified campaign voice, set `--persona` to a single persona for all channels — but be aware that some channels suit some personas worse than others (Reeves is excellent on web headlines and weaker on press releases; Lansdowne Resor is excellent on emotional consumer email and weaker on B2B social).
- Channel copy can drift from positioning over time. If the user iterates on copy without updating positioning, the skill warns: *"You're editing copy that hasn't been re-verified against the positioning. If positioning has changed, regenerate; if not, proceed."*
- The four-channel default is intentional. Email + social + press + web covers the standard product launch surface for a creator-economy project. Larger campaigns add channels (TV, print, OOH, podcast); v1.0 will widen the channel set.
