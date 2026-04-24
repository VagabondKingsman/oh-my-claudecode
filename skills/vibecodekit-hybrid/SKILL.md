---
name: vibecodekit-hybrid
description: Contractor–Worker pipeline combining Vibecodekit v5 methodology with OMC runtime (SCAN → RRI → VISION → BLUEPRINT → BUILD → VERIFY → REFINE)
argument-hint: "[--interactive] [--pattern landing|saas|dashboard|blog|portfolio|enterprise-module|custom] [--locale en|vi] [--auto] <idea>"
pipeline: [vibecodekit-hybrid-scan, vibecodekit-hybrid-rri, vibecodekit-hybrid-vision, ralplan, autopilot, vibecodekit-hybrid-verify, ai-slop-cleaner]
next-skill: vibecodekit-hybrid-scan
handoff: .omc/research/vibecodekit-hybrid-scan-*.md
level: 4
---

<Purpose>
Vibecodekit Hybrid is the top-level orchestrator for building software with the Vibecodekit v5 contractor–worker methodology (Homeowner ↔ Contractor ↔ Worker) while using OMC's existing primitives for execution. It chains SCAN → RRI → VISION → BLUEPRINT → BUILD → VERIFY → REFINE, delegating each stage to a focused skill or agent. The skill does NOT replace `autopilot`, `ralph`, or `team` — it composes them and adds the structured checkpoints (Blueprint APPROVED gate, RRI traceability, 4-level verdict) that Vibecodekit v5 introduces.
</Purpose>

<Use_When>
- User wants an end-to-end build with requirements discovery AND structured checkpoints ("vibecodekit", "vibecode", "chủ thầu", "contractor mode")
- Project is ambiguous enough that jumping straight to `autopilot` would waste cycles on scope discovery
- User wants a Blueprint they can review + approve before BUILD starts
- User asks for 5-persona RRI requirements capture (End User / BA / QA / Dev / DevOps)
- Locale is Vietnamese AND the user wants Vietnamese UX patterns captured as requirements (Phase 2 extends this)
</Use_When>

<Do_Not_Use_When>
- Task is a single focused fix with obvious scope → use `ralph`, executor, or direct edit
- User has already produced a Blueprint or a consensus plan → jump to `autopilot` or `team`
- Request is analysis / exploration only → use `explore`, `deep-interview`, or `omc-plan`
- User explicitly wants `autopilot` without a gate → respect that and use `autopilot`
</Do_Not_Use_When>

<Why_This_Exists>
Autopilot is optimised for speed; it assumes the goal is clear. Many real projects are NOT clear at the start — they need a persona-driven interview, a named vision pattern, and a reviewed blueprint before any code is written. Vibecodekit v5 codifies this flow as "Homeowner ↔ Contractor ↔ Worker"; this skill wires that flow into OMC's existing skill graph so users get both the methodology and the runtime (hooks, state, multi-agent, multi-provider) in one invocation.
</Why_This_Exists>

<Execution_Policy>
- Default is `--interactive`: stop at the APPROVED gate after BLUEPRINT and wait for the user's explicit "APPROVED" before BUILD.
- `--auto` runs straight through without the APPROVED gate — only use when the user has written "auto" / "fullsend" / "autopilot" in their request.
- Each stage writes an artifact under `.omc/research/`, `.omc/specs/`, or `.omc/plans/`. Later stages MUST read the previous artifact and MUST NOT re-ask answered questions.
- Delegate to the most specialised sub-skill per stage; do NOT inline its logic. This keeps sub-skills independently invocable.
- Respect OMC's model routing: scan → haiku, RRI → sonnet, vision → sonnet, blueprint review → opus (via `ralplan`), build → sonnet (or opus for hard parts), verify → opus.
- Never silently skip a stage. If a stage's artifact is missing, run the corresponding sub-skill before proceeding.
</Execution_Policy>

<Steps>

### Stage 0 — Classify the request
1. Detect locale (`--locale` flag > project README language > `OMC_LOCALE` env).
2. Detect interactive vs auto mode (`--interactive` default, `--auto` opt-in).
3. Detect candidate vision pattern (`--pattern` flag, else let VISION stage decide).
4. Allocate a slug: `<short-kebab-idea>` derived from the user's request.

### Stage 1 — SCAN (delegate to `vibecodekit-hybrid-scan`)
- Invoke `Skill("oh-my-claudecode:vibecodekit-hybrid-scan")` with the slug.
- Required artifact: `.omc/research/vibecodekit-hybrid-scan-<slug>.md` (structure defined in `templates/vibecodekit-hybrid/scan-report.md`).
- If the scan reports the repo is greenfield, skip gap/health fields but still produce the report.

### Stage 2 — RRI (delegate to `vibecodekit-hybrid-rri`)
- Invoke `Skill("oh-my-claudecode:vibecodekit-hybrid-rri")` with the slug + `--mode` (auto-detected from user signal).
- Required artifact: `.omc/specs/vibecodekit-hybrid-rri-<slug>.md` (Requirements Matrix + Decisions Log + Open Questions).
- RRI MUST NOT re-ask questions already answered by SCAN.

### Stage 3 — VISION (delegate to `vibecodekit-hybrid-vision`)
- Invoke `Skill("oh-my-claudecode:vibecodekit-hybrid-vision")` with the slug + `--pattern` (or let the skill detect).
- Required artifact: vision section appended to the Blueprint template, with the selected pattern file copied as reference.

