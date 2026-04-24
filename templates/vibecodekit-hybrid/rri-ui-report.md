# RRI-UI Report — {{slug}}

> Artifact written by `vibecodekit-hybrid-rri-ui`.
> Composes RRI-UX (pre-design critique) with RRI-T D1 (post-design testing).

## 1. Release Gate Decision

| Criterion | Status |
|-----------|:------:|
| Every U1–U7 UX dimension ≥ 70% |  |
| ≥ 5 of 7 UX dimensions ≥ 85% |  |
| Zero P0 items at ❌ BROKEN or ❌ FAIL |  |
| Vietnamese checklist 12/12 (when `OMC_LOCALE=vi`) |  |
| Responsive at 375 / 768 / 1440 px |  |
| Anti-pattern checklist 0/12 violations |  |

**Decision:** 🟢 UI APPROVED · 🟡 Conditional · 🔴 Block

## 2. Phase Ledger

| Phase | Duration | Artifact | Owner |
|-------|----------|----------|-------|
| 0 Setup (tokens + constraints) | ≤ 1 day | `.omc/design/vibecodekit-hybrid-rri-ui-{{slug}}-phase0.md` | this skill |
| 1 UX Critique (pre-design) | 2–3 days | `.omc/research/vibecodekit-hybrid-rri-ux-{{slug}}.md` | `rri-ux-critic` |
| 2 UI Design | 3–5 days | design system repo / Figma / staging URL | `designer` |
| 3 UI Testing (D1 + support) | 2–3 days | `.omc/verify/vibecodekit-hybrid-rri-t-{{slug}}.md` | `rri-tester` |
| 4 Measure & Gate | ≤ 1 day | this file | this skill |
| 5 Handoff | continuous | completion reports | `executor` / `qa-tester` |

## 3. Design Tokens (Phase 0)

- **Font:** ≥ 14 px body · line-height ≥ 1.5 (Vietnamese diacritics intact)
- **Touch target:** ≥ 44 × 44 px on mobile
- **Color contrast:** WCAG 2.1 AA (4.5 : 1 text, 3 : 1 large text)
- **Spacing:** 4 / 8 px grid
- **VN text buffer:** +30% width allowance on every container

## 4. Critical User Paths

1.
2.
3.

## 5. Mandatory UI Rules — per-screen audit

| Screen | Flow downstream | Sticky CTA | Progressive disclosure | Instant feedback | VN buffer |
|--------|:---------------:|:----------:|:----------------------:|:----------------:|:---------:|
|        |                 |            |                        |                  |           |

## 6. UX Coverage (from Phase 1 RRI-UX)

_Summary of the top-level UX Coverage Matrix; full detail in the linked RRI-UX artifact._

## 7. UI Test Coverage (from Phase 3 RRI-T D1)

_Summary of the Module × D1 coverage plus any supporting dimensions; full detail in the linked RRI-T artifact._

## 8. Anti-Pattern Checklist (0/12 target)

- [ ] Scroll-back-to-continue
- [ ] CTA off-screen on long content
- [ ] Decision overload (> 5 primary actions)
- [ ] Form > 7 fields without wizard/accordion
- [ ] Dropdown > 15 items without search
- [ ] Silent failure (no loading / error state)
- [ ] Destructive action without undo
- [ ] Context loss on tab/back navigation
- [ ] Hidden disabled state (no affordance why)
- [ ] Inconsistent primary-button styling
- [ ] Vietnamese text truncated without tooltip
- [ ] Mobile primary action out of thumb zone

## 9. Handoff

- UI APPROVED → `executor` (implementation) with this artifact as the design source of truth.
- UI CONDITIONAL → block-listed issues routed to `designer` / `rri-ux-critic`.
- UI BLOCKED → return to Phase 1 with explicit scope for re-critique.
