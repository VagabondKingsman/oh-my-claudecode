# Vibecodekit Hybrid (vibecodekit-hybrid)

> Contractor–Worker pipeline combining Vibecodekit v5 methodology with the oh-my-claudecode (OMC) runtime.

## TL;DR

`vibecodekit-hybrid` is a top-level skill that wires the Vibecodekit v5 methodology (Homeowner ↔ Contractor ↔ Worker) into OMC's existing primitives (skills, agents, hooks, state, multi-provider). It chains eight stages:

```
SCAN → RRI → VISION → BLUEPRINT → TASK GRAPH → BUILD → VERIFY → REFINE
```

Each stage is delegated to a dedicated skill or agent. Artifacts are persisted under `.omc/research/`, `.omc/specs/`, and `.omc/plans/` so every decision is reviewable and reproducible.

## Why this skill exists

- `autopilot` is optimised for speed and assumes the goal is clear.
- Many real projects are ambiguous — they need persona-driven requirements discovery, a named vision pattern, and a reviewed blueprint **before** a single line of code is written.
- Vibecodekit v5 codifies this flow as the Contractor–Worker Protocol; this skill wires that protocol into OMC without touching the core TypeScript runtime.

## Pipeline map

| # | Stage | Skill / Agent | Artifact |
|---|-------|---------------|----------|
| 1 | SCAN | `vibecodekit-hybrid-scan` → `explore` agent | `.omc/research/vibecodekit-hybrid-scan-<slug>.md` |
| 2 | RRI | `vibecodekit-hybrid-rri` → `rri-interviewer` agent | `.omc/specs/vibecodekit-hybrid-rri-<slug>.md` |
| 3 | VISION | `vibecodekit-hybrid-vision` + `templates/vibecodekit-hybrid/vision-patterns/` | Vision section of Blueprint |
| 4 | BLUEPRINT | `ralplan` (Planner → Architect → Critic) | `.omc/plans/vibecodekit-hybrid-<slug>.md` |
| 5 | APPROVED gate | user confirms `APPROVED` | — |
| 6 | BUILD | `team` / `autopilot` / `ralph` + TIP template | Worker Completion Reports |
| 7 | VERIFY | `vibecodekit-hybrid-verify` + `verifier` + `qa-tester` | `.omc/plans/vibecodekit-hybrid-verify-<slug>.md` |
| 8 | REFINE | `ai-slop-cleaner` (only if PAINFUL / MISSING rows exist) | same Blueprint, patched |

## The 5 RRI personas

`rri-interviewer` covers each persona in fixed order with 2-4 concrete options per question (never open-ended).

1. **End User** — top-3 jobs-to-be-done, success feeling, daily path.
2. **Business Analyst** — pricing, plans, compliance, audit, reporting.
3. **QA Destroyer** — boundaries, invalid input, concurrency, localisation edges.
4. **Developer** — dev loop, tests, migrations, telemetry, conventions.
5. **DevOps / Operator** — deploy, secrets, rollback, observability, cost, scaling.

For UI-heavy projects, Phase 2 will add the RRI-UX persona bank (Speed Runner / First-Timer / Data Scanner / Multi-Tasker / Field Worker) via a separate `rri-ux-critic` agent.

## The 3 interview modes

The interviewer commits to exactly one mode for the whole session:

- **Challenge** (default for confident users): propose a strong recommendation; force the user to justify deviations.
- **Guided**: offer 2-3 balanced options with pros/cons, no recommendation.
- **Explore**: open question first, converge to options afterwards.

## The 10 vision patterns

Each pattern template in `templates/vibecodekit-hybrid/vision-patterns/` declares the canonical layout, default stack (as *suggestion*, not mandate), non-goals, persona focus, Flow Physics priorities, and an acceptance skeleton:

- `landing.md` — single-page marketing site
- `saas.md` — authenticated multi-tenant app
- `dashboard.md` — data-dense analytics surface
- `blog.md` — long-form content site
- `portfolio.md` — personal / studio showcase
- `enterprise-module.md` — feature module inside an existing enterprise app
- `mobile-app.md` — native / cross-platform mobile app (Phase 4b, React Native / Flutter)
- `cli-tool.md` — command-line tool with pipe-first UX (Phase 4b, Go / Rust / Node)
- `data-pipeline.md` — batch / streaming data pipeline (Phase 4b, Airflow / dbt / Kafka)
- `custom.md` — deliberate escape hatch when none of the above fits

