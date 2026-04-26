# marketing/ — marketing-stage artifacts

This is the directory `/marketers-project-init` copies into a project's root, sibling to `manuscript/` (great-authors), `film/` (great-filmmakers), and `publishers/` (great-publishers).

## Subdirectories

| Subdir | Owner | Contents |
|---|---|---|
| `briefs/` | Any persona | Campaign briefs (concept, narrative, USP, behavioral angle, testimonial architecture) |
| `positioning/` | Ogilvy, Sutherland, Wells Lawrence | Positioning docs, USP docs, behavioral analyses — ad-ready language |
| `copy/` | Ogilvy, Bernbach, Wells Lawrence (channel-dependent) | Channel-specific ad copy: `<slug>-email.md`, `<slug>-social.md`, `<slug>-press.md`, `<slug>-web.md` |
| `press/` | Barton, Tina Brown (cross-plugin) | Press releases, talking points, boilerplate |
| `social/` | Bernbach, Wells Lawrence | Social posts, thread copy, micro-blog notes |

## Slug convention

Each artifact saves as `<slug>.md` (or `<slug>-<channel>.md` for channel-specific copy) under the appropriate subdir. The slug is set in `.great-authors/project.md`'s `## Marketing` section's `Current campaign` field. A single project may have multiple campaigns in flight (a launch, a paperback release, an anniversary edition) — update the current-campaign field as you move between them.

## Filename suffixes

Channel-specific copy uses suffixes:

- `<slug>-email.md` — email body + subject line + preview text
- `<slug>-social.md` — Twitter/X variants + LinkedIn + Substack notes
- `<slug>-press.md` — press release in standard format
- `<slug>-web.md` — landing copy with H1, H2 sections, CTA

Persona-specific outputs use suffixes for variants:

- `<slug>.md` — primary positioning (Ogilvy default)
- `<slug>-usp.md` — Reeves alternative
- `<slug>-behavioral.md` — Sutherland alternative
- `<slug>-narrative.md` — Barton alternative (corporate-narrative register)
- `<slug>-testimonial.md` — Lansdowne Resor alternative (testimonial architecture)

The orchestrator picks which to ship; the alternatives stay on disk as the editorial conversation.

## Why this lives at the project level

Marketing artifacts depend on the project's manuscript, publication-form artifacts, and bible. They cannot be project-agnostic. So they live at the project root, owned by the project, committed to the project's repo. The plugin scaffolds the directory; the project owns it from then on.