### Stage 4 — BLUEPRINT (delegate to `ralplan`)
- Invoke `Skill("oh-my-claudecode:ralplan")` to run Planner → Architect → Critic consensus on the Blueprint.
- Input: the scan + RRI + vision artifacts.
- Output: `.omc/plans/vibecodekit-hybrid-<slug>.md` conforming to `templates/vibecodekit-hybrid/blueprint.md`, including the **RRI Requirements Matrix** and **Task Decomposition Preview**.

### Stage 5 — APPROVED gate (only in `--interactive`)
- Use `AskUserQuestion` with three options:
  - **APPROVED** — proceed to BUILD
  - **Request changes** — loop back to ralplan with user notes
  - **Reject** — stop, save the blueprint, exit
- Do NOT proceed to BUILD unless the user explicitly chose APPROVED.
- In `--auto` mode, skip the gate; the Blueprint is treated as approved by default.

### Stage 6 — BUILD (delegate to `autopilot` or `team`)
- Prefer `team` when the Task Decomposition Preview shows ≥ 3 independent tasks (run in parallel).
- Else use `autopilot` (or `ralph` if the user asked for persistence).
- Each delegated task MUST be handed off using a TIP (`templates/vibecodekit-hybrid/tip.md`).
- Each worker MUST return a Completion Report (`templates/vibecodekit-hybrid/completion-report.md`).

### Stage 7 — VERIFY (delegate to `vibecodekit-hybrid-verify`)
- Invoke `Skill("oh-my-claudecode:vibecodekit-hybrid-verify")` with the blueprint path.
- Required artifact: `.omc/plans/vibecodekit-hybrid-verify-<slug>.md` conforming to `templates/vibecodekit-hybrid/verify-report.md`.
- Verdict uses 4 levels: PASS ✅ / FAIL ❌ / PAINFUL ⚠️ / MISSING 🔲.

### Stage 8 — REFINE (delegate to `ai-slop-cleaner`)
- Only run if VERIFY produced any PAINFUL / MISSING rows, OR the user explicitly requested a cleanup pass.
- `ai-slop-cleaner` is bounded by the Blueprint — REFINE MUST NOT change the agreed layout, tech stack, or public API. A change to those concerns reopens VISION / BLUEPRINT, not REFINE.

### Stage 9 — Final hand-off
- Summarise to the user in ≤ 10 lines:
  - Blueprint path
  - Verify verdict
  - Follow-up tasks (if any)
  - Preview URL (if the project has one)
</Steps>

<Handoff_Contract>
- Upstream input: raw user idea + optional flags.
- Downstream artifacts (all persisted):
  - `.omc/research/vibecodekit-hybrid-scan-<slug>.md`
  - `.omc/specs/vibecodekit-hybrid-rri-<slug>.md`
  - `.omc/plans/vibecodekit-hybrid-<slug>.md` (Blueprint)
  - `.omc/plans/vibecodekit-hybrid-verify-<slug>.md` (Verify Report)
- Downstream skill invocations: `vibecodekit-hybrid-scan`, `vibecodekit-hybrid-rri`, `vibecodekit-hybrid-vision`, `ralplan`, `autopilot` or `team`, `vibecodekit-hybrid-verify`, `ai-slop-cleaner` (conditional).
</Handoff_Contract>

<Final_Checklist>
- [ ] All 4 artifacts exist for the slug
- [ ] Blueprint was `APPROVED` by the user (or `--auto` was explicitly set)
- [ ] VERIFY report produced with 4-level verdicts
- [ ] No PAINFUL / MISSING rows left unaddressed, or each has a follow-up TIP filed
- [ ] Summary delivered to the user with artifact paths
</Final_Checklist>

<Advanced>
## Mapping to Vibecodekit v5 Golden Principles
1. **Contractor–Worker Protocol** → realised via `vibecodekit-hybrid` (contractor) + delegated sub-skills / agents (workers).
2. **Propose first, ask second** → enforced by the `rri-interviewer` agent (AskUserQuestion with 2-4 options, never open-ended).
3. **Executable specifications** → Gherkin acceptance criteria baked into TIP template.
4. **Bidirectional feedback** → Completion Reports ↔ Verify Report close the loop back to the Blueprint.
5. **Blueprint as contract** → the APPROVED gate + `templates/vibecodekit-hybrid/blueprint.md` schema.
6. **Continuous RRI** → VERIFY runs the same 5 personas in reverse to catch regressions.

## Relationship to existing OMC skills
- `autopilot`: this skill can call autopilot for the BUILD stage only.
- `ralph`: use instead of autopilot for long-running persistence.
- `team`: use instead of autopilot when Task Decomposition Preview has ≥ 3 parallelisable tasks.
- `deep-interview`: lower-level Socratic interview. `rri-interviewer` is higher-level (5 fixed personas). The two can be composed, but do not duplicate question banks.
- `ralplan`: used directly as the Blueprint consensus engine.
- `ai-slop-cleaner`: used in REFINE, bounded by the Blueprint.

## Locale behaviour
- Markdown headings and section names: always English.
- User-facing prompts and artifact body text: match locale.
- Vietnamese-specific UX/UI rules (VND, DD/MM/YYYY, CCCD/CMND, diacritic-insensitive search) are introduced in Phase 2 via `templates/rules/locale/vi/`. This skill declares the hook but does not enforce it yet.

## Attribution
Adapted from Vibecodekit v5.0 (Contractor–Worker Protocol) and the RRI methodology family (RRI, RRI-T, RRI-UI, RRI-UX). Integrated as an OMC skill-pack; the OMC runtime is unchanged.
</Advanced>
