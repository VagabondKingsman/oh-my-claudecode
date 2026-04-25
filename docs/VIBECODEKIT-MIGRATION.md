# Vibecodekit Hybrid — Migration Guide

This guide walks you through upgrading an OMC checkout between the vibecodekit-hybrid phases (1, 2, 3, 4f). All phases are additive — nothing installed in an earlier phase is removed later. You can stop at any phase if you only need that surface.

## At-a-glance

| Surface | Phase 1 | Phase 2 | Phase 3 | Phase 4f |
|---------|--------|--------|--------|---------|
| Skills | `vibecodekit-hybrid`, `-scan`, `-rri`, `-vision`, `-verify` (5) | + `-rri-t`, `-rri-ux`, `-rri-ui` (8) | unchanged (8) | unchanged (8) |
| Agents | `rri-interviewer` (1) | + `rri-tester`, `rri-ux-critic` (3) | unchanged (3) | unchanged (3) |
| Templates | scan-report, tip, completion-report, blueprint, verify-report, 7 vision patterns (13) | + rri-t-report, rri-ux-report, rri-ui-report (16) | + PDF-export fixtures (16 + fixtures dir) | unchanged |
| CLI | none | none | `omc vibecodekit {scaffold,status,patterns,locales,help}` | + `locale_signal` line in `status` |
| Locale | EN only | `OMC_LOCALE=vi` overlay | + auto-detect VN-first project from SCAN | + runtime resolver `src/lib/vibecodekit-locale.ts` (HUD + CLI share one ladder) |
| Marketplace | plugin entry only | plugin entry only | preset entry `vibecodekit-hybrid` with metadata | unchanged |
| Release gate | 4-level verdict in verify-report.md | 4-level verdict aggregated into `.omc/deliverables.json` | unchanged | + HUD element `vibecodekitGate` (opt-in) reads the same file |
| Runtime TS | none | none | CLI scaffold only | `src/lib/vibecodekit-locale.ts`, `src/hud/omc-state.ts :: readVibecodekitGateForHud`, `src/hud/elements/vibecodekit-gate.ts` (24 new tests) |

## From pre-vibecodekit → Phase 1

If you are coming from a bare OMC install (no vibecodekit skills yet):

1. Pull the latest `main` — Phase 1 is already merged.
2. Confirm the orchestrator is present: `ls skills/vibecodekit-hybrid/SKILL.md`.
3. Try a dry run inside Claude Code:
   ```
   /oh-my-claudecode:vibecodekit-hybrid "build me a landing page for a yoga studio"
   ```
4. The pipeline stops at the `APPROVED` gate by default (`--interactive`). Inspect the Blueprint at `.omc/plans/vibecodekit-hybrid-<slug>.md` before approving.

## From Phase 1 → Phase 2

Phase 2 adds adversarial QA, Flow-Physics UX critique, and a composed UI design pipeline.

