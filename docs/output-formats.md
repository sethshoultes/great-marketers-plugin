# Output formats

Channel-aware specs for the artifacts `great-marketers` produces. Every artifact a skill writes follows one of these contracts so downstream tooling (cross-promote skill, A/B test runner, future orchestrate-launch skill) can rely on the structure.

## Positioning doc

**Owner:** `david-ogilvy-copywriter` (default), or per-persona alternatives
**Path:** `marketing/positioning/<slug>.md`

```markdown
---
title: <Title>
slug: <slug>
persona: <persona-slug>
created: YYYY-MM-DD
---

# Positioning: <Title>

## Audience (one specific person)
<Not a demographic; a person. Named in real terms.>

## Angle (why this lands now)
<The bridge from the work to the cultural moment.>

## Proposition (the one claim)
<One sentence. The single thing the campaign promises that the work delivers and the competition cannot.>

## Evidence (proof points)
<3-5 specific facts from the work. Quoted phrases, named characters, specific scenes.>

## Register (the campaign's voice)
<2-3 sentences naming the voice; aligns with .great-authors/voice.md.>

## What the positioning is NOT
<3-5 bullets naming refusals.>
```

## Email copy

**Owner:** `david-ogilvy-copywriter` (default) — long-copy direct response register
**Path:** `marketing/copy/<slug>-email.md`

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
- <6-9 words; promise the proposition>

## Preview text
<25-40 chars; extends the subject promise>

## Email body
<350-700 words. Single CTA in the closing paragraph.>

## Call to action
<Phrased as the reader's verb.>
```

## Social copy

**Owner:** `bill-bernbach-creative` (default) — short, witty, image-paired
**Path:** `marketing/copy/<slug>-social.md`

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
- <Under 280 chars; image-paired>

## LinkedIn (1 variant)
<600-1,200 chars; first-person founder or third-person editorial>

## Substack notes / micro-blog (3 variants)
- <Short standalone; quotable>
```

## Press release

**Owner:** `bruce-barton-narrative` (default) — institutional register
**Path:** `marketing/copy/<slug>-press.md` or `marketing/press/<slug>.md`

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

## Lede (1 paragraph — five Ws)

## Body (3-5 paragraphs — quotes, evidence, context)

## Boilerplate
<2-3 sentences — reusable across press materials>

## Press contact
<Name, email, phone>

###
```

## Web / landing-page copy

**Owner:** `david-ogilvy-copywriter` (default) — H1 carries 80% of the work
**Path:** `marketing/copy/<slug>-web.md`

```markdown
---
title: <Project>
slug: <slug>-web
channel: web
persona: <persona-slug>
created: YYYY-MM-DD
---

# Web Copy: <Project>

## H1
<Single declarative; often the proposition lightly transformed>

## Subhead
<One sentence under the H1>

## Lede paragraph
<150-250 words>

## Body sections (3-5)
<Each H2 = one proof point; each body delivers the proof in 100-200 words>

## CTA section
<Single CTA; button text is the visitor's verb>
```

## Campaign brief

**Owner:** any persona — produces a high-level campaign concept
**Path:** `marketing/briefs/<slug>.md`

```markdown
---
title: <Title>
slug: <slug>
persona: <persona-slug>
created: YYYY-MM-DD
---

# Campaign Brief: <Title>

## The one idea
<The single concept that organizes every channel's expression. If the brief has more than one idea, it has none.>

## Why it works
<1-2 paragraphs naming the cultural-moment fit, the audience hook, the differentiation against comparable campaigns running now.>

## Channel implications
<For each major channel: the one move that channel makes in service of the idea.>

## Risks
<What could undercut the campaign. The competing position. The promise that might be misread.>
```

## USP doc (Reeves variant)

**Owner:** `rosser-reeves-direct-response`
**Path:** `marketing/positioning/<slug>-usp.md`

```markdown
---
title: <Project>
slug: <slug>-usp
persona: rosser-reeves-direct-response
created: YYYY-MM-DD
---

# USP: <Project>

## The proposition (one sentence)
<Specific. Unique. Strong enough to move masses.>

## The competition's claims
- <Brand A: their claim>
- <Brand B: their claim>

## Why this proposition is unique
<The competition cannot claim it, or has not.>

## The hammer
<How the proposition will be repeated across the campaign. Variations that preserve the core claim.>

## The test
<Would the audience remember this proposition tomorrow if you stopped them on the street?>
```

## Behavioral analysis (Sutherland variant)

**Owner:** `rory-sutherland-behavioral`
**Path:** `marketing/positioning/<slug>-behavioral.md`

```markdown
---
title: <Project>
slug: <slug>-behavioral
persona: rory-sutherland-behavioral
created: YYYY-MM-DD
---

# Behavioral Angle: <Project>

## What the consumer thinks they want
<The stated preference. The thing they would tell a focus group.>

## What the behavior data shows
<What they actually do. Where the gap is.>

## The cognitive bias at work
<Loss aversion / signaling / default-and-friction / trust-heuristic / etc. Named specifically.>

## The unintuitive move
<The reframe that addresses the actual behavior rather than the stated preference. Why the obvious solution will fail.>

## How to test
<The smallest experiment that would falsify the behavioral hypothesis.>
```

## Cross-plugin congruence checks

When multiple plugins have produced positioning artifacts for the same project, the marketers positioning doc should be **congruent**, not contradictory, with:

- `publishers/positioning/<slug>.md` — Tina Brown's publication-form positioning. Marketing extends this; if it contradicts, fix the marketing positioning or escalate to revisit the publication-form positioning upstream.
- `publishers/jacket-copy/<slug>.md` — Tina Brown's jacket copy. Marketing email/web copy must read as the same brand voice.
- `publishers/covers/<slug>.md` — Chip Kidd / Diana Vreeland / George Lois cover concept. Marketing visual register (when the campaign produces visual cues) must be congruent with the cover.
- `film/screenplay/<slug>.veo3.md` or `<slug>.kling.md` — the trailer's visual logic. Social cuts of the trailer are marketing's responsibility but must respect the trailer's authored emotional architecture.

When a contradiction is detected, the skill flags it for the orchestrator. The orchestrator decides whether to fix the marketing artifact or revisit the upstream publishers/filmmakers artifact.
