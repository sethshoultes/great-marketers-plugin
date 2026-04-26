# Great Marketers — User Manual

Complete reference for the `great-marketers` Claude Code plugin. For the executive summary, see [README.md](./README.md). For orchestration patterns, see [ORCHESTRATING.md](./ORCHESTRATING.md).

## 1. Install

```
/plugin marketplace add sethshoultes/great-marketers-plugin
/plugin install great-marketers@sethshoultes
```

For Claude Desktop, build the DXT bundle:
```bash
cd distribution/dxt && npm install && npx @anthropic-ai/dxt pack
```

## 2. The eight personas

Personas are dispatched as sub-agents in clean contexts. Each persona file at `agents/<slug>.md` carries its own identity, voice, principles, before-decision protocol (read the bible), and what it never does.

### Direct response and proposition register

| Persona | Real-world identity | Dispatch when |
|---|---|---|
| `david-ogilvy-copywriter` | Founder of Ogilvy & Mather | Headlines, long-copy direct response, brand propositions, the question of which fact about the product the headline carries |
| `rosser-reeves-direct-response` | Chairman of Ted Bates | Finding the Unique Selling Proposition; the claim test; advertising as salesmanship |

### Creative concept register

| Persona | Real-world identity | Dispatch when |
|---|---|---|
| `bill-bernbach-creative` | Co-founder of DDB ("Think Small," "We Try Harder") | The big idea; pairing copy and art direction; the moral position that the consumer is intelligent |
| `mary-wells-lawrence-strategist` | Founder of Wells Rich Greene (Braniff, "I ♥ NY") | Brand-as-personality; the big bet that commits the brand totally |
| `lee-clow-art-director` | TBWA\Chiat\Day ("1984," "Think Different") | Art direction as creative lead; the campaign as cultural object; "is the idea big enough?" |

### Specialist register

| Persona | Real-world identity | Dispatch when |
|---|---|---|
| `helen-lansdowne-resor-pioneer` | First major woman copywriter at JWT | Copy that addresses women as adults; emotional appeal; testimonial architecture; sensory truth |
| `bruce-barton-narrative` | Co-founder of BBDO; *The Man Nobody Knows* | Corporate narrative; the parable as the unit of durable advertising; brand identity at the institutional scale |
| `rory-sutherland-behavioral` | Vice-Chairman, Ogilvy UK | Behavioral economics applied to marketing; the unintuitive truth; when the logical answer keeps failing |

## 3. The four MVP skills

### `/marketers-channel <persona>`

Loads a marketing persona into the current conversation for direct collaboration. Substantive output (briefs, positioning docs, ad copy) auto-saves.

```
/marketers-channel ogilvy
/marketers-channel sutherland
```

Output paths by artifact type:

| Artifact type | Path |
|---|---|
| Campaign brief | `marketing/briefs/<slug>.md` |
| Positioning doc | `marketing/positioning/<slug>.md` |
| Ad copy | `marketing/copy/<slug>-<channel>.md` |
| Press kit / release | `marketing/press/<slug>.md` |
| Social copy | `marketing/social/<slug>.md` |

Save triggers (explicit) and opt-out flags work the same as `/authors-channel`. See `skills/marketers-channel/SKILL.md`.

### `/marketers-project-init`

Scaffolds a `marketing/` directory at the project root. Reads `.great-authors/project.md` to import title and genre. Asks for the current campaign slug.

Created tree:

```
marketing/
├── briefs/
├── positioning/
├── copy/
├── press/
└── social/
```

Updates `.great-authors/project.md` with a `## Marketing` section.

### `/marketers-write-positioning <project>`

Sharpens positioning into ad-ready language. Default persona: `david-ogilvy-copywriter`. Override with `--persona <name>`.

```
/marketers-write-positioning arizona-strip
/marketers-write-positioning arizona-strip --persona sutherland
```

Inputs:
- `.great-authors/project.md` for premise, audience
- `.great-authors/voice.md` for voice rules
- `manuscript/` for the actual work
- `publishers/positioning/<slug>.md` if it exists (publication-form positioning is upstream of marketing positioning)

Output: `marketing/positioning/<slug>.md`. Format: audience as a person; angle (why this lands now); proposition (the one claim); evidence (the proof points the campaign will lean on); register (what voice the campaign speaks in).

### `/marketers-write-launch-copy <project> [--channel <c>]`

Channel-specific copy. Default produces email, social, press, and web. With `--channel`, produces only the named channel.

```
/marketers-write-launch-copy arizona-strip               # all four channels
/marketers-write-launch-copy arizona-strip --channel email
/marketers-write-launch-copy arizona-strip --channel social --persona bernbach
```

