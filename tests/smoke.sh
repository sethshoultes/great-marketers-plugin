#!/usr/bin/env bash
# Plugin smoke tests for great-publishers. Catches the regressions that matter —
# frontmatter validity, persona-count alignment between agents/ and DXT bundle,
# version coherence, DXT tool/handler matching.

set -uo pipefail

cd "$(dirname "$0")/.."

ERRORS=0
red() { printf '\033[31m%s\033[0m\n' "$1" >&2; }
green() { printf '\033[32m%s\033[0m\n' "$1"; }

# ---------- 1. Frontmatter validity ----------

echo "Checking SKILL.md frontmatter..."
for f in skills/*/SKILL.md; do
  if [ ! -f "$f" ]; then continue; fi
  if ! head -1 "$f" | grep -q '^---$'; then
    red "  FAIL: $f does not start with YAML frontmatter delimiter"
    ERRORS=$((ERRORS + 1))
    continue
  fi
  if ! awk '/^---$/{c++} c==1 && /^name: /{found=1} END{exit !found}' "$f"; then
    red "  FAIL: $f frontmatter is missing 'name:' field"
    ERRORS=$((ERRORS + 1))
  fi
  if ! awk '/^---$/{c++} c==1 && /^description: /{found=1} END{exit !found}' "$f"; then
    red "  FAIL: $f frontmatter is missing 'description:' field"
    ERRORS=$((ERRORS + 1))
  fi
done

echo "Checking persona frontmatter..."
for f in agents/*.md; do
  if [ ! -f "$f" ]; then continue; fi
  if ! head -1 "$f" | grep -q '^---$'; then
    red "  FAIL: $f does not start with YAML frontmatter delimiter"
    ERRORS=$((ERRORS + 1))
    continue
  fi
  if ! awk '/^---$/{c++} c==1 && /^name: /{found=1} END{exit !found}' "$f"; then
    red "  FAIL: $f frontmatter is missing 'name:' field"
    ERRORS=$((ERRORS + 1))
  fi
  if ! awk '/^---$/{c++} c==1 && /^description: /{found=1} END{exit !found}' "$f"; then
    red "  FAIL: $f frontmatter is missing 'description:' field"
    ERRORS=$((ERRORS + 1))
  fi
done

# ---------- 2. Persona file count alignment ----------

echo "Checking DXT bundled personas match agents/..."
AGENTS_COUNT=$(ls agents/*.md 2>/dev/null | wc -l | tr -d ' ')
DXT_COUNT=$(ls distribution/dxt/server/personas/*.md 2>/dev/null | wc -l | tr -d ' ')
if [ "$AGENTS_COUNT" != "$DXT_COUNT" ]; then
  red "  FAIL: agents/ has $AGENTS_COUNT files but distribution/dxt/server/personas/ has $DXT_COUNT"
  red "        Run: cp agents/*.md distribution/dxt/server/personas/"
  ERRORS=$((ERRORS + 1))
fi

# v0.1 ships exactly 8 personas. Lock that count for the release.
if [ "$AGENTS_COUNT" != "8" ]; then
  red "  FAIL: v0.1 expects 8 personas in agents/; found $AGENTS_COUNT"
  ERRORS=$((ERRORS + 1))
fi

# ---------- 3. Version coherence ----------

echo "Checking version coherence..."
PKG_VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"version": *"\([^"]*\)".*/\1/')
PLUGIN_VERSION=$(grep '"version"' .claude-plugin/plugin.json | head -1 | sed 's/.*"version": *"\([^"]*\)".*/\1/')
DXT_PKG_VERSION=$(grep '"version"' distribution/dxt/package.json | head -1 | sed 's/.*"version": *"\([^"]*\)".*/\1/')
DXT_MANIFEST_VERSION=$(grep '"version"' distribution/dxt/manifest.json | head -1 | sed 's/.*"version": *"\([^"]*\)".*/\1/')

if [ "$PKG_VERSION" != "$PLUGIN_VERSION" ] || \
   [ "$PKG_VERSION" != "$DXT_PKG_VERSION" ] || \
   [ "$PKG_VERSION" != "$DXT_MANIFEST_VERSION" ]; then
  red "  FAIL: version drift across config files:"
  red "        package.json:                       $PKG_VERSION"
  red "        .claude-plugin/plugin.json:         $PLUGIN_VERSION"
  red "        distribution/dxt/package.json:      $DXT_PKG_VERSION"
  red "        distribution/dxt/manifest.json:     $DXT_MANIFEST_VERSION"
  ERRORS=$((ERRORS + 1))
fi

# ---------- 4. Skill <-> DXT tool alignment ----------

echo "Checking each skill has a corresponding DXT tool..."
for skill_dir in skills/*/; do
  skill_name=$(basename "$skill_dir")
  # Convert kebab-case to snake_case for DXT tool name (publishers-channel -> publishers_channel)
  expected_tool=$(echo "$skill_name" | tr '-' '_')
  if ! grep -q "name: \"$expected_tool\"" distribution/dxt/server/index.js; then
    red "  FAIL: skill $skill_name has no matching tool $expected_tool in DXT server"
    ERRORS=$((ERRORS + 1))
  fi
done

echo "Checking DXT tool definitions vs handlers..."
TOOL_NAMES=$(grep -oE 'name: "[a-z_]+"' distribution/dxt/server/index.js | sed 's/name: "\(.*\)"/\1/' | sort -u)
HANDLER_NAMES=$(grep -oE 'name === "[a-z_]+"' distribution/dxt/server/index.js | sed 's/name === "\(.*\)"/\1/' | sort -u)

MISSING_HANDLERS=$(comm -23 <(echo "$TOOL_NAMES") <(echo "$HANDLER_NAMES"))
MISSING_DEFS=$(comm -13 <(echo "$TOOL_NAMES") <(echo "$HANDLER_NAMES"))

if [ -n "$MISSING_HANDLERS" ]; then
  red "  FAIL: tool defined in DXT manifest but no handler:"
  echo "$MISSING_HANDLERS" | sed 's/^/        /' >&2
  ERRORS=$((ERRORS + 1))
fi
if [ -n "$MISSING_DEFS" ]; then
  red "  FAIL: handler in DXT but no tool definition:"
  echo "$MISSING_DEFS" | sed 's/^/        /' >&2
  ERRORS=$((ERRORS + 1))
fi

# ---------- Summary ----------

echo ""
if [ "$ERRORS" -eq 0 ]; then
  green "✓ All smoke tests passed."
  exit 0
else
  red "✗ $ERRORS check(s) failed."
  exit 1
fi
