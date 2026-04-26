#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PERSONAS_DIR = join(__dirname, "personas");

// Load all bundled persona files into a lookup map keyed by canonical slug
// (e.g. "david-ogilvy", "bill-bernbach"). Filenames carry a role suffix
// (-copywriter, -creative, -strategist, -art-director, -direct-response,
// -pioneer, -narrative, -behavioral) which is stripped from the lookup key.
const PERSONAS = Object.fromEntries(
  readdirSync(PERSONAS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f
        .replace(/\.md$/, "")
        .replace(/-(copywriter|creative|strategist|art-director|direct-response|pioneer|narrative|behavioral)$/, "");
      const body = readFileSync(join(PERSONAS_DIR, f), "utf8");
      return [slug, body];
    })
);

const MARKETER_BLURBS = {
  "david-ogilvy": "Research-driven copy. Headlines do 80% of the work. Founder of Ogilvy & Mather.",
  "bill-bernbach": "The creative revolution. Consumer dignity as moral position. Co-founder of DDB.",
  "mary-wells-lawrence": "Brand-as-personality. Big bets win. Founder of Wells Rich Greene; Braniff, I ♥ NY.",
  "lee-clow": "Art direction as creative lead. The campaign as cultural object. TBWA\\Chiat\\Day; '1984,' 'Think Different.'",
  "rosser-reeves": "The Unique Selling Proposition. Hammer the claim. Chairman of Ted Bates.",
  "helen-lansdowne-resor": "First major woman copywriter. Emotional appeal; testimonial architecture. JWT, 1908-1964.",
  "bruce-barton": "Corporate narrative as durable form. The parable is the unit. BBDO co-founder.",
  "rory-sutherland": "Behavioral economics applied to marketing. The unintuitive truth. Ogilvy UK.",
};

// Short-form aliases accepted in tool inputs.
const MARKETER_ALIASES = {
  "ogilvy": "david-ogilvy",
  "david": "david-ogilvy",
  "bernbach": "bill-bernbach",
  "bill": "bill-bernbach",
  "mary-wells": "mary-wells-lawrence",
  "wells": "mary-wells-lawrence",
  "wells-lawrence": "mary-wells-lawrence",
  "mary": "mary-wells-lawrence",
  "clow": "lee-clow",
  "lee": "lee-clow",
  "reeves": "rosser-reeves",
  "rosser": "rosser-reeves",
  "helen": "helen-lansdowne-resor",
  "lansdowne-resor": "helen-lansdowne-resor",
  "resor": "helen-lansdowne-resor",
  "barton": "bruce-barton",
  "bruce": "bruce-barton",
  "sutherland": "rory-sutherland",
  "rory": "rory-sutherland",
};

function resolveMarketer(input) {
  if (!input) {
    throw new Error("Persona name is required.");
  }
  const normalized = input.toLowerCase().trim();
  const slug = MARKETER_ALIASES[normalized] || normalized;
  if (!PERSONAS[slug]) {
    const valid = Object.keys(MARKETER_BLURBS).join(", ");
    throw new Error(
      `Unknown persona "${input}". Valid: ${valid} (short forms: ogilvy, bernbach, mary-wells, clow, reeves, helen, barton, sutherland).`
    );
  }
  return { slug, body: PERSONAS[slug] };
}

const server = new Server(
  { name: "great-marketers", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

// ---------- Tool listing ----------

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_marketers",
      description:
        "List the eight advertising/marketing personas with one-line descriptions.",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "marketers_channel",
      description:
        "Load a named marketing persona into the conversation for direct collaboration. Substantive output (campaign briefs, positioning docs, ad copy, press materials) auto-saves to marketing/<artifact-type>/<slug>.md. Valid: david-ogilvy, bill-bernbach, mary-wells-lawrence, lee-clow, rosser-reeves, helen-lansdowne-resor, bruce-barton, rory-sutherland (short forms accepted).",
      inputSchema: {
        type: "object",
        properties: {
          persona: {
            type: "string",
            description: "Persona slug or short form.",
          },
        },
        required: ["persona"],
      },
    },
    {
      name: "marketers_project_init",
      description:
        "Scaffold a marketing/ directory at the project root, sibling to manuscript/, film/, and publishers/. Subdirs: briefs/, positioning/, copy/, press/, social/. Updates .great-authors/project.md with a ## Marketing section. Requires filesystem access in Claude Desktop.",
      inputSchema: {
        type: "object",
        properties: {
          target_dir: {
            type: "string",
            description:
              "Optional target directory. If omitted, the prompt asks the user for the project root.",
          },
          slug: {
            type: "string",
            description:
              "Optional starting marketing-campaign slug. Defaults to the project slug.",
          },
        },
      },
    },
    {
      name: "marketers_write_positioning",
      description:
        "Produce an ad-ready positioning doc covering audience, angle, proposition, evidence, register, and refusals. Default persona David Ogilvy; override available. Saves to marketing/positioning/<slug>.md. The positioning doc is the contract every downstream copy work obeys.",
      inputSchema: {
        type: "object",
        properties: {
          project: {
            type: "string",
            description:
              "Project directory path or slug. If omitted, uses the current working directory.",
          },
          persona: {
            type: "string",
            description:
              "Optional persona override (default david-ogilvy). For behavioral-led positioning, use rory-sutherland; for brand-personality-led, mary-wells-lawrence; for institutional, bruce-barton.",
          },
        },
      },
    },
    {
      name: "marketers_write_launch_copy",
      description:
        "Produce channel-specific launch copy (email, social, press, web). Reads marketing/positioning/<slug>.md as the contract. Auto-selects the right persona per channel; override available. Saves to marketing/copy/<slug>-<channel>.md.",
      inputSchema: {
        type: "object",
        properties: {
          project: {
            type: "string",
            description:
              "Project directory path or slug. If omitted, uses the current working directory.",
          },
          channel: {
            type: "string",
            enum: ["email", "social", "press", "web"],
            description:
              "Optional single channel. If omitted, all four channels are produced.",
          },
          persona: {
            type: "string",
            description:
              "Optional persona override. If omitted, the skill auto-selects per channel (Ogilvy for email/web, Bernbach for social, Barton for press).",
          },
        },
      },
    },
  ],
}));

