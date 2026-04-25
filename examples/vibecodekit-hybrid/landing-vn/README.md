# Example: `landing-vn` — Vietnamese yoga-studio landing page

## Scenario

A small yoga studio in Hà Nội wants a single-page landing site. Requirements:

- Vietnamese copy (display fully with diacritics at 375 / 768 / 1440 px).
- Hero CTA: "Đặt lịch thử" within 100vh of top.
- Class schedule with VND pricing (`250.000 ₫` / buổi).
- Contact form with VN phone (`0912 345 678`) and CCCD-tolerant name field.
- No backend in Phase 1; form POSTs to a Google Sheet webhook.

## Invocation

```bash
export OMC_LOCALE=vi
# inside Claude Code:
/oh-my-claudecode:vibecodekit-hybrid --pattern landing --locale vi --interactive \
  "landing page for Hạ Long Yoga Studio, VND pricing, online booking CTA"
```

Phase 3 CLI equivalent for on-disk scaffolding:

```bash
omc vibecodekit scaffold landing-vn --locale vi
```

## Expected release gate

| Metric | Value |
|--------|-------|
| `verify_gate` | 🟡 (1 PAINFUL row: mobile CTA overlap with virtual keyboard) |
| `release_decision` | `SHIP_WITH_FOLLOWUPS` |
| `rri_ux_gate` | 🟢 (all 7 UX dimensions ≥ 85 %) |
| `rri_t_gate` | — (not invoked; landing is below the adversarial threshold) |
| `verdict_counts` | pass=9, fail=0, painful=1, missing=0 |

## Artifact map

| Stage | File |
|-------|------|
| SCAN | `.omc/research/vibecodekit-hybrid-scan-landing-vn.md` |
| RRI | `.omc/specs/vibecodekit-hybrid-rri-landing-vn.md` |
| VISION | (section inside Blueprint) |
| BLUEPRINT | `.omc/plans/vibecodekit-hybrid-landing-vn.md` |
| RRI-UX | `.omc/research/vibecodekit-hybrid-rri-ux-landing-vn.md` |
| VERIFY | `.omc/plans/vibecodekit-hybrid-verify-landing-vn.md` |
| Gate | `.omc/deliverables.json` |

This example ships a minimal `deliverables.json` and blueprint stub so you can diff against your own output.