## The 4-level verify verdict

`vibecodekit-hybrid-verify` rejects binary pass/fail. Every requirement gets one of:

- `PASS` ✅ — implemented AND covered by evidence
- `FAIL` ❌ — not implemented or broken
- `PAINFUL` ⚠️ — works, but creates bad UX or maintenance cost
- `MISSING` 🔲 — cannot be evaluated (no test, no environment, no data)

Every `PAINFUL` / `MISSING` row produces a follow-up TIP for REFINE. No row is allowed to be dropped silently.

## Artifact templates

All templates live under `templates/vibecodekit-hybrid/`:

- `scan-report.md` — SCAN output schema
- `tip.md` — Task Instruction Pack (one per delegated task)
- `completion-report.md` — Worker → Contractor reply schema
- `blueprint.md` — Blueprint with RRI Requirements Matrix + Task Decomposition Preview
- `verify-report.md` — RRI-Reverse verify report with 4-level verdict
- `vision-patterns/*.md` — the 10 vision patterns above

## Invocation

Keyword triggers:

```
vibecodekit build me a landing page for X
vibecodekit-hybrid run on this repo
vibecode-master: saas for mini-ERP in Vietnamese
```

Explicit invocation:

```
/oh-my-claudecode:vibecodekit-hybrid
/oh-my-claudecode:vibecodekit-hybrid --pattern saas --locale vi --interactive
/oh-my-claudecode:vibecodekit-hybrid --auto   # skip APPROVED gate
```

Available flags:

- `--interactive` (default): stop at APPROVED gate after BLUEPRINT
- `--auto`: bypass APPROVED gate; treat blueprint as pre-approved
- `--pattern <one of landing|saas|dashboard|blog|portfolio|enterprise-module|mobile-app|cli-tool|data-pipeline|custom>`: override auto-detection
- `--locale <en|vi>`: override auto-detection (README + `OMC_LOCALE`)

## Relationship to existing OMC skills

| Existing skill | Role inside vibecodekit-hybrid |
|----------------|------------------------------|
| `explore` | Used inside `vibecodekit-hybrid-scan` |
| `deep-interview` | Lower-level Socratic interview; **not** used by RRI stage (RRI has its own 5-persona agent). Can be invoked standalone for extra ambiguity reduction. |
| `ralplan` | Used as the Blueprint consensus engine (Planner → Architect → Critic) |
| `autopilot` | Used as the BUILD engine when tasks are not parallelisable |
| `team` | Used as the BUILD engine when Task Decomposition Preview has ≥ 3 independent tasks |
| `ralph` | Used as the BUILD engine when persistence is explicitly requested |
| `verifier` / `code-reviewer` / `security-reviewer` | Called inside `vibecodekit-hybrid-verify` for technical health checks |
| `qa-tester` | Called inside `vibecodekit-hybrid-verify` for persona walkthroughs |
| `ai-slop-cleaner` | Used during REFINE; bounded by the approved Blueprint |

## What Phase 1 delivers

- 5 skills: `vibecodekit-hybrid` + 4 sub-skills (`-scan`, `-rri`, `-vision`, `-verify`)
- 1 agent: `rri-interviewer` (5 personas × 3 modes)
- 14 templates: scan-report, tip, completion-report, blueprint, verify-report, 10 vision patterns (incl. the 3 Phase 4b additions: mobile-app, cli-tool, data-pipeline)
- Keyword detector integration: `vibecodekit`, `vibecodekit-hybrid`, `vibecode-master`
- Docs: this file + README sections

## What Phase 2 delivers (this PR)

