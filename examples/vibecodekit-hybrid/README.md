# Vibecodekit Hybrid — Worked Examples

Two complete, reviewable runs of the `vibecodekit-hybrid` pipeline, captured as frozen artifacts. Each example mirrors the exact files the skill would produce on disk under `.omc/`, just committed to the repo for documentation and demo purposes.

| Example | Vision pattern | Locale | Highlights |
|---------|----------------|--------|-----------|
| [`landing-vn/`](./landing-vn/) | `landing` | `vi` | Vietnamese yoga-studio landing page. Exercises Flow-Physics viewport, VN diacritics, VND formatting, RRI-UX pre-design critique. |
| [`saas-enterprise-module/`](./saas-enterprise-module/) | `enterprise-module` | `en` | Invoice module for a VN-facing Enterprise SaaS. Exercises full RRI-UI pipeline (UX critique → design → RRI-T adversarial walk → release gate). |

## How to use an example

1. Open the example's `README.md` for the scenario + expected release gate.
2. Read the artifacts in this order: scan-report → rri → vision-section → blueprint → (rri-ux optional) → (rri-t optional) → verify → deliverables.
3. Copy the artifact layout into your own `.omc/` directory (or run `omc vibecodekit scaffold <slug>` from Phase 3 to produce the same skeleton) and re-run the pipeline against your project.

## Why these two

- `landing-vn` is the **smallest non-trivial** run: single-page UI, Vietnamese locale, no backend. Good first example to read top-to-bottom.
- `saas-enterprise-module` is the **fullest run**: all optional stages exercised, release gate aggregated across RRI-T + RRI-UX + RRI-UI, verdict 4 levels populated.

Both examples keep artifact headings in English so your tooling parses them the same way regardless of locale.
