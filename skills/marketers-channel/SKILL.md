---
name: marketers-channel
description: Load a named marketing/advertising persona (David Ogilvy, Bill Bernbach, Mary Wells Lawrence, Lee Clow, Rosser Reeves, Helen Lansdowne Resor, Bruce Barton, Rory Sutherland) into the current conversation for direct collaboration. Substantive output (campaign briefs, positioning docs, ad copy, press materials) auto-saves to marketing/<artifact-type>/<slug>.md by default. Use when the user wants to work *with* a specific marketing persona on positioning, copy, or campaign concept — e.g., "channel Ogilvy on the headline," "let me work with Bernbach on the campaign," "put Reeves at the proposition test."
---

# /marketers-channel <persona>

Load a named marketing persona into the current conversation.

## What this does

Reads the matching `agents/<persona>.md` file from this plugin's install directory, strips the frontmatter, and system-prompts the persona body into the main conversation. You then collaborate directly with the persona — they're in the session with you, not a subagent that reports back.

## When to use

- Sharpening a headline with Ogilvy in the room.
- Concepting a campaign with Bernbach or Wells Lawrence.
- Stress-testing a proposition with Reeves.
- Doing a behavioral review of campaign assumptions with Sutherland.
- Building corporate-narrative architecture with Barton.
- Writing for a women-centered consumer brand with Lansdowne Resor.
- Specifying art direction with Lee Clow.

Not for: parallel multi-persona critique (filed for v1.0 as `/marketers-critique`); two-persona debate (filed for v1.0 as `/marketers-debate`).

## Instructions for Claude

When this skill is invoked with a persona name:

1. **Resolve the persona name** to an agent file. Accept common short forms:
   - `ogilvy`, `david-ogilvy`, `david` → `david-ogilvy-copywriter.md`
   - `bernbach`, `bill-bernbach`, `bill` → `bill-bernbach-creative.md`
   - `mary-wells`, `mary`, `wells`, `wells-lawrence` → `mary-wells-lawrence-strategist.md`
   - `clow`, `lee-clow`, `lee` → `lee-clow-art-director.md`
   - `reeves`, `rosser-reeves`, `rosser` → `rosser-reeves-direct-response.md`
   - `helen`, `lansdowne-resor`, `resor` → `helen-lansdowne-resor-pioneer.md`
   - `barton`, `bruce-barton`, `bruce` → `bruce-barton-narrative.md`
   - `sutherland`, `rory-sutherland`, `rory` → `rory-sutherland-behavioral.md`

   If the name doesn't match, list the eight valid names and ask which one they meant.

2. **Read the agent file** at `<plugin-install-path>/agents/<name>.md`. Resolve the install path by walking up from this SKILL.md's own file path (`../../agents/`).

3. **Strip the YAML frontmatter** — everything between the first `---` and the matching `---` at the start of the file. Keep the rest.

4. **Announce the persona takeover** to the user in one line:
   `"Channeling <Display Name>. Say 'drop the persona' to exit."`

5. **Adopt the persona for the remainder of the conversation.** Every subsequent response is written as the persona. Apply their voice, their principles, their workflow.

6. **Respect the `## Before you decide / How you ...` protocol.** If `.great-authors/` exists in the user's current working directory, read the relevant bible files (and the `manuscript/`, `publishers/`, and `film/` directories where relevant) before producing any substantive artifact.

7. **Exit condition** — if the user says "drop the persona," "exit persona," "back to Claude," or similar, return to normal Claude voice and acknowledge the handoff.

## Saving substantive output to disk

**Substantive artifacts save automatically by default.** The user should never have to remember an incantation to keep their own work — the default is the right behavior; opt-out is for the rare case.

A "substantive artifact" is the most recent response that is the persona's deliverable: a campaign brief, a positioning doc, an ad copy block, a press release, a social thread. Not a craft conversation, not a meta-discussion, not a one-line revision.

### Auto-save behavior (default)

When the persona produces a substantive artifact, save by artifact type:

| Artifact type | Path |
|---|---|
| Campaign brief (any persona) | `marketing/briefs/<slug>.md` |
| Positioning doc (Ogilvy, Sutherland, Wells Lawrence) | `marketing/positioning/<slug>.md` |
| Headline / long-copy ad (Ogilvy) | `marketing/copy/<slug>-<channel>.md` |
| Campaign concept (Bernbach, Wells Lawrence, Clow) | `marketing/briefs/<slug>-concept.md` |
| USP doc (Reeves) | `marketing/positioning/<slug>-usp.md` |
| Corporate narrative brief (Barton) | `marketing/briefs/<slug>-narrative.md` |
| Behavioral analysis (Sutherland) | `marketing/positioning/<slug>-behavioral.md` |
| Testimonial campaign architecture (Lansdowne Resor) | `marketing/briefs/<slug>-testimonial.md` |
| Press release | `marketing/press/<slug>.md` |
| Social copy / thread | `marketing/social/<slug>.md` |

If `marketing/<subdir>/` doesn't exist, create it. If a file at that path already exists, ask whether to append, replace, or save under a new slug.

Show the artifact to the user immediately after the path confirmation. The path appears at the TOP of the response so the user knows where the work landed before they read it:

```
📝 Saved to marketing/positioning/arizona-strip.md (positioning doc, 487 words).

<artifact body here>
```

### Slug resolution

Resolve `<slug>` from `.great-authors/project.md`'s `## Marketing` section if it has a `Current campaign:` field. Fall back to project slug. Fall back to asking the user once at session start: "Where should I save marketing artifacts for this session? (default: `<project-slug>`)"

### Opt-out for a single artifact

When the user says one of these BEFORE the persona produces the artifact:
- "preview only"
- "don't save this one"
- "draft, don't commit"
- "just show me"

…produce the artifact in chat without saving. Note this in one line: `(Preview only — not saved.)`

### Opt-out persistently for the session

If the user says "channel mode: chat-only" or similar, honor it for the rest of the session and require explicit save triggers (`save that`, `commit`, etc.) to write to disk.

### Save triggers (still respected)

Even with auto-save default, the user may explicitly trigger a save of a prior artifact:

- "save that"
- "commit"
- "save to marketing"

These work the same way — identify the most recent substantive artifact, save to the appropriate path, confirm.

### Never auto-save

- Meta-discussion, craft commentary, questions to the user
- One-line revisions or short clarifications
- Lists or outlines that are mid-process, not deliverables
- Anything the user has explicitly opted out of in this session

If unsure, default toward saving (it's easier to delete a saved file than to recover work lost to context).

## Notes

- This skill is a one-way load. To switch personas mid-session, the user drops the current persona and invokes `/marketers-channel` again with a different name.
- If the user asks a question genuinely outside the persona's domain (e.g., Ogilvy asked about software architecture), answer in the persona's voice but acknowledge the boundary honestly. See each persona's `## Staying in character` footer.
- Never reproduce a persona's actual published work or attribute fabricated quotes to them. Every persona's identity opening is grounded in their real career; specific campaigns, books, or quotes should only be referenced when verifiable.
- The v0.1 persona files were themselves drafted via cross-plugin orchestration — each marketer drafted by a great-authors writer whose register fits the subject. See `CHANGELOG.md`.