Inputs:
- `marketing/positioning/<slug>.md` (must exist)
- `.great-authors/voice.md`
- The artifact being launched (manuscript, film/render trailer, etc.)

Output: `marketing/copy/<slug>-<channel>.md` per channel. Each channel uses its own format conventions (subject lines and previews for email; thread structure for social; lede + dateline + boilerplate for press; H1 + subhead + body for web).

## 4. Project structure

```
.great-authors/                 # the bible — shared across the constellation
├── project.md                  # title, genre, premise, voice rules
├── voice.md                    # voice rules in detail
└── ...

manuscript/                     # great-authors writes here
film/                           # great-filmmakers writes here
publishers/                     # great-publishers writes here
marketing/                      # great-marketers writes here (this plugin)
├── briefs/                     #   campaign briefs
├── positioning/                #   audience, angle, proposition, evidence
├── copy/                       #   channel-specific ad copy
├── press/                      #   press releases, talking points
└── social/                     #   social posts, thread copy
```

## 5. Conventions

These are encoded across the constellation. Marketers inherits all of them.

1. **Orchestrator vs. specialist.** Personas are dispatched. The orchestrator never produces copy in-context.
2. **Default-save behavior.** Every generative skill saves to disk before showing in chat.
3. **Project-bible reading.** Every persona reads `.great-authors/` before deciding.
4. **Voice-lint discipline.** Generated copy respects `voice.md` and `voice-lints.md`.
5. **Honest claim discipline.** No promises the work cannot keep. Promises the work overdelivers on are how reputations get made; promises it cannot keep are how trust gets lost.
6. **Channel awareness.** Email and social and press and web are different forms. The skill produces format-appropriate output per channel.
7. **No prose drafting.** When the deliverable needs to *quote* the manuscript, the quote belongs to great-authors. Don't paraphrase from the manuscript inside marketing copy without quotation.

## 6. Cross-plugin orchestration

The marketers plugin sits on top of the constellation:

| Plugin | Role |
|---|---|
| `great-minds` | Strategic decisions, brand voice at the company level (Sara Blakely for go-to-market scrap; Rick Rubin for stripping a concept) |
| `great-authors` | Prose, manuscript editing (Gottlieb is the orchestrator at the writing stage) |
| `great-filmmakers` | Storyboards, shot lists, render manifests (the trailer's cinematic logic) |
| `great-publishers` | Publication form (book covers, jacket copy, magazine register, threshold reads) |
| `great-marketers` | Marketing — positioning, ad copy, demand generation, sales narrative (this plugin) |

Dispatch syntax for cross-plugin work: `Agent({subagent_type: "<plugin>:<persona>-persona", ...})`.

The v0.1 personas of this plugin were drafted via cross-plugin orchestration — each marketer drafted by a great-authors writer whose register fits the subject. The constellation pattern is the build pattern.

## 7. What's deferred to v1.0

- `/marketers-write-press-kit` — press release + key messages + boilerplate, packaged as a single artifact
- `/marketers-write-email-sequence` — multi-touch email campaign (welcome, nurture, conversion)
- `/marketers-write-social-thread` — long-thread copy for Twitter/X, LinkedIn, Substack notes
- `/marketers-ab-test-copy` — produce paired variants for testing
- `/marketers-orchestrate-launch` — end-to-end launch pipeline (mirror `/authors-orchestrate-novel`)
- `/marketers-debate`, `/marketers-critique`, `/marketers-edit` — composite editorial commands

## 8. Smoke tests

Run before tagging a release:

```bash
bash tests/smoke.sh
```

Validates: SKILL.md frontmatter, persona frontmatter, persona-count alignment between `agents/` and `distribution/dxt/server/personas/`, version coherence across `package.json` / `plugin.json` / DXT manifest, DXT tool definitions matched by handlers.

## 9. The constellation context

| Plugin | Domain | Status |
|---|---|---|
| [great-minds](https://github.com/sethshoultes/great-minds-plugin) | Strategy | Live |
| [great-authors](https://github.com/sethshoultes/great-authors-plugin) | Prose | Live |
| [great-filmmakers](https://github.com/sethshoultes/great-filmmakers-plugin) | Film | Live |
| [great-publishers](https://github.com/sethshoultes/great-publishers-plugin) | Publication form | v0.1 |
| **great-marketers** (this) | Marketing | v0.1 |
| great-engineers | Software craft | Future |
| great-designers | Product, UX | Future |
| great-operators | Finance, ops | Future |

Roadmap: `brain/projects/caseproof-ai-company-constellation.md`. Each plugin owns one craft. Cross-plugin dispatch composes them.