1. Pull the branch / PR that introduces Phase 2 (PR #2 in this repo).
2. Confirm the new skills:
   ```
   ls skills/ | grep vibecodekit-hybrid-rri
   # should list -rri, -rri-t, -rri-ux, -rri-ui
   ```
3. Confirm the new agents are registered in the TypeScript surface:
   ```
   grep -E "rri-tester|rri-ux-critic" src/agents/definitions.ts
   ```
4. Run `npm run build && npm test` once — the full test suite must pass (22 agents, 41 canonical skill names).
5. Optionally, enable the Vietnamese overlay:
   ```bash
   export OMC_LOCALE=vi
   ```
   then invoke any vibecodekit skill. The 12-item Vietnamese anti-pattern checklist activates automatically. Persona banks switch to the Vietnamese variants under `locale/vi/agents/*.vi.md`.
6. When the pipeline finishes, inspect the machine-readable release gate:
   ```
   cat .omc/deliverables.json
   ```
   It should contain `verify_gate`, `verdict_counts`, `release_decision`, and any `rri_t_gate` / `rri_ux_gate` / `rri_ui_gate` the sub-skills produced.

## From Phase 2 → Phase 3

Phase 3 introduces the CLI, marketplace preset, auto-detection of Vietnamese projects at SCAN time, worked examples, and PDF-export fixtures for RRI-T.

1. Pull the branch / PR that introduces Phase 3 (PR #3 in this repo).
2. Rebuild the CLI: `npm run build`.
3. Confirm the `omc vibecodekit` command is wired:
   ```bash
   omc vibecodekit help
   ```
4. Scaffold artifacts outside of Claude:
   ```bash
   omc vibecodekit scaffold checkout-flow
   omc vibecodekit scaffold landing-vn --locale vi
   ```
   Each run creates the canonical `.omc/{research,specs,plans,design,verify}/` skeleton plus `.omc/deliverables.json`.
5. Inspect the release gate without opening Claude Code:
   ```bash
   omc vibecodekit status
   ```
6. Browse available vision patterns and locales:
   ```bash
   omc vibecodekit patterns
   omc vibecodekit locales
   ```
7. To detect Vietnamese projects automatically (without explicitly passing `--locale vi`), leave `OMC_LOCALE` unset. `vibecodekit-hybrid-scan` now inspects:
   - `README.md` (vowel-with-diacritic ratio > 8% over a sliding window)
   - `package.json` `description` / `author` for Vietnamese characters
   - `.omc/locale.json` `{ "locale": "vi" }` (explicit override)

   If any signal fires, the rest of the pipeline runs as if `--locale vi` were passed.
8. Worked examples live under `examples/vibecodekit-hybrid/`:
   - `landing-vn/` — landing page for a Vietnamese yoga studio.
   - `saas-enterprise-module/` — invoice module for a VN Enterprise SaaS.
9. PDF-export fixtures for the RRI-T Vietnamese rubric live under `templates/vibecodekit-hybrid/fixtures/pdf-unicode/`. Copy the manifest when you run Phase 6b (`vibecodekit-hybrid-rri-t`) on a project that emits PDFs.

## From Phase 3 → Phase 4f

Phase 4f wires vibecodekit's release gate and locale resolution directly into the OMC TypeScript runtime (HUD + shared `lib/`). Everything remains opt-in so existing HUD presets are unchanged.

1. Pull the branch / PR that introduces Phase 4f (PR #4 in this repo).
2. Rebuild: `npm run build && npm test -- --run`. The suite gains 24 tests (total 8434 passed / 8 skipped on the reference setup).
3. **(Optional) Enable the HUD release gate**. Edit `.claude/omc.jsonc` and set:
   ```jsonc
   {
     "omcHud": {
       "elements": {
         "vibecodekitGate": true
       }
     }
   }
   ```
   After `vibecodekit-hybrid-verify` writes `.omc/deliverables.json`, the HUD picks up the current gate on the next render:
   ```
   … 🟢 VK:SHIP 36P …
   … 🟡 VK:FOLLOWUPS 2⚠ …
   … 🔴 VK:DO_NOT_SHIP 3❌ …
   ```
4. **(Optional) Make locale sticky per project**. Instead of exporting `OMC_LOCALE=vi` in every shell, write the locale once:
   ```bash
   mkdir -p .omc
   echo '{ "locale": "vi" }' > .omc/locale.json
   ```
   The runtime resolver (HUD, CLI, any future consumers) reads this first. It also survives across CI agents, and doesn't leak into unrelated projects.
5. Verify what the runtime sees:
   ```bash
   omc vibecodekit status
   # prints a new line:
   #   locale_signal    : omc-locale-json (resolved=vi)
   ```
6. If you consume the resolver programmatically, import it like any other util:
   ```ts
   import { resolveVibecodekitLocale } from 'oh-my-claudecode/lib/vibecodekit-locale';
   const { locale, signal } = resolveVibecodekitLocale();
   ```

## Breaking changes between phases

**None.** Phase 2, Phase 3, and Phase 4f are strictly additive. Existing skills, agent names, prompts, templates, and artifacts all continue to work. `HudRenderContext.vibecodekitGate` is optional, so existing HUD mocks/presets compile without modification.

If you maintain a vendored copy of OMC and pin agent counts elsewhere, the expected numbers are:

| Metric | Phase 1 | Phase 2 | Phase 3 | Phase 4f |
|--------|---------|---------|---------|----------|
| Agents | 20 | 22 | 22 | 22 |
| Canonical skills | 38 | 41 | 41 | 41 |
| Skills including aliases | 39 | 42 | 42 | 42 |
| Passing tests | 8 394 | 8 400 | 8 410 | 8 434 |

## Rollback

If you need to roll back to a previous phase, revert the relevant merge commit. Because each phase lives in its own PR, a revert is a single-PR operation.

Local cleanup after a rollback:
```bash
rm -f .omc/deliverables.json
rm -rf .omc/verify .omc/design        # safe: these are scratch artifacts
```
