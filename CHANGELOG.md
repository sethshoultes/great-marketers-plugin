# Changelog

All notable changes to `great-marketers` are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/) with [SemVer](https://semver.org/) versioning.

## [0.1.0] — 2026-04-26 — MVP

The initial release. Fifth plugin in the Caseproof persona constellation, sibling to `great-minds`, `great-authors`, `great-filmmakers`, `great-publishers`.

### Added

**Eight advertising/marketing personas** — agents/

- `david-ogilvy-copywriter` — Ogilvy & Mather; research-driven long copy; the headline does 80% of the work
- `bill-bernbach-creative` — DDB ("Think Small," "We Try Harder"); the creative revolution; consumer dignity as moral position
- `mary-wells-lawrence-strategist` — Wells Rich Greene (Braniff, Alka-Seltzer, "I ♥ NY"); brand-as-personality; big bets win
- `lee-clow-art-director` — TBWA\Chiat\Day ("1984," "Think Different"); art-direction as creative lead; Media Arts
- `rosser-reeves-direct-response` — Ted Bates (M&M's, Anacin); coined the Unique Selling Proposition; hammer the claim
- `helen-lansdowne-resor-pioneer` — JWT (Woodbury, Pond's, Lux); first major woman copywriter; emotional appeal pioneer
- `bruce-barton-narrative` — BBDO co-founder; *The Man Nobody Knows*; corporate narrative as durable form
- `rory-sutherland-behavioral` — Ogilvy UK; behavioral economics applied to marketing; the unintuitive truth

**Drafted via cross-plugin orchestration.** Each persona file was drafted by a great-authors writer whose register fits the subject:

| Subject | Drafter | Lens |
|---|---|---|
| Ogilvy | Didion | Cool observational authority; research as anthropology |
| Bernbach | Baldwin | Moral urgency about consumer dignity |
| Wells Lawrence | King | Voice-driven; popular-narrative power |
| Lee Clow | McPhee | Architecture; structural rigor across decades |
| Reeves | Hemingway | Compression as ideology; iceberg theory |
| Lansdowne Resor | Morrison | Lyric, polyphonic, sensory specificity |
| Barton | McCarthy | Biblical weight; mythic register |
| Sutherland | Wallace | Self-aware essay; contrarian without performance |

Final pass: `great-authors:gottlieb-persona` did a threshold edit across the corpus — surfaced bloat, named cuts, kept the prose tight. Cuts applied surgically by the orchestrator; no rewrites.

**Four operational skills** — skills/

- `/marketers-channel <persona>` — load a marketing persona into the conversation; substantive output (briefs, positioning, copy) auto-saves to `marketing/<artifact-type>/<slug>.md`
- `/marketers-project-init` — scaffold a `marketing/` directory at the project root (sibling to `manuscript/`, `film/`, `publishers/`); reads `.great-authors/project.md` to import title and genre
- `/marketers-write-positioning <project>` — sharpens positioning into ad-ready language; saves to `marketing/positioning/<slug>.md`
- `/marketers-write-launch-copy <project> [--channel <c>]` — channel-specific copy (email, social, press, web); saves to `marketing/copy/<slug>-<channel>.md`

**Distribution**

- Claude Code plugin (this repo)
- Claude Desktop DXT bundle at `distribution/dxt/`

### Architecture decisions

- **Constellation, not mega-plugin.** Marketers owns marketing — positioning, ad copy, demand generation, sales narrative. Distinct from publishers (publication form: covers, jackets, magazine register), authors (prose), filmmakers (film), minds (strategy). Constellation roadmap: `brain/projects/caseproof-ai-company-constellation.md`.
- **Cross-plugin orchestration as method.** v0.1 personas were drafted by great-authors writers via subagent dispatch. The constellation pattern is the build pattern.
- **Default-save.** Every generative skill saves to disk before showing in chat.
- **Bible at `.great-authors/`** is the shared spine across all five plugins.

### Deferred to v1.0

- `/marketers-write-press-kit` — press release + key messages + boilerplate
- `/marketers-write-email-sequence` — multi-touch email campaign
- `/marketers-write-social-thread` — Twitter/LinkedIn long-thread copy
- `/marketers-ab-test-copy` — produce paired variants for testing
- `/marketers-orchestrate-launch` — end-to-end launch pipeline (mirror `/authors-orchestrate-novel`, composes positioning + copy + cross-plugin publishers/filmmakers handoffs)
- `/marketers-debate`, `/marketers-critique`, `/marketers-edit` — composite editorial commands

### Real-world test target

The Murder on the Arizona Strip novel (great-authors test project) is the v0.1 test target — generate positioning and launch copy from the manuscript + the cover concept (publishers/covers/) + the trailer (film/render/). Cross-plugin composition in production.
