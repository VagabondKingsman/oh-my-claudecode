# RRI-UX Report — {{slug}}

> Artifact written by `vibecodekit-hybrid-rri-ux` via the `rri-ux-critic` agent.
> 5 UX personas × 7 UX dimensions × 8 Flow Physics axes = complete UX critique.

## 1. Summary

- **Release Gate:** 🟢 Ship · 🟡 Conditional · 🔴 Block
- **Top 5 BROKEN (❌):**
  1.
  2.
  3.
  4.
  5.
- **Top 5 FRICTION (⚠️):**
  1.
  2.
  3.
  4.
  5.
- **Top 5 MISSING (🔲):**
  1.
  2.
  3.
  4.
  5.
- **Locale:** `en` · `vi`.

## 2. UX Coverage Matrix (Persona × Dimension)

Each cell is a FLOW %. Target ≥ 85% 🟢 · Warning 70–84% 🟡 · Block < 70% 🔴.

| Persona \\ Dimension | U1 Flow | U2 Hierarchy | U3 Cognitive | U4 Feedback | U5 Recovery | U6 A11y | U7 Context |
|---------------------|:-------:|:------------:|:------------:|:-----------:|:-----------:|:-------:|:----------:|
| 🏃 Speed Runner     |         |              |              |             |             |         |            |
| 👁️ First-Timer      |         |              |              |             |             |         |            |
| 📊 Data Scanner     |         |              |              |             |             |         |            |
| 🔄 Multi-Tasker     |         |              |              |             |             |         |            |
| 📱 Field Worker     |         |              |              |             |             |         |            |

## 3. Issues (S→V→P→F→I)

> Group issues by screen, then by Flow Physics axis.

### {{SCREEN}}-{{AXIS}}-{{NUMBER}}

- **Persona:** 🏃 · 👁️ · 📊 · 🔄 · 📱
- **Dimension:** U1 · U2 · U3 · U4 · U5 · U6 · U7
- **Axis:** 📏 SCROLL · 🖱️ CLICK DEPTH · 👁️ EYE TRAVEL · 🧠 DECISION · 🔙 RETURN · 📐 VIEWPORT · ⏱️ TIME · 🔄 TASK SWITCH
- **S (Scenario):**
- **V (Violation):**
- **P (Primary persona):**
- **F (Fix):** concrete recommendation — component / token / interaction.
- **I (Impact):** FLOW ✅ · FRICTION ⚠️ · BROKEN ❌ · MISSING 🔲 — expected improvement.

## 4. Flow Map (ordered list of the primary journey)

1. Landing / Dashboard — key info above the fold
2. Primary task entry
3. Confirmation / recovery
4. Next-task handoff

> Annotate friction clusters at each step.

## 5. Viewport Map

| Screen | Above-the-fold content | CTA location | Scroll depth to primary action |
|--------|------------------------|--------------|--------------------------------|
|        |                        |              |                                |

## 6. Mandatory UI Rules — per-screen audit

| Screen | Flow downstream | Sticky CTA | Progressive disclosure | Instant feedback | VN buffer |
|--------|:---------------:|:----------:|:----------------------:|:----------------:|:---------:|
|        | ✅/❌            | ✅/❌       | ✅/❌                   | ✅/❌             | ✅/❌      |

## 7. Vietnamese-specific Checklist (12 items, when `OMC_LOCALE=vi`)

- [ ] VN text longer than EN (~30%) — containers and buttons hold
- [ ] Diacritics render at body + input heights
- [ ] Telex/VNI input — browser autocorrect disabled on VN fields
- [ ] VND `1.234.567 ₫` — auto-format, parse tolerant
- [ ] Date DD/MM/YYYY placeholder `23/02/2025`
- [ ] Address cascade Tỉnh → Quận → Phường → Đường → Số nhà
- [ ] Diacritic-insensitive search (`nguyen` → `Nguyễn`)
- [ ] Phone accept `+84` / `0xxx`, mask `0912 345 678`
- [ ] CCCD (12) / CMND (9) both accepted
- [ ] PDF export uses Unicode font, full-diacritic sample verified
- [ ] Currency parsing accepts space / comma / period variants
- [ ] VN-longest-string probe at 375 / 768 / 1440 px — no truncation or layout break

## 8. Handoff Notes

- Design fixes → `designer`
- New requirement items → `vibecodekit-hybrid-rri`
- Regression tests → `vibecodekit-hybrid-rri-t`
- UI release verdict → `vibecodekit-hybrid-verify` (updates `.omc/deliverables.json`)