- 3 additional skills: `vibecodekit-hybrid-rri-t`, `vibecodekit-hybrid-rri-ux`, `vibecodekit-hybrid-rri-ui` (total: 8 vibecodekit skills).
- 2 additional agents: `rri-tester` (5 testing personas × 7 dimensions × 8 stress axes, 4-level verdict) and `rri-ux-critic` (5 UX personas × 7 UX dimensions × 8 Flow Physics axes).
- 3 additional templates: `rri-t-report.md`, `rri-ux-report.md`, `rri-ui-report.md`.
- Orchestrator pipeline extended with optional Stage 4b (RRI-UX pre-design critique) and Stage 6b (RRI-T adversarial QA).
- VERIFY stage now writes a structured gate into `.omc/deliverables.json` (`verify_gate`, `verdict_counts`, `release_decision`, and any `rri_t_gate` / `rri_ux_gate` / `rri_ui_gate` produced by sub-skills).
- Keyword detector extended with sub-skill routes: `rri-t`, `rri-ux`, `rri-ui`, `ui-design-pipeline`, `flow-physics(-critique|-test)?`. The orchestrator keyword still wins when both are present.
- Vietnamese locale opt-in (`OMC_LOCALE=vi` env var or `--locale vi` flag) surfaces overlays under `locale/vi/` (agents + skill + Vietnamese anti-pattern checklist).

### Phase 2 pipeline map (additions)

| # | Stage | Skill / Agent | Artifact |
|---|-------|---------------|----------|
| 4b | RRI-UX (pre-design critique) | `vibecodekit-hybrid-rri-ux` → `rri-ux-critic` | `.omc/research/vibecodekit-hybrid-rri-ux-<slug>.md` + `rri_ux_gate` |
| 6b | RRI-T (adversarial QA) | `vibecodekit-hybrid-rri-t` → `rri-tester` | `.omc/verify/vibecodekit-hybrid-rri-t-<slug>.md` + `rri_t_gate` |
| — | RRI-UI (composed pipeline) | `vibecodekit-hybrid-rri-ui` (5 phases, wraps `-rri-ux` + `-rri-t`) | `.omc/design/vibecodekit-hybrid-rri-ui-<slug>.md` + `rri_ui_gate` |

### Deliverables JSON contract

`vibecodekit-hybrid-verify` is the single writer of the overall release decision. Expected shape:

```json
{
  "slug": "<slug>",
  "verify_gate": "🟢|🟡|🔴",
  "verdict_counts": { "pass": 0, "fail": 0, "painful": 0, "missing": 0 },
  "release_decision": "SHIP|SHIP_WITH_FOLLOWUPS|DO_NOT_SHIP",
  "rri_t_gate": "🟢|🟡|🔴",
  "rri_ux_gate": "🟢|🟡|🔴",
  "rri_ui_gate": "🟢|🟡|🔴",
  "artifact": ".omc/plans/vibecodekit-hybrid-verify-<slug>.md"
}
```

## What Phase 3 delivers (this PR)

- **CLI surface** `omc vibecodekit` (Node, Commander-based) with four subcommands:
  - `scaffold <slug> [--locale en|vi]` — creates the canonical `.omc/{research,specs,plans,design,verify}/` skeleton and seeds `.omc/deliverables.json`.
  - `status [<slug>]` — reads and pretty-prints the current release gate from `.omc/deliverables.json`.
  - `patterns` — lists the 10 vision patterns bundled under `templates/vibecodekit-hybrid/vision-patterns/`.
  - `locales` — lists available locale overlays under `locale/`.
  - `help` — usage (default when no subcommand is provided).
- **Marketplace preset entry** under `.claude-plugin/marketplace.json`. The plugin tags are extended with `vibecodekit`, `rri`, `vietnamese`; a new `presets` block advertises `vibecodekit-hybrid` with its entry skill, docs pointer, CLI surface, bundled skills, agents, and templates directory.
- **Migration guide** at `docs/VIBECODEKIT-MIGRATION.md` covering pre-vibecodekit → Phase 1 → Phase 2 → Phase 3, with rollback steps and an agent/skill count matrix.
- **Worked examples** under `examples/vibecodekit-hybrid/`:
  - `landing-vn/` — Vietnamese yoga-studio landing page (locale=vi, pattern=landing, gate=🟡 → SHIP_WITH_FOLLOWUPS).
  - `saas-enterprise-module/` — invoice module for a VN Enterprise SaaS (locale=vi, pattern=enterprise-module, all three RRI gates green → SHIP).
