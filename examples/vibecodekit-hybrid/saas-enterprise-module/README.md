# Example: `saas-enterprise-module` — Invoice module for a VN Enterprise SaaS

## Scenario

An existing Vietnamese Enterprise SaaS needs a new **Invoice** module. Requirements:

- Feature plugs into an existing app (pattern: `enterprise-module`).
- Must respect existing design tokens + navigation shell.
- Invoices support VND, multi-tenant, audit log, role-based access.
- PDF export must render Vietnamese diacritics correctly (Unicode font).
- End-to-end Contractor–Worker pipeline exercised: SCAN → RRI → VISION → BLUEPRINT → RRI-UX → BUILD → RRI-T → VERIFY.

## Invocation

```bash
# inside Claude Code (locale is auto-detected from the existing VN-first repo)
/oh-my-claudecode:vibecodekit-hybrid --pattern enterprise-module --interactive \
  "add invoice module: VND, PDF export, audit log, RBAC"

# then, for the combined UI pipeline on the invoice screen:
/oh-my-claudecode:vibecodekit-hybrid-rri-ui saas-enterprise-module --module invoice
```

Phase 3 CLI equivalent:

```bash
omc vibecodekit scaffold saas-enterprise-module --locale vi
omc vibecodekit status saas-enterprise-module
```

## Expected release gate

| Metric | Value |
|--------|-------|
| `verify_gate` | 🟢 |
| `release_decision` | `SHIP` |
| `rri_ux_gate` | 🟢 (5/7 UX dims ≥ 85 %, none < 70 %, 0 BROKEN) |
| `rri_t_gate` | 🟢 (0 FAIL; 2 PAINFUL with follow-up TIPs filed) |
| `rri_ui_gate` | 🟢 (all 6 release-gate criteria satisfied) |
| `verdict_counts` | pass=36, fail=0, painful=2, missing=0 |

## Artifact map

| Stage | File |
|-------|------|
| SCAN | `.omc/research/vibecodekit-hybrid-scan-saas-enterprise-module.md` |
| RRI | `.omc/specs/vibecodekit-hybrid-rri-saas-enterprise-module.md` |
| VISION | (section inside Blueprint) |
| BLUEPRINT | `.omc/plans/vibecodekit-hybrid-saas-enterprise-module.md` |
| RRI-UX (pre-design) | `.omc/research/vibecodekit-hybrid-rri-ux-saas-enterprise-module.md` |
| RRI-UI (design pipeline) | `.omc/design/vibecodekit-hybrid-rri-ui-saas-enterprise-module.md` |
| RRI-T (post-build QA) | `.omc/verify/vibecodekit-hybrid-rri-t-saas-enterprise-module.md` |
| VERIFY | `.omc/plans/vibecodekit-hybrid-verify-saas-enterprise-module.md` |
| Gate | `.omc/deliverables.json` |

## What this example demonstrates end-to-end

1. **SCAN auto-detects VN locale** from the repo's existing README + `package.json` description.
2. **RRI** runs 5 personas in `Guided` mode because the user is the BA; no deviations forced.
3. **Vision pattern** `enterprise-module` inherits the host app's design tokens and nav shell — the blueprint explicitly forbids changing either.
4. **RRI-UX** flags 4 FRICTION issues in the draft invoice list (over-reliance on hover-only affordances at 1440 px). All 4 resolved before BUILD.
5. **BUILD** uses `team` (4 parallel workers) since the Task Decomposition Preview has ≥ 3 independent tasks.
6. **RRI-T** runs the full 5×7×8 matrix against the invoice surface with `OMC_LOCALE=vi` implicit. Catches one PAINFUL row (PDF export strips diacritics under a stale font) and one PAINFUL row (filter state lost on tab switch). Both filed as follow-up TIPs.
7. **VERIFY** aggregates the three sub-gates plus its own into `.omc/deliverables.json` with release decision `SHIP`.

This example is the canonical reference for the claim "no Painful/Missing row is dropped silently" — every non-PASS verdict in `verify-report.md` has a corresponding entry in `followups[]` of `deliverables.json`.
