---
name: marketers-write-positioning
description: Sharpen positioning into ad-ready language. Reads the project bible, manuscript, and any existing publishers/positioning, then produces a single positioning doc covering audience (as a person), angle (why this lands now), proposition (the one claim), evidence (proof points), and register (voice the campaign speaks in). Default persona David Ogilvy; override with --persona. Output saves to marketing/positioning/<slug>.md. Use when the campaign needs a sharp, single-document positioning before any copy gets written.
---

# /marketers-write-positioning <project>

Produce an ad-ready positioning doc for a project.

## What this does

This skill is the single most upstream artifact in the marketing pipeline. Before any copy is written, the positioning doc establishes who the audience actually is, why this lands now, what the one claim is, what proof points the campaign will lean on, and what register the campaign speaks in.

The doc serves three downstream consumers:

1. `/marketers-write-launch-copy` reads it for every channel-specific copy generation
2. `/publishers-channel tina-brown` may consult it (publishers/positioning is upstream of marketing/positioning, but the two should be congruent)
3. The orchestrator reads it before any cross-plugin work on demand-side artifacts

## When to use

- A project is finished or near-finished and needs ad-ready positioning before launch.
- Publishers has produced a positioning doc (publication-form positioning) and you need to extend it to demand-generation positioning.
- The campaign has been getting copy without sharp positioning and the copy keeps coming out generic.

Not for: reframing the manuscript itself (that's `great-authors`); positioning for a single channel (just produce the copy directly via `/marketers-write-launch-copy`).

## Instructions for Claude

When this skill is invoked with a `<project>` argument (or no argument, meaning the current directory):

1. **Resolve the project root.** If `<project>` is provided, treat it as a directory path or a slug under the user's projects directory. If no argument, use the current working directory.

2. **Verify the project structure:**
   - `.great-authors/project.md` must exist
   - At least one of: `manuscript/`, `film/`, or a clear product description in `project.md`
   - If neither bible nor any artifact exists, report and stop.

3. **Read the bible:**
   - `.great-authors/project.md` — title, genre, premise, audience hints
   - `.great-authors/voice.md` — voice rules (informs the register section of the positioning doc)
   - `.great-authors/voice-lints.md` — voice rules in detail

4. **Read the artifacts the project has produced:**
   - `manuscript/` — at least the first chapter and the table of contents (for a book)
   - `film/screenplay/` — the production doc if it exists (for a film/trailer)
   - `publishers/positioning/<slug>.md` if it exists — Tina Brown or another publishers persona may have established publication-form positioning that informs (but does not replace) marketing positioning
   - `publishers/jacket-copy/<slug>.md` if it exists — the jacket copy is a constrained version of marketing copy; check congruence

5. **Resolve the persona to dispatch.**
   - Default: `david-ogilvy-copywriter` (research-driven, proposition-clear)
   - User may override with `--persona <name>`
   - For behavioral-econ-led positioning, `rory-sutherland-behavioral` is the right call
   - For brand-personality-led positioning, `mary-wells-lawrence-strategist`
   - For institutional/corporate positioning, `bruce-barton-narrative`

6. **Dispatch the persona** via the Agent tool with `subagent_type: "great-marketers:<persona-slug>-persona"` (or load directly via `/marketers-channel` if running interactively).

   The brief to the persona must include:
   - All bible files read above (paths only — the persona reads them)
   - The artifact summary (genre, length, distinguishing facts)
   - The publication-form positioning if it exists (so marketing positioning extends rather than contradicts)
   - The output target: `marketing/positioning/<slug>.md`
   - The required structure (below)
   - Length target: 600-1,000 words

7. **The output structure** (the persona produces this format):

```markdown
---
title: <Project title>
slug: <slug>
persona: <persona-slug>
created: YYYY-MM-DD
---

# Positioning: <Title>

## Audience (one specific person)

<Not a demographic — a person. Named in real terms. What they read, what they care about, where they encounter culture, why they pick this up.>

## Angle (why this lands now)

<The bridge from the work to the cultural moment. The angle is the marketer's contribution; the work itself is genre-stable, the angle is timely.>

## Proposition (the one claim)

<One sentence. The single thing the campaign promises that the work delivers and the competition cannot. This is the test from Reeves: would the audience remember this proposition tomorrow if you stopped them?>

## Evidence (proof points)

<3-5 specific facts from the work that support the proposition. Quoted phrases, named characters, specific scenes — not abstract category claims.>

## Register (the campaign's voice)

<2-3 sentences naming the voice the campaign speaks in. Should align with .great-authors/voice.md but may emphasize a subset for the launch — e.g., the manuscript's voice is elegiac and observational, but the launch register is observational + slightly more urgent (because launch).>

## What the positioning is NOT

<3-5 bullets naming what the campaign refuses to claim. Genre clichés to avoid. Promises the work cannot keep. Adjacent positions other campaigns might take that this one explicitly rejects.>
```

8. **Save the doc** to `marketing/positioning/<slug>.md`. If the file exists, ask the user whether to overwrite, save as `<slug>-v2.md`, or skip.

9. **Report:**
   ```
   📝 Saved to marketing/positioning/<slug>.md (<word-count> words, drafted by <persona>).

   Audience:    <one-line summary>
   Proposition: <one-line summary>

   Next:
   - /marketers-write-launch-copy <project> [--channel <c>] uses this positioning to produce channel-specific copy
   - /marketers-channel <other-persona> to refine specific sections (e.g., Reeves to test the proposition; Sutherland for behavioral review)
   ```

## What the skill does NOT do

- Does not write any channel copy. That's `/marketers-write-launch-copy`. The positioning doc precedes copy.
- Does not deploy or distribute. The positioning doc lands as a file; the user reviews; copy generation follows.
- Does not generate the manuscript or any prose. If the positioning surfaces a need to revise the manuscript, the orchestrator dispatches back to `great-authors`.
- Does not invent facts about the work. Every claim in the positioning doc must trace to the manuscript, the bible, or the publishers' positioning. No hallucinated proof points.

## Notes

- The positioning doc is **the contract** that all downstream copy work obeys. If launch copy contradicts the positioning, fix the positioning first; then regenerate the copy. Don't let the copy silently overwrite positioning logic.
- A project may have multiple positioning docs over time (launch, paperback release, anniversary edition). Each gets its own `<slug>` — set via the `## Marketing` section's `Current campaign` field.
- The positioning doc is the right place to surface tensions between publishers/positioning (publication form: "this is a literary thriller for readers of X") and marketing positioning (demand: "this lands now because of Y"). When they conflict, the file flags the conflict for the orchestrator to resolve — usually by going back to publishers and adjusting upstream.