- **SCAN locale auto-detection** (`vibecodekit-hybrid-scan/SKILL.md`) with a deterministic signal ladder: `.omc/locale.json` override → `OMC_LOCALE` env → `--locale` flag → README diacritic-density heuristic (window > 8 %) → manifest heuristic (`package.json` / `pyproject.toml` / `Cargo.toml` description fields) → default `en`. The winning signal + evidence snippet is recorded in section 8 of the scan report template, and a non-default locale is echoed back to the orchestrator so downstream stages inherit it without an explicit flag.
- **PDF-export fixtures for the RRI-T Vietnamese rubric** at `templates/vibecodekit-hybrid/fixtures/pdf-unicode/`. 8 canonical probe strings (`PDF-VN-01` … `PDF-VN-08`) in both `README.md` and machine-readable `probes.json`, with `fail_if_missing` flags to distinguish identity/legal fields (FAIL if garbled) from cosmetic diacritic loss (PAINFUL).

### Phase 3 CLI surface

```bash
# Scaffold artifact skeleton (no Claude session needed)
omc vibecodekit scaffold checkout-flow
omc vibecodekit scaffold landing-vn --locale vi

# Inspect the current release gate
omc vibecodekit status

# Discover patterns and locales
omc vibecodekit patterns
omc vibecodekit locales
```

The CLI only manages on-disk state — the actual pipeline still runs inside a Claude Code session via `/oh-my-claudecode:vibecodekit-hybrid`.

### Locale auto-detection signal ladder

| Priority | Signal | Source | Notes |
|----------|--------|--------|-------|
| 1 | `omc-locale-json` | `.omc/locale.json` `{ "locale": "vi" }` | Explicit override, always wins |
| 2 | `env:OMC_LOCALE` | Env var | Survives across sessions for a given shell |
| 3 | `flag:--locale` | Orchestrator CLI / invocation flag | Per-run override |
| 4 | `readme-heuristic` | `README.md` (fallback `README.vi.md`) | `vowels_with_VN_diacritic / total_vowels > 0.08` in any 400-char window |
| 5 | `manifest-heuristic` | `package.json` / `pyproject.toml` / `Cargo.toml` | Vietnamese diacritic in description / author / keywords |
| 6 | `default` | — | English |

## What Phase 4f delivers (this PR)

Phase 4f promotes two pieces of state from "skill-only" to **first-class runtime citizens** of the OMC TypeScript core, without breaking backward compatibility:

- **Runtime locale resolver** `src/lib/vibecodekit-locale.ts` — exports `resolveVibecodekitLocale(cwd?, env?)` and `getVibecodekitLocale()`. Implements a narrower, deterministic signal ladder than the SCAN-stage one (runtime must never do filesystem heuristics per render):
  1. `.omc/locale.json` explicit override
  2. `OMC_LOCALE` env var
  3. Default (`en`)

  Supported locales normalise POSIX-style forms (e.g. `vi_VN.UTF-8 → vi`). Unsupported locales fall through — they never silently change behaviour.
- **Release-gate HUD reader** `src/hud/omc-state.ts :: readVibecodekitGateForHud(cwd)` — parses `.omc/deliverables.json` safely (malformed JSON, missing fields, out-of-range counts → `null` or zero, never a throw). Mirrors the contract used by `readAutopilotStateForHud` / `readPrdStateForHud`.
- **HUD element** `src/hud/elements/vibecodekit-gate.ts` — opt-in element that surfaces the current release gate directly on the statusline:

  | Verdict | Format |
  |---------|--------|
  | `SHIP` | `🟢 VK:SHIP 36P` |
  | `SHIP_WITH_FOLLOWUPS` | `🟡 VK:FOLLOWUPS 2⚠` |
  | `DO_NOT_SHIP` | `🔴 VK:DO_NOT_SHIP 3❌` |

  The element is *off by default* (`elements.vibecodekitGate = false / undefined`) so existing HUD presets are untouched. Enable it in `.claude/omc.jsonc` by adding `"vibecodekitGate": true` under `omcHud.elements`. The default element order places it right after `prd`.
- **CLI `status` enhancement** — `omc vibecodekit status` now adds a `locale_signal` line showing which signal the runtime picked (`omc-locale-json` / `env:OMC_LOCALE` / `default`) alongside the resolved locale, so the CLI matches what the HUD sees.
- **Tests** — 24 new unit tests (9 for the locale resolver, 7 for the gate reader, 8 for the HUD element), all green on Node 20 / vitest.

