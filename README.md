# Great Marketers

Eight advertising/marketing personas (David Ogilvy, Bill Bernbach, Mary Wells Lawrence, Lee Clow, Rosser Reeves, Helen Lansdowne Resor, Bruce Barton, Rory Sutherland) and four operational skills for positioning, ad copy, and launch composition. A Claude Code plugin. Fifth in the Caseproof persona constellation:

- [`great-minds-plugin`](https://github.com/sethshoultes/great-minds-plugin) — strategic decision-makers
- [`great-authors-plugin`](https://github.com/sethshoultes/great-authors-plugin) — prose craft
- [`great-filmmakers-plugin`](https://github.com/sethshoultes/great-filmmakers-plugin) — film craft
- [`great-publishers-plugin`](https://github.com/sethshoultes/great-publishers-plugin) — publication form
- **`great-marketers-plugin`** (this repo) — marketing

> **New to the Caseproof persona constellation?** Start with [`/constellation-start`](https://github.com/sethshoultes/great-minds-plugin) in `great-minds` — it asks 2-3 questions about your project shape and routes to the right plugin.

## Install

**Claude Code:**
```
/plugin marketplace add sethshoultes/great-marketers-plugin
/plugin install great-marketers@sethshoultes
```

**Claude Desktop** (DXT bundle):
```bash
cd distribution/dxt && npm install && npx @anthropic-ai/dxt pack
```

## What's in v0.1

### 8 Personas — at the marketing threshold

| Persona | Strength |
|---|---|
| `david-ogilvy-copywriter` | Research-driven copy; the headline does 80% of the work; the consumer is paying attention. Founder of Ogilvy & Mather. |
| `bill-bernbach-creative` | The creative revolution; pairing copywriter and art director; consumer dignity as moral position. Co-founder of DDB. |
| `mary-wells-lawrence-strategist` | Brand-as-personality; big bets win because small bets can't be remembered. Founder of Wells Rich Greene. |
| `lee-clow-art-director` | Art direction as creative lead; the campaign as cultural object. TBWA\Chiat\Day; "1984"; "Think Different." |
| `rosser-reeves-direct-response` | The Unique Selling Proposition; hammer the claim; advertising is salesmanship. Chairman of Ted Bates. |
| `helen-lansdowne-resor-pioneer` | First major woman copywriter; emotional appeal; sensory truth; testimonial architecture. JWT, 1908-1964. |
| `bruce-barton-narrative` | Corporate narrative as durable form; the parable is the unit. BBDO co-founder; *The Man Nobody Knows*. |
| `rory-sutherland-behavioral` | Behavioral economics applied to marketing; the unintuitive truth; logic is overrated. Ogilvy UK. |

### How the personas were drafted

The v0.1 persona files were drafted via cross-plugin orchestration — each one written by a great-authors persona whose register fits the subject (Didion on Ogilvy, Baldwin on Bernbach, McCarthy on Barton, Wallace on Sutherland, etc.), then edited by `great-authors:gottlieb-persona` for the threshold pass. The constellation pattern in production. Details in [CHANGELOG.md](./CHANGELOG.md).

### 4 MVP Skills

| Skill | What it does |
|---|---|
| `/marketers-channel <persona>` | Load a marketing persona into your current conversation. Briefs, positioning docs, ad copy, and other substantive output auto-saves to `marketing/<artifact-type>/<slug>.md` by default. Mirrors `/authors-channel`. |
| `/marketers-project-init` | Scaffold a `marketing/` directory at the project root, sibling to `manuscript/`, `film/`, and `publishers/`. Subdirs: `briefs/`, `positioning/`, `copy/`, `press/`, `social/`. |
| `/marketers-write-positioning <project>` | Sharpens positioning into ad-ready language. Reads bible + manuscript + any publishers/positioning. Output: `marketing/positioning/<slug>.md`. |
| `/marketers-write-launch-copy <project> [--channel <c>]` | Channel-specific copy. Default produces email, social, press, web. With `--channel`, produces only the named channel. Output: `marketing/copy/<slug>-<channel>.md`. |

## Why this plugin

The constellation as it stood produced creative artifacts (prose, film, publication form) but not the **demand layer** — the positioning, the ad copy, the launch language that turns a published artifact into an audience. Marketing is its own craft; conflating it with publishing produces both worse marketing and worse publishing.

great-marketers consumes what the other four plugins produce — the manuscript from `great-authors`, the cover concept from `great-publishers`, the trailer from `great-filmmakers`, the strategic positioning from `great-minds` — and turns it into copy that sells.

The plugin is consciously scoped to **marketing**. Software engineering, product/UX, operations are deferred to future sibling plugins (`great-engineers`, `great-designers`, `great-operators`) — see [`projects/caseproof-ai-company-constellation`](https://github.com/sethshoultes) for the roadmap.

## Conventions inherited from the constellation

- **Orchestrator vs. specialist.** Personas are dispatched as sub-agents in clean contexts. The orchestrator never produces the copy in-context.
- **Default-save.** Every generative skill saves output to disk before showing it in chat. Save to `marketing/<subdir>/<slug>.md`. Document the path in the response.
- **Project-bible reading.** Every persona reads `.great-authors/` at the project root before deciding. The bible is the shared spine across all five plugins.
- **Voice-lint discipline.** Generated copy respects `voice.md` and `voice-lints.md`.
- **Honest claim discipline.** No promises the work cannot keep. Promises the work overdelivers on are how reputations get made; promises it cannot keep are how trust gets lost.

## Project structure

```
.great-authors/                 # the bible — shared with great-authors
manuscript/                     # great-authors writes here
film/                           # great-filmmakers writes here
publishers/                     # great-publishers writes here
marketing/                      # great-marketers writes here (this plugin)
├── briefs/                     #   campaign briefs
├── positioning/                #   audience and angle, ad-ready
├── copy/                       #   channel-specific ad copy
├── press/                      #   press releases, talking points
└── social/                     #   social posts, thread copy
```

## Roadmap

- **v0.1** (this release) — eight personas, four MVP skills, DXT bundle.
- **v1.0** — Add `/marketers-write-press-kit`, `/marketers-write-email-sequence`, `/marketers-write-social-thread`, `/marketers-ab-test-copy`, `/marketers-orchestrate-launch`, `/marketers-debate`, `/marketers-critique`, `/marketers-edit`. ~12 skills total. Matches the breadth of the trilogy.

## License

MIT. See [LICENSE](./LICENSE).
