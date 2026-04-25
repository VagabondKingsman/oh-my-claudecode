# RRI-T Report — {{slug}}

> Artifact written by `vibecodekit-hybrid-rri-t` via the `rri-tester` agent.
> 5 testing personas × 7 dimensions × 8 stress axes = complete quality walk.

## 1. Summary

- **Release Gate:** 🟢 Release · 🟡 Conditional · 🔴 Block  _(pick one)_
- **Top 3 FAIL (❌):**
  1.
  2.
  3.
- **Top 3 PAINFUL (⚠️):**
  1.
  2.
  3.
- **Top 3 MISSING (🔲):**
  1.
  2.
  3.
- **Locale:** `en` · `vi` — follow `OMC_LOCALE` when present.

## 2. Coverage Matrix (Module × Dimension)

Target ≥ 85% PASS rate per cell 🟢 · Warning 70–84% 🟡 · Block < 70% 🔴.

| Module | D1 UI/UX | D2 API | D3 Perf | D4 Security | D5 Data | D6 Infra | D7 Edge |
|--------|:--------:|:------:|:-------:|:-----------:|:-------:|:--------:|:-------:|
|        |          |        |         |             |         |          |         |

## 3. Persona Coverage Check

| Persona | Test Ideas | Covered | Dominant Dimensions |
|---------|-----------:|--------:|---------------------|
| 👤 End User |  |  | D1, D3, D7 |
| 📋 BA |  |  | D2, D5 |
| 🔍 QA Destroyer |  |  | D1, D7 |
| 🛠️ DevOps |  |  | D3, D6 |
| 🔒 Security Auditor |  |  | D4, D5, D6 |

## 4. Test Cases

> One block per persona × dimension slot. Use the Q→A→R→P→T shape.

### {{MODULE}}-{{DIMENSION}}-{{NUMBER}}

- **Persona:** 👤 End User · 📋 BA · 🔍 QA · 🛠️ DevOps · 🔒 Security
- **Dimension:** D1 · D2 · D3 · D4 · D5 · D6 · D7
- **Stress axes:** 🕐 TIME · 📊 DATA · ❌ ERROR · 👥 COLLAB · 🚑 EMERGENCY · 🔒 SECURITY · 🛠️ INFRA · 🌐 LOCALE
- **Q:**
- **A (expected):**
- **R (requirement):**
- **P:** P0 · P1 · P2 · P3
- **T:** Precondition → Steps → Expected result → Evidence reference.
- **Result:** ✅ PASS · ❌ FAIL · ⚠️ PAINFUL · 🔲 MISSING — one-line rationale.

## 5. Bug Tickets (1-line stubs)

- `[P0][FAIL] {{module}}: {{headline}} → owner: executor`
- `[P1][PAINFUL] {{module}}: {{headline}} → owner: rri-ux-critic`

## 6. New Requirements Discovered (MISSING → RRI)

- `[🔲 MISSING] {{module}}: {{one-line requirement}}`

## 7. Stress Combinations Exercised

| Combination | Scenario | Outcome |
|-------------|----------|---------|
| TIME × DATA |  | ✅/❌/⚠️/🔲 |
| ERROR × COLLAB |  | ✅/❌/⚠️/🔲 |
| LOCALE × DATA |  | ✅/❌/⚠️/🔲 |
| INFRA × TIME |  | ✅/❌/⚠️/🔲 |

## 8. Vietnamese-Specific Checks (when `OMC_LOCALE=vi`)

- [ ] Diacritics intact in exports / PDFs (ă â ê ô ơ ư đ)
- [ ] VND formatted `1.234.567 ₫` (dot-thousands), auto-format on blur
- [ ] DD/MM/YYYY with explicit placeholder `23/02/2025`
- [ ] Address cascade Tỉnh → Quận → Phường → Đường → Số nhà
- [ ] Diacritic-insensitive search (`nguyen` → `Nguyễn`)
- [ ] Phone `+84` / `0xxx` with mask `0912 345 678`
- [ ] CCCD (12) and CMND (9) accepted
- [ ] Telex/VNI input — browser autocorrect disabled on VN fields
- [ ] Currency / date parsing resilient to whitespace and punctuation variants
- [ ] Longest-VN-string layout probe at 1440 / 768 / 375 px

## 9. Open Questions

- (blocked on ...) —

## 10. Handoff

- FAIL tickets → `executor` / `debugger`
- PAINFUL clusters → `vibecodekit-hybrid-rri-ux`
- MISSING items → `vibecodekit-hybrid-rri`
- Release-gate verdict → `vibecodekit-hybrid-verify` (updates `.omc/deliverables.json`)