// ---------- Tool calls ----------

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;

  if (name === "list_marketers") {
    const lines = Object.entries(MARKETER_BLURBS).map(
      ([k, v]) => `- **${k}** — ${v}`
    );
    const text = `# Great Marketers Roster\n\n## Eight personas\n\n${lines.join("\n")}\n\nDispatch any of them via \`marketers_channel\` (Claude Desktop) or \`/marketers-channel <name>\` (Claude Code). Short forms accepted: ogilvy, bernbach, mary-wells, clow, reeves, helen, barton, sutherland.`;
    return { content: [{ type: "text", text }] };
  }

  if (name === "marketers_channel") {
    const { slug, body } = resolveMarketer(args.persona);
    const text = `You are now channeling the following marketing persona. Read the persona body carefully, then adopt this voice for the rest of the conversation. The user will collaborate with you as this persona on marketing-stage work — campaign briefs, positioning docs, ad copy, press materials, social copy.\n\n---PERSONA: ${slug}---\n${body}\n---END PERSONA---\n\nIf the user says "drop the persona," "exit persona," or "back to Claude," return to normal voice.\n\nWhen you produce a substantive artifact (campaign brief, positioning doc, ad copy block, press release, social thread), save it to disk before showing it to the user. Path conventions:\n\n| Artifact | Path |\n|---|---|\n| Campaign brief | marketing/briefs/<slug>.md |\n| Positioning doc | marketing/positioning/<slug>.md |\n| USP doc (Reeves) | marketing/positioning/<slug>-usp.md |\n| Behavioral analysis (Sutherland) | marketing/positioning/<slug>-behavioral.md |\n| Corporate narrative brief (Barton) | marketing/briefs/<slug>-narrative.md |\n| Testimonial architecture (Lansdowne Resor) | marketing/briefs/<slug>-testimonial.md |\n| Ad copy by channel | marketing/copy/<slug>-<channel>.md |\n| Press release | marketing/press/<slug>.md |\n| Social copy / thread | marketing/social/<slug>.md |\n\nResolve <slug> from .great-authors/project.md's ## Marketing section's Current campaign field. If the user says "preview only" or "don't save this one" before you produce the artifact, skip the save for that one block.\n\nIf .great-authors/ exists in the working directory, read project.md, voice.md, voice-lints.md, and any relevant manuscript / publishers / film artifacts before producing the substantive work. The persona's "How you work" section names the protocol.\n\nBegin as ${slug} now.`;
    return { content: [{ type: "text", text }] };
  }

  if (name === "marketers_project_init") {
    const target = args.target_dir || "<user's current working directory>";
    const slug = args.slug || "<project slug from .great-authors/project.md>";
    const text = `You are initializing the marketing/ directory for a project at the marketing/launch stage. Target directory: ${target}.\n\n1. Verify .great-authors/ exists at the target. If not, tell the user to run /authors-project-init from great-authors-plugin first; do not proceed.\n2. Check whether marketing/ already exists. If it does, ask whether to overwrite the scaffold (default skip).\n3. Read .great-authors/project.md to import title and genre. If the project's genre is mystery/crime/thriller/horror, note this — it informs content-policy considerations for downstream copy that may reference imagery.\n4. Ask one question: "What's the slug for the marketing campaign you're starting with? Default: ${slug}." Accept any kebab-case identifier.\n5. Create marketing/ at the target with five empty subdirectories: briefs/, positioning/, copy/, press/, social/.\n6. Update .great-authors/project.md by appending a ## Marketing section (or asking before overwriting an existing one):\n\n   ## Marketing\n\n   **Path:** marketing/ (at project root, sibling to .great-authors/, manuscript/, film/, and publishers/)\n   **Current campaign:** <slug>\n\n   Commands that generate marketing artifacts (marketers_channel save behavior, marketers_write_positioning, marketers_write_launch_copy) write to marketing/<subdir>/<current-campaign>.md by default.\n\n7. Report what was created and suggest next steps:\n   - marketers_channel <persona> for direct collaboration\n   - marketers_write_positioning to produce the positioning doc (the contract for all downstream copy)\n   - marketers_write_launch_copy to produce channel-specific launch copy\n\nBegin.`;
    return { content: [{ type: "text", text }] };
  }

  if (name === "marketers_write_positioning") {
    const project = args.project || "<current working directory>";
    const persona = args.persona || "david-ogilvy";
    const text = `You are producing an ad-ready positioning doc for a project. Project: ${project}. Persona: ${persona}.\n\n1. Resolve the project root. Verify .great-authors/project.md and at least one of manuscript/, film/, or a clear product description. If neither bible nor any artifact exists, report and stop.\n2. Read .great-authors/project.md (title, genre, premise, audience), .great-authors/voice.md, and .great-authors/voice-lints.md if it exists.\n3. Read the artifacts the project has produced: manuscript/ (first chapter and TOC for a book); film/screenplay/ (production doc if it exists); publishers/positioning/<slug>.md if it exists (publication-form positioning informs but does not replace marketing positioning); publishers/jacket-copy/<slug>.md if it exists (congruence test).\n4. Resolve the persona to dispatch. Default: david-ogilvy. For behavioral-econ-led: rory-sutherland. For brand-personality-led: mary-wells-lawrence. For institutional/corporate: bruce-barton.\n5. Dispatch the persona with a brief that includes: bible files read, artifact summary, publication-form positioning if it exists, output target marketing/positioning/<slug>.md, and the required structure (Audience as a person; Angle why-now; Proposition the one claim; Evidence 3-5 proof points; Register the campaign's voice; What the positioning is NOT). Length target 600-1,000 words.\n6. Save the doc to marketing/positioning/<slug>.md. If the file exists, ask whether to overwrite, save as -v2, or skip.\n7. Report path, word count, persona used, audience one-liner, proposition one-liner, and next steps (write-launch-copy, or refine via marketers_channel).\n\nDo NOT write any channel copy here — that's marketers_write_launch_copy. Do NOT invent facts about the work. Every claim must trace to bible / manuscript / publishers' positioning.\n\nBegin.`;
    return { content: [{ type: "text", text }] };
  }

  if (name === "marketers_write_launch_copy") {
    const project = args.project || "<current working directory>";
    const channel = args.channel || "all four (email, social, press, web)";
    const personaOverride = args.persona ? `\nUser-specified persona override: ${args.persona}` : "";
    const text = `You are producing channel-specific launch copy for a project. Project: ${project}. Channel(s): ${channel}.${personaOverride}\n\n1. Resolve the project root. Verify .great-authors/, the underlying artifact (manuscript or film), AND the positioning doc at marketing/positioning/<slug>.md all exist. If the positioning doc is missing, report: "No positioning doc found at marketing/positioning/<slug>.md. Run marketers_write_positioning first; then re-run this skill." and stop.\n2. Read inputs: marketing/positioning/<slug>.md (the canonical positioning); .great-authors/voice.md; .great-authors/project.md; the most representative excerpt of the artifact (book opening / trailer opening shot); publishers/jacket-copy/<slug>.md if it exists (congruence test).\n3. Auto-select the persona per channel unless --persona overrides:\n   - email: david-ogilvy (long-copy direct response)\n   - social: bill-bernbach (short, witty, image-paired)\n   - press: bruce-barton (institutional register)\n   - web: david-ogilvy (H1 carries 80%)\n4. For each channel selected, dispatch the persona with a brief including: positioning doc full text, voice rules from voice.md, the artifact excerpt, the channel format spec, the output target marketing/copy/<slug>-<channel>.md, and the channel length target.\n5. Channel format specs:\n   - email: Subject line (3-5 candidates, 6-9 words each); Preview text (25-40 chars); Email body (350-700 words); Single CTA in closing paragraph.\n   - social: Twitter/X (3 variants, under 280 chars each, image-paired); LinkedIn (1 variant, 600-1,200 chars); Substack notes (3 short variants).\n   - press: Standard press-release format — FOR IMMEDIATE RELEASE / Date / Headline / Lede 1 paragraph / Body 3-5 paragraphs / Boilerplate / Press contact / ###.\n   - web: H1 (single declarative); Subhead (one sentence); Lede paragraph (150-250 words); 3-5 H2 body sections (each H2 = one proof point, body 100-200 words); CTA section.\n6. Save each generated file to marketing/copy/<slug>-<channel>.md. If a file exists, ask whether to overwrite, save as -v2, or skip per file.\n7. Report all paths, persona used per channel, word/char counts, and next steps (review; sutherland behavioral review; cross-check publishers/jacket-copy congruence).\n\nDo NOT invent positioning. The positioning doc is the contract; obey it. Do NOT paraphrase manuscript content — quotes must be exact and attributed. Do NOT deploy.\n\nBegin.`;
    return { content: [{ type: "text", text }] };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// ---------- Boot ----------

const transport = new StdioServerTransport();
await server.connect(transport);
