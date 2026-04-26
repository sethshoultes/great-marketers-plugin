# Orchestrating great-marketers

Notes for AI agents (or humans) running a marketing project that uses this plugin's skills as sub-agents.

## The core distinction

The marketing personas in this plugin are *specialists at the demand-generation threshold.* They bring craft for positioning, copy, persuasion, and the question of whether the work will reach the audience it was made for.

The orchestrator (you, when you are running a project) is *not a specialist.* The orchestrator coordinates: reads the manuscript, the publication-form artifacts, the bible, briefs the right marketing persona for the question at hand, integrates the output, ships.

**The single most consequential mistake an orchestrator can make is to write the campaign brief / positioning doc / ad copy themselves.** When the orchestrator writes copy, it comes out generic — Ogilvy doesn't think the same way Bernbach does, Reeves doesn't think the same way Sutherland does. The fix is always to dispatch the right persona.

If you find yourself reaching for the Write tool to put a positioning doc in `marketing/positioning/`, stop. Have you dispatched the right persona for this? If not, that's the next move.

## Who handles what

| Question | Persona to dispatch |
|---|---|
| What does the headline say? Long-copy direct response. | `david-ogilvy-copywriter` |
| What's the proposition? What single claim does the product make that the competition cannot? | `rosser-reeves-direct-response` |
| The campaign needs a creative idea — concept, not copy. | `bill-bernbach-creative` |
| The brand has no personality. We need a big bet that makes the brand recognizable. | `mary-wells-lawrence-strategist` |
| The visual is the campaign. Art direction leads. | `lee-clow-art-director` |
| The product is for women and the copy keeps coming out generic or condescending. | `helen-lansdowne-resor-pioneer` |
| The corporation needs a story bigger than its products — durable across decades. | `bruce-barton-narrative` |
| The "logical" answer keeps failing. The behavior we want isn't logical. | `rory-sutherland-behavioral` |

When two personas would honestly answer differently, that's a debate (filed for v1.0 as `/marketers-debate`).

## A typical orchestration flow

For a novel that's about to launch:

```
1. Read .great-authors/project.md — title, genre, premise, voice, audience
2. Read manuscript/ — first chapter, table of contents, closing chapter
3. Read publishers/positioning/<slug>.md if Tina Brown produced one
4. Read publishers/covers/<slug>.md if Chip Kidd or others produced cover concepts
5. /marketers-project-init   (if marketing/ doesn't exist)
6. /marketers-channel ogilvy → positioning + headline candidates → marketing/positioning/<slug>.md
7. /marketers-channel mary-wells → big-bet campaign concept → marketing/briefs/<slug>.md
8. /marketers-write-launch-copy <slug> --channel email → marketing/copy/<slug>-email.md
9. /marketers-write-launch-copy <slug> --channel social → marketing/copy/<slug>-social.md
10. /marketers-channel sutherland → behavioral review of the copy before publishing → critique
11. Commit incrementally
```

For a SaaS product launch (different shape, same pattern):

```
1. Read product docs and bible
2. /marketers-channel sutherland → "what's the unintuitive truth here?" → behavioral angle
3. /marketers-channel reeves → "what's the USP?" → claim
4. /marketers-channel ogilvy → headlines + long-form landing copy
5. /marketers-write-launch-copy <slug> --channel web → conversion copy
6. /marketers-channel bernbach → review copy for the integrity test ("is the truth in the product?")
```

## Brief-writing as leverage

The single best investment you can make as an orchestrator is writing better briefs.

**A thin brief:**
> "Write some launch copy for this book."

**A self-contained brief:**
> "Write launch copy for [title], a [genre] novel of [length], releasing [date]. Read these files in order: `.great-authors/project.md`, `.great-authors/voice.md`, the first three chapters of the manuscript, the cover concept brief at `publishers/covers/<slug>.md`, the positioning doc at `publishers/positioning/<slug>.md`. The audience is [specific person — from positioning doc]. Channel: [email / social / press / web]. Length: [appropriate for channel]. Tone: [from voice.md, with one or two adjustments specific to this campaign]. The copy must promise what the book delivers and only what it delivers. What to avoid: [list — no genre clichés, no ellipses where suspense should be, no body imagery if the book is restrained about violence]. Save to `marketing/copy/<slug>-<channel>.md`. Report under 200 words on what you chose to lead with and why."

The thin brief produces generic copy. The self-contained brief produces copy that can be argued and refined.

## When to write copy yourself

Two narrow cases:

1. **Mechanical edits.** Surgical fixes — a typo in a tweet, a corrected URL, an updated date.
2. **The user explicitly asks you to.** *"Just write me one tweet here."* Honor that.

In all other cases: dispatch.

## Architecture as spine

`.great-authors/` is the spine. Every marketing dispatch should include the relevant bible files as part of the brief. When ad copy drifts from the bible's voice — e.g., when the copy says "thrilling page-turner" but `voice.md` says "elegiac" — the copy is wrong, not the bible.

Update the bible deliberately, with the user, when the project's positioning genuinely changes. Don't let ad copy silently overwrite the bible.

## Cross-plugin orchestration

The marketers plugin sits on top of the entire constellation. You will routinely dispatch personas across plugin boundaries:

- `great-authors:gottlieb-persona` runs the manuscript stage. Don't duplicate.
- `great-publishers:tina-brown-editor` produces the positioning at the publication-form stage. Marketing positioning is downstream — Tina says "who is this for"; marketing says "here's how we reach them at scale."
- `great-publishers:chip-kidd-designer` produces the cover concept. Marketing copy must be congruent with the cover; if it isn't, the campaign reads as two separate projects.
- `great-filmmakers:hitchcock-persona` (or whichever director) designs the trailer. Trailer captions and social cuts are marketing's responsibility; the trailer's emotional architecture is filmmaking's.
- `great-minds:rick-rubin-creative` may strip a launch concept down to its essence before any marketing persona positions it.
- `great-minds:sara-blakely-growth` thinks about scrappy go-to-market; she's not a marketer in the craft sense (this plugin's roster is) but she's the right voice for first-100-customers strategy.

The dispatch syntax is `Agent({subagent_type: "<plugin>:<persona>-persona", ...})`. The orchestrator routes; the personas speak.

## What this plugin does NOT do

- **Manuscript editing or prose drafting** — that's `great-authors`. When marketing copy needs to *quote* the manuscript, the quote is the writer's; don't paraphrase.
- **Book cover design or jacket copy** — that's `great-publishers`. Jacket copy is publication-form (Tina Brown); ad copy is marketing. They're related but distinct.
- **Trailer cutting** — that's `great-filmmakers` and `great-publishers`. Marketing makes social cuts of an existing trailer; it doesn't author the trailer's cinematic logic.
- **Software engineering, product design, operations** — future sibling plugins.

When a question reaches into one of those territories, surface it explicitly: *"This is a manuscript-level question; let me dispatch Gottlieb in great-authors."* Don't paper over the gap.

## Anti-patterns

These all produce generic marketing artifacts:

- Writing the positioning doc / ad copy yourself instead of dispatching
- Pattern-matching a persona's voice in your own context (Ogilvy's research authority, Bernbach's moral register, Sutherland's wit) without dispatching the actual persona
- Skipping the read of the bible, manuscript, and publication-form artifacts before dispatching
- Thin briefs ("write some copy")
- Promising what the work cannot deliver — even when the channel rewards it
- Letting the channel choice (email vs. social vs. press) get made silently — surface the strategic choice
- Writing copy whose voice contradicts `voice.md` and calling it "an exception for this campaign"

The anti-pattern that catches most orchestrators is the first one. Watch for it.
