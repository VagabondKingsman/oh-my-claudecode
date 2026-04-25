# RRI-SEC Report — {{slug}}

> Artifact written by `vibecodekit-hybrid-rri-sec` via the `rri-security-auditor` agent.
> 5 security personas × 8 attack axes = adversarial security walk + control-evidence trail.

## 1. Summary

- **Release Gate:** 🟢 Release · 🟡 Conditional · 🔴 Block  _(pick one)_
- **Top 3 FAIL ❌:**
  1.
  2.
  3.
- **Top 3 PAINFUL ⚠️:**
  1.
  2.
  3.
- **Top 3 MISSING 🔲:**
  1.
  2.
  3.
- **Compliance scope:** GDPR · PCI-DSS · HIPAA · PDPL  _(pick all that apply)_
- **Locale:** `en` · `vi`  — follow `OMC_LOCALE` when present.

## 2. Coverage Matrix (Module × Attack-axis)

Target ≥ 90% PASS rate per cell 🟢 · Warning 75–89% 🟡 · Block < 75% 🔴 (security failures are non-recoverable post-ship — tighter than RRI-T).

| Module | A1 AuthN | A2 AuthZ | A3 Inj | A4 Supply | A5 Secret | A6 Exfil | A7 DoS | A8 Side |
|--------|:--------:|:--------:|:------:|:---------:|:---------:|:--------:|:------:|:-------:|
|        |          |          |        |           |           |          |        |         |

## 3. Persona Coverage Check

| Persona | Threat Ideas | Covered | Dominant Axes |
|---------|-------------:|--------:|---------------|
| 🧩 Threat Modeler |  |  | A1, A2, A4, A6, A7 |
| 🛡️ AppSec Engineer |  |  | A1, A2, A3, A4, A5 |
| 🔴 Red Teamer |  |  | A1, A2, A3, A5, A7, A8 |
| 📋 Compliance Auditor |  |  | A4, A5, A6 |
| 🕵️ Privacy Officer |  |  | A6, A8 |

## 4. Trust Boundary Inventory

> One row per P0 module — what crosses, who is on each side, what control gates the crossing.

| Module | Boundary | Outside trust | Inside trust | Gate (control) |
|--------|----------|---------------|--------------|----------------|
|        |          |               |              |                |

## 5. Threat Cases

> One block per persona × axis slot. Use the T→A→V→I→M shape.

### {{MODULE}}-{{AXIS}}-{{NUMBER}}

- **Persona:** 🧩 Modeler · 🛡️ AppSec · 🔴 Red · 📋 Compliance · 🕵️ Privacy
- **Axis:** A1 AuthN · A2 AuthZ · A3 Injection · A4 Supply chain · A5 Secret · A6 Data exfil · A7 DoS · A8 Side channel
- **T (Threat):** _what bad outcome are we worried about?_
- **A (Attacker capability):** anonymous · authenticated user · authenticated admin · insider · nation-state
- **V (Vector):** _concrete request / payload / config / interaction sequence_
- **I (Impact):** Confidentiality · Integrity · Availability · Compliance — _quantify (records, downtime, fines)_
- **M (Mitigation):** _control already in place (cite file/config) OR required new control_
- **Severity:** Critical · High · Medium · Low (CVSS-style band)
- **Result:** ✅ PASS · ❌ FAIL · ⚠️ PAINFUL · 🔲 MISSING — one-line rationale
- **Ticket stub (when not PASS):** `[<severity>][<verdict>] <module>: <headline> → owner: executor|security-reviewer|debugger`

## 6. Compliance Evidence

> One row per regulation in scope — what the control is, where the evidence lives.

| Regulation | Control | Evidence pointer | Verdict |
|------------|---------|------------------|---------|
| GDPR Art. 32(1)(a) — encryption at rest |  |  | ✅ ❌ ⚠️ 🔲 |
| GDPR Art. 32(1)(d) — recovery testing |  |  | ✅ ❌ ⚠️ 🔲 |
| PCI-DSS 8.3 — MFA for admin |  |  | ✅ ❌ ⚠️ 🔲 |
| PCI-DSS 10.2 — audit-log coverage |  |  | ✅ ❌ ⚠️ 🔲 |
| PDPL Decree 13/2023 Art. 11 — lawful-basis register |  |  | ✅ ❌ ⚠️ 🔲 |

## 7. Bug Tickets (1-line stubs)

- `[Critical][FAIL] {{module}}: {{headline}} → owner: executor`
- `[High][PAINFUL] {{module}}: {{headline}} → owner: security-reviewer`

## 8. New Requirements Discovered (MISSING → RRI)

- `[🔲MISSING][security] {{module}}: {{one-line requirement}}`

## 9. Vietnamese / Locale-Specific Checks (when `OMC_LOCALE=vi`)

- [ ] PDPL Decree 13/2023 Art. 11 — lawful-basis register exists per data category
- [ ] PDPL Art. 13 — cross-border transfer impact assessment recorded
- [ ] Diacritic-stripping does NOT collapse `Nguyễn` and `Nguyen` into the same dedup bucket (A8)
- [ ] Telex / VNI input does not bypass server-side input validators (A3)
- [ ] CCCD / CMND fields validated AND PII-tagged (A6)
- [ ] CV / CCCD scans uploaded as files: AV scan + size cap + virus-quarantine path (A4 + A7)
- [ ] VND amounts in audit logs preserve dot-thousands formatting (no float drift) (A6)
- [ ] OTP messages localised in Vietnamese without bypassing rate-limits (A1)

## 10. Open Questions

- (blocked on ...) —

## 11. Handoff

- FAIL tickets → `executor` / `security-reviewer` / `debugger` (severity decides)
- PAINFUL clusters with UX shape → `vibecodekit-hybrid-rri-ux`
- MISSING items → `vibecodekit-hybrid-rri` (tagged `[security]`)
- Release-gate verdict → `vibecodekit-hybrid-verify` (updates `.omc/deliverables.json#/rri_sec_gate`)
