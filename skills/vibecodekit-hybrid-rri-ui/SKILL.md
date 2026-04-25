---
name: vibecodekit-hybrid-rri-ui
description: RRI-UI 5-phase UI design pipeline combining RRI-UX (pre-design) + RRI-T D1 (post-design) for Enterprise SaaS UI
argument-hint: "<slug> [--phase 0|1|2|3|4|5] [--module <name>]"
pipeline: [vibecodekit-hybrid-rri-ux, vibecodekit-hybrid-rri-t]
next-skill: vibecodekit-hybrid-verify
handoff: .omc/design/vibecodekit-hybrid-rri-ui-*.md
level: 3
---

<Purpose>
End-to-end UI design quality pipeline that composes `vibecodekit-hybrid-rri-ux` (critique BEFORE design) with the D1: UI/UX slice of `vibecodekit-hybrid-rri-t` (testing AFTER design). Produces a design-complete, testable UI artifact with a Release Gate decision.
</Purpose>

<Use_When>
- Project has meaningful UI scope and is about to enter UI design / re-design.
- You want a single command that runs critique-before-code + test-after-design for one module.
- Enterprise SaaS with Vietnamese-first UX constraints (longest-VN-text buffer, VND formatting, DD/MM/YYYY dates, CCCD/CMND masks).
</Use_When>

<Do_Not_Use_When>
- Project has no UI.
- You only need one side (pure UX critique → `vibecodekit-hybrid-rri-ux`; pure test → `vibecodekit-hybrid-rri-t`).
</Do_Not_Use_When>

<Why_This_Exists>
Design reviews without a critique pass fail "does this actually flow?". QA reviews without a UX pass flag failures but don't diagnose root causes. Shipping UI without both routinely produces visually-plausible screens that collapse on real user journeys (CTA off-screen, scroll-back loops, context loss across tabs, VN text overflow). RRI-UI binds the two passes into one release-gate-aware workflow.
</Why_This_Exists>

<Execution_Policy>
- Five phases run in order. Skip forward with `--phase N` when a previous phase has already produced its artifact.
- Respect locale: Vietnamese tokens and Vietnamese-specific UI patterns are mandatory when `OMC_LOCALE=vi` or the SCAN report flags VN-first.
- Never claim UI APPROVED without checking all five release criteria.
</Execution_Policy>

<Phases>
**Phase 0 — Setup (≤ 1 day)**
- Collect RRI output (requirements), existing wireframes, BA business rules, user roles, Vietnamese constraints.
- Define Design Tokens (font ≥ 14 px / line-height ≥ 1.5, 44 × 44 touch target, WCAG AA contrast, 4 / 8 px grid, ~30% VN text buffer).
- Artifact: `.omc/design/vibecodekit-hybrid-rri-ui-<slug>-phase0.md` (tokens + critical paths + VN constraints).

**Phase 1 — UX Critique Before Design (2-3 days)**
- Delegate to `vibecodekit-hybrid-rri-ux`.
- Outputs: 80-120 UX issues (S→V→P→F→I), Flow Map, Viewport Map, Anti-Pattern Checklist.

**Phase 2 — UI Design (3-5 days)**
- Component-level design that integrates Phase 1 fixes.
- Enforce the 5 mandatory UI rules on every screen (flow downstream · sticky CTA · progressive disclosure · instant feedback · Vietnamese-first).
- Inline self-check (SCROLL / CLICK DEPTH / EYE TRAVEL / DECISION / RETURN / VIEWPORT / VN TEXT / FEEDBACK) for every component.
- Delegate implementation help to `designer`.

**Phase 3 — UI Testing (2-3 days)**
- Delegate to `vibecodekit-hybrid-rri-t` scoped to D1 (UI/UX) plus 1-2 supporting dimensions.
- Output: 100-140 test cases (Q→A→R→P→T) + Coverage Matrix.

**Phase 4 — Measure & Release Gate (≤ 1 day)**
- Aggregate Phase 1 + Phase 3 results into `.omc/design/vibecodekit-hybrid-rri-ui-<slug>.md`.
- Check Release Criteria (below). Emit 🟢 / 🟡 / 🔴.

**Phase 5 — Handoff (continuous)**
- Design specs + test cases delivered to `executor` / `designer`.
- Route back to `vibecodekit-hybrid-verify` for the combined build-ready verdict.
</Phases>

<Release_Criteria>
UI is APPROVED only when ALL of the following are true:
- ✅ Every U1-U7 UX dimension ≥ 70%
- ✅ At least 5 of 7 UX dimensions ≥ 85%
- ✅ Zero P0 items at ❌ BROKEN or ❌ FAIL
- ✅ Vietnamese-specific checklist: 12/12 pass (when VN-first)
- ✅ Responsive check at 375 / 768 / 1440 px — layout intact, no content loss
- ✅ Anti-pattern checklist: 0/12 violations
</Release_Criteria>

<Handoff_Contract>
- Input: `<slug>`, Blueprint, mockups / staging URL.
- Output: `.omc/design/vibecodekit-hybrid-rri-ui-<slug>.md` + updates to `.omc/deliverables.json` (`rri_ui_gate` field).
- Next skill: `vibecodekit-hybrid-verify`.
</Handoff_Contract>

<Final_Checklist>
- [ ] Phase 0 tokens + constraints artifact saved
- [ ] Phase 1 delegated to `vibecodekit-hybrid-rri-ux` and artifact present
- [ ] Phase 2 design self-checks passed for every component
- [ ] Phase 3 delegated to `vibecodekit-hybrid-rri-t` (D1 + supporting dimensions) and artifact present
- [ ] Phase 4 release-gate decision recorded
- [ ] Phase 5 handoff notes produced
- [ ] `.omc/deliverables.json` `rri_ui_gate` set
</Final_Checklist>

<Advanced>
- `--phase 3` runs only the testing phase against an existing Phase 2 design.
- `--module checkout` scopes the entire pipeline to a single module.
- `--strict` promotes every FRICTION / PAINFUL to BROKEN.
</Advanced>