### Enabling the gate HUD element

```jsonc
// .claude/omc.jsonc
{
  "omcHud": {
    "elements": {
      "vibecodekitGate": true
    }
  }
}
```

Then run the pipeline once so `vibecodekit-hybrid-verify` writes `.omc/deliverables.json`; the HUD picks up the gate on the next render.

### Locale override (runtime)

```bash
# Persistent per-project override — survives across sessions + CI
echo '{ "locale": "vi" }' > .omc/locale.json

# One-shot override for this shell
export OMC_LOCALE=vi

# Verify what the runtime sees
omc vibecodekit status
# →   locale_signal    : omc-locale-json (resolved=vi)
```

## What Phase 4b delivers (this PR)

Phase 4b expands the Vision-stage pattern library from 7 to 10 canonical patterns. No runtime change — pure templates + skill metadata + tests + docs.

- `templates/vibecodekit-hybrid/vision-patterns/mobile-app.md` — native / cross-platform mobile app pattern. Emphasises offline-tolerant state, one-handed reach, platform conventions, crash + OTA update story. Default stack: React Native (Expo) or Flutter + MMKV/SQLite + TanStack Query.
- `templates/vibecodekit-hybrid/vision-patterns/cli-tool.md` — pipe-first command-line tool pattern. Stable exit codes, `--json` / `--quiet` / `--verbose`, `NO_COLOR` respect, XDG config, shell completion, `isatty(stdout)` awareness. Default stack: Go (single static binary) or Rust (clap + anyhow).
- `templates/vibecodekit-hybrid/vision-patterns/data-pipeline.md` — batch / streaming data pipeline pattern. Idempotent tasks, raw/curated zones, DQ gates, DLQ, schema-drift alarms, backfill runbook. Default stack: Airflow / Prefect / Dagster + dbt / Spark + Iceberg/Delta.
- `skills/vibecodekit-hybrid-vision/SKILL.md` — argument-hint + description upgraded to list all 10 patterns; pattern-inference hints (mobile → `mobile-app`, DAG → `data-pipeline`, subcommand → `cli-tool`) added to the Execution Policy.
- `src/cli/vibecodekit.ts` — help text now says "10 vision patterns".
- `src/__tests__/vibecodekit-vision-patterns.test.ts` — 30 tests asserting each of the 3 new patterns has the same section spine as the existing 7 (Structural signature / Canonical layout / Default tech stack / Non-goals / Persona focus / Flow Physics / Acceptance skeleton) + domain smoke checks (mobile-app mentions offline, cli-tool mentions exit codes + JSON, data-pipeline mentions idempotency + DLQ).
- `src/cli/__tests__/vibecodekit.test.ts` — new assertion block proving `omc vibecodekit patterns` lists `mobile-app` / `cli-tool` / `data-pipeline`.

Pattern-inference cheat sheet:

| Signal | Pattern |
|--------|---------|
| iOS / Android / React Native / Flutter / "app" | `mobile-app` |
| `--help` / subcommands / stdin pipe | `cli-tool` |
| DAG / Airflow / dbt / Kafka / ETL | `data-pipeline` |
| Plugin inside host app | `enterprise-module` |
| Authenticated + billing | `saas` |
| Analytics console | `dashboard` |
| Public long-form content | `blog` |
| Personal showcase | `portfolio` |
| Marketing site | `landing` |

## What Phase 4a delivers (this PR)

Phase 4a turns the release gate written by `vibecodekit-hybrid-verify` into a real GitHub Check Run:

- `.github/workflows/vibecodekit-gate.yml` — runs on every PR that touches `.omc/deliverables.json`, the workflow itself, or the check script. Also triggers manually (`workflow_dispatch`).
- `scripts/vibecodekit-gate-check.mjs` — dependency-free Node script that reads `.omc/deliverables.json` and produces a structured verdict + a GitHub step summary:

  | Verdict | CI conclusion | Exit code | Default behaviour |
  |---------|---------------|-----------|-------------------|
  | 🟢 `SHIP` | `success` | 0 | Merge allowed |
  | 🟡 `SHIP_WITH_FOLLOWUPS` | `neutral` | 0 | Merge allowed, follow-ups tracked |
  | 🔴 `DO_NOT_SHIP` | `failure` | 1 | Merge blocked |
  | *(file absent)* | `neutral` | 0 | No-op — never blocks non-vibecodekit repos |

  Flip `workflow_dispatch.inputs.strict=true` (or set env `VCK_STRICT=1`) to also fail on 🟡.
