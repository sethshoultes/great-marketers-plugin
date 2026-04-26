---
name: marketers-project-init
description: Scaffold a marketing/ directory at the project root, sibling to manuscript/, film/, and publishers/. Adds a ## Marketing section to .great-authors/project.md so marketing-stage commands know where to write. Use when starting the marketing/launch work for a project — the moment after great-authors, great-filmmakers, and great-publishers have produced their artifacts and you're ready to position and ship demand.
---

# /marketers-project-init

Scaffold the `marketing/` directory and register it in the project bible.

## What this does

Creates a `marketing/` folder at the current working directory's project root with five empty subdirectories:

```
marketing/
├── briefs/         # Campaign briefs (concept, narrative, USP, behavioral, testimonial)
├── positioning/    # Audience, angle, proposition, evidence — ad-ready
├── copy/           # Channel-specific ad copy (email, social, press, web)
├── press/          # Press releases, talking points, boilerplate
└── social/         # Social posts, thread copy
```

Then adds a `## Marketing` section to `.great-authors/project.md`:

```markdown
## Marketing

**Path:** `marketing/` (at project root, sibling to `.great-authors/`, `manuscript/`, `film/`, and `publishers/`)
**Current campaign:** `<user-chosen-slug>`

Commands that generate marketing artifacts (`/marketers-channel` save behavior, `/marketers-write-positioning`, `/marketers-write-launch-copy`) write to `marketing/<subdir>/<current-campaign>.md` by default. Update `Current campaign` when moving to a different launch or a different campaign for the same work.
```

## When to use

- Starting the marketing/launch stage on a project that has manuscripts and/or publication-form artifacts.
- Extending an existing project (great-authors / great-filmmakers / great-publishers) with marketing-stage work.
- Before invoking `/marketers-channel` with save triggers (which need to know where to write).

## Instructions for Claude

When this skill is invoked:

1. **Verify `.great-authors/` exists** in the current working directory. If not, tell the user: "This skill assumes a project bible at `.great-authors/`. Run `/authors-project-init` (from great-authors-plugin) first to scaffold the bible, then re-run this skill."

2. **Check for existing `marketing/` directory.** If it exists, ask: "A `marketing/` directory already exists. Overwrite the scaffold (destroys existing content) or skip (leaves it alone)? (overwrite/skip)" — default skip.

3. **Read `.great-authors/project.md`** to import title and genre. If a `## Publishing` section exists (from `/publishers-project-init`), note the current artifact; the marketing campaign slug often aligns with it. If `genre` field signals mystery / crime / thriller / horror, note this — it informs content-policy considerations for downstream copy work that may reference imagery.

4. **Ask the campaign-slug question.** One question:
   - "What's the slug for the marketing campaign you're starting with? Default: same as the project slug. Accept any kebab-case identifier (e.g., `arizona-strip-launch`, `chapter-01-blog-promo`, `q2-rollout`)."

5. **Create the directory tree.** Five empty subdirectories under `marketing/`:
   - `briefs/`
   - `positioning/`
   - `copy/`
   - `press/`
   - `social/`

6. **Update `.great-authors/project.md`.** Read the existing file. If it already has a `## Marketing` section, ask whether to overwrite it. If not, append the `## Marketing` block documented above, substituting the user's chosen slug into `Current campaign`.

7. **Report:**
   ```
   Created marketing/ with subdirs:
     briefs/  positioning/  copy/  press/  social/

   Updated .great-authors/project.md with ## Marketing section.
   Current campaign: <slug>

   Next:
   - /marketers-channel <persona> to channel a marketer (ogilvy, bernbach, mary-wells, clow, reeves, helen, barton, sutherland).
     Substantive output (briefs, positioning, copy) saves to marketing/<subdir>/<slug>.md by default.
   - /marketers-write-positioning <project> to produce an ad-ready positioning doc.
   - /marketers-write-launch-copy <project> [--channel <c>] to produce channel-specific copy.
   ```

## Notes

- This skill does not commit to git. The user owns their repository.
- The `marketing/` directory is for ARTIFACTS at the marketing/launch stage. The bible stays at `.great-authors/`; the manuscript stays at `manuscript/`; film artifacts stay at `film/`; publication-form artifacts stay at `publishers/`. Each has its own owner.
- If the user's project has no `.great-authors/` directory at all (working on a one-off campaign for a standalone product), the skill still creates `marketing/` but emits a warning that personas won't have bible context to read before working.
- The `current-campaign` slug is editorial: a single project might have multiple campaigns (a launch, a paperback release, a season-two rollout) and the slug names "what we're working on right now." Update when you move between campaigns.
