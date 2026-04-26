# Great Marketers — DXT Bundle

Claude Desktop extension for `great-marketers`. Same eight personas and four MVP tools as the Claude Code plugin, packaged as a Desktop Extension (DXT) for double-click install.

## Build the bundle

```bash
cd distribution/dxt
npm install
npx @anthropic-ai/dxt pack
```

The pack command produces `great-marketers.dxt` in this directory. Share that file with collaborators — they double-click it to install.

## Tools exposed

The MCP server in `server/index.js` exposes five tools:

| Tool | Maps to |
|---|---|
| `list_marketers` | Browse the eight personas with one-line blurbs |
| `marketers_channel` | The Claude Code skill `/marketers-channel <persona>` |
| `marketers_project_init` | The Claude Code skill `/marketers-project-init` |
| `marketers_write_positioning` | The Claude Code skill `/marketers-write-positioning <project>` |
| `marketers_write_launch_copy` | The Claude Code skill `/marketers-write-launch-copy <project> [--channel <c>]` |

`marketers_project_init`, `marketers_write_positioning`, and `marketers_write_launch_copy` require Claude Desktop's filesystem access to be configured for the user's project directory. Without filesystem access, the tools still return useful guidance text but cannot scaffold or save artifacts to disk.

## Persona files

Each tool that loads a persona reads from `server/personas/`. These are byte-for-byte copies of the persona files in `agents/` at the plugin root. The smoke test (`tests/smoke.sh`) verifies the two directories stay in sync — if you edit a persona, run:

```bash
cp agents/*.md distribution/dxt/server/personas/
```

then re-run `tests/smoke.sh` to confirm the counts match.

## Versioning

The DXT version must match `package.json` and `.claude-plugin/plugin.json`. The smoke test validates this. To bump versions:

```bash
# Update all three:
.claude-plugin/plugin.json
package.json
distribution/dxt/manifest.json
distribution/dxt/package.json

# Then run smoke tests:
bash tests/smoke.sh
```

## Notes

- The DXT bundle is intentionally a thin wrapper over the persona files and the skill prompts. The MCP server returns prompt text; Claude Desktop interprets it the same way Claude Code interprets the SKILL.md files.
- Filesystem-touching tools (project_init, write_positioning, write_launch_copy) return prompt text that *describes* what should happen on disk; the actual filesystem work happens through Claude Desktop's filesystem MCP integration. This pattern matches the trilogy and great-publishers DXT bundles.
- For the Claude Code experience, install the plugin instead: `/plugin install great-marketers@sethshoultes`.