- Step summary is a compact table rendered on the PR check: gate glyph, release decision, slug, verdict counts, and RRI sub-gates (RRI-T / RRI-UX / RRI-UI).
- 9 smoke tests under `src/__tests__/vibecodekit-gate-check.test.ts` that execute the script as a subprocess and inspect stdout + `GITHUB_STEP_SUMMARY` output across 🟢 / 🟡 / 🔴 / strict / absent / malformed / custom-path / env-override paths.

### Using the check locally

```bash
# Read .omc/deliverables.json in the current repo and print the verdict
node scripts/vibecodekit-gate-check.mjs

# Strict mode — 🟡 also exits 1
node scripts/vibecodekit-gate-check.mjs --strict

# JSON mode — machine-readable decision record
node scripts/vibecodekit-gate-check.mjs --json

# Custom path (for multi-project repos or CI with non-standard layout)
node scripts/vibecodekit-gate-check.mjs --path subapp/.omc/deliverables.json
```

## What Phase 4c delivers (this PR)

Phase 4c stops `.omc/deliverables.json` schema drift before it reaches CI:

- `templates/vibecodekit-hybrid/deliverables.schema.json` — JSON Schema (draft-07) for the deliverable. Pins:
  - `slug` lowercase-kebab pattern, `locale ∈ {en, vi, ja}`, `pattern` ∈ the 10 vision patterns + `null`.
  - `verify_gate` and the four `rri_*_gate` fields constrained to `🟢|🟡|🔴` (or `null`).
  - `release_decision ∈ {SHIP, SHIP_WITH_FOLLOWUPS, DO_NOT_SHIP, null}`.
  - `verdict_counts` shape (`pass|fail|painful|missing`, all non-negative integers).
  - `artifact` must live under `.omc/`, `updated_at` must be ISO-8601 UTC.
  - `additionalProperties: false` everywhere — adding an unknown field fails validation, surfacing schema drift loudly.
  - Conditional rule: `release_decision ∈ {SHIP_WITH_FOLLOWUPS, DO_NOT_SHIP}` requires a non-empty `followups` array.
- `src/lib/vibecodekit-deliverables.ts` — Ajv-backed validator (`validateDeliverablesObject`, `validateDeliverablesFile`) reused by the CLI and any future runtime check.
- `omc vibecodekit validate [<path>]` — CLI wrapper that prints `OK <path>` on pass, lists every violation with its JSON pointer on fail, and uses canonical exit codes (`0` pass, `1` schema fail, `2` missing/unparseable). Drop into the Phase 4a Check Run as an extra step:

  ```bash
  node bridge/cli.cjs vibecodekit validate
  ```
- 14 validator unit tests + 3 CLI smoke tests covering: valid SHIP/SHIP_WITH_FOLLOWUPS shapes, freshly scaffolded null-gate shape, malformed slug/locale/pattern/decision, missing follow-ups when required, unknown top-level keys, malformed timestamp, and missing/unparseable files.

### Using the validator locally

```bash
# Validate the current run
omc vibecodekit validate

# Validate a worked example from the repo
omc vibecodekit validate examples/vibecodekit-hybrid/landing-vn/deliverables.json

# Use it as a pre-commit hook
echo 'omc vibecodekit validate' >> .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## What is still out of scope

Phase 4a / 4c / 4f deliberately stop at the read-only HUD + CI surface. Future phases could:

- Convert the Vietnamese persona banks into a standalone Claude skill plugin.
- Add a hook surface that blocks `git push` when the gate is 🔴 (opt-in, client-side).
- Add a web-dashboard surface for the release gate.

## Attribution

Adapted from Vibecodekit v5.0 (Contractor–Worker Protocol) and the RRI methodology family (RRI, RRI-T, RRI-UI, RRI-UX) by Nguyễn (VagabondKingsman). Integrated as an OMC skill-pack across Phases 1–3; Phase 4f is the first runtime TypeScript integration and is still opt-in.
