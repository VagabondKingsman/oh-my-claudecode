# Completion Report — {{TASK_ID}}

> Returned by the worker to the orchestrator. One report per TIP.

## STATUS
One of:
- `DONE` — acceptance criteria fully met
- `PARTIAL` — subset of criteria met, rest blocked
- `NEEDS_DECISION` — cannot proceed without a contractor decision
- `FAILED` — unrecoverable error

## FILES CHANGED
| Path | Action | Notes |
|------|--------|-------|
| | added / modified / deleted | |

## TEST RESULTS
| Check | Command | Result | Evidence |
|-------|---------|--------|----------|
| Build | `npm run build` | PASS / FAIL | last 20 lines |
| Unit tests | `npm test` | PASS / FAIL | summary |
| Lint | `npm run lint` | PASS / FAIL | diff or summary |
| Type | `npm run typecheck` | PASS / FAIL | diff or summary |
| Acceptance (Gherkin) | per-scenario | PASS / FAIL / PAINFUL / MISSING | link to logs |

## ACCEPTANCE CRITERIA RESULTS
Copy the Gherkin scenarios from the TIP, then annotate each with one of:
- `PASS` ✅ — criterion satisfied with evidence
- `FAIL` ❌ — criterion not satisfied
- `PAINFUL` ⚠️ — technically works but creates bad UX / maintenance cost
- `MISSING` 🔲 — criterion could not be evaluated (gap in environment, access, etc.)

## ISSUES ENCOUNTERED
For each issue: symptom, root-cause hypothesis, resolution / workaround.

## DEVIATIONS FROM SPEC
Any place where the worker intentionally diverged from the TIP. Include rationale. If unintentional, file it under ISSUES instead.

## SUGGESTIONS
Non-blocking improvements or follow-up tasks for the contractor to consider in REFINE.

## NEXT STEP RECOMMENDATION
- Proceed to next task
- Block pending contractor decision (list options here)
- Reopen upstream task (`{{TASK_ID}}`) due to …
