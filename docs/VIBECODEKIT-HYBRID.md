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

## The 7 vision patterns

Each pattern template in `templates/vibecodekit-hybrid/vision-patterns/` declares the canonical layout, default stack (as *suggestion*, not mandate), non-goals, persona focus, Flow Physics priorities, and an acceptance skeleton:

- `landing.md` — single-page marketing site
- `saas.md` — authenticated multi-tenant app
- `dashboard.md` — data-dense analytics surface
- `blog.md` — long-form content site
- `portfolio.md` — personal / studio showcase
- `enterprise-module.md` — feature module inside an existing enterprise app
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
- `vision-patterns/*.md` — the 7 vision patterns above

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
- `--pattern <one of landing|saas|dashboard|blog|portfolio|enterprise-module|custom>`: override auto-detection
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
- 11 templates: scan-report, tip, completion-report, blueprint, verify-report, 7 vision patterns
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

## What Phase 3 is planned to add

- CLI subcommand `omc vibecodekit`, marketplace preset, migration guide, worked examples.
- Fuller Vietnamese locale: SCAN-driven auto-detection of VN-first projects, richer VN persona banks, Unicode-font PDF export checks baked into RRI-T fixtures.

## Attribution

Adapted from Vibecodekit v5.0 (Contractor–Worker Protocol) and the RRI methodology family (RRI, RRI-T, RRI-UI, RRI-UX) by Nguyễn (VagabondKingsman). Integrated as an OMC skill-pack without modifying the OMC runtime.
