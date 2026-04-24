# Vibecodekit Hybrid Templates

Shared artifact templates used by the `vibecodekit-hybrid` skill family. Each file is a markdown template that agents / skills read (and optionally fill in) during the 8-step Vibecode workflow:

```
SCAN → RRI → VISION → BLUEPRINT → TASK GRAPH → BUILD → VERIFY → REFINE
```

| File | Stage | Purpose |
|------|-------|---------|
| `scan-report.md` | SCAN | Canonical brownfield/greenfield scan output |
| `blueprint.md` | BLUEPRINT | Machine-readable contract bridging RRI → BUILD |
| `tip.md` | TASK GRAPH | Task Instruction Pack — one per delegated worker task |
| `completion-report.md` | BUILD | Structured worker report back to orchestrator |
| `verify-report.md` | VERIFY | RRI-Reverse traceability + stress-test results |
| `rri-t-report.md` | VERIFY (Phase 2) | Adversarial QA walk — 5 testing personas × 7 dimensions × 8 stress axes, 4-level verdict per test case |
| `rri-ux-report.md` | VERIFY (Phase 2) | Flow-Physics UX critique — 5 UX personas × 7 UX dimensions × 8 axes, S→V→P→F→I issues |
| `rri-ui-report.md` | VERIFY (Phase 2) | Composed UI design pipeline — 5 phases, 6-criterion release gate |
| `vision-patterns/landing.md` | VISION | Landing page structural pattern |
| `vision-patterns/saas.md` | VISION | SaaS app structural pattern |
| `vision-patterns/dashboard.md` | VISION | Dashboard / analytics pattern |
| `vision-patterns/blog.md` | VISION | Blog / content site pattern |
| `vision-patterns/portfolio.md` | VISION | Portfolio / showcase pattern |
| `vision-patterns/enterprise-module.md` | VISION | Enterprise app module pattern |
| `vision-patterns/custom.md` | VISION | Custom / hybrid fallback pattern |

Templates are **suggestions, not mandates**. Skills should fill in only the sections that apply to the current project and omit the rest.

All templates keep headings in English for tooling consistency; descriptive text may be written in any language (including Vietnamese) to match the user's locale.

> Attribution: Adapted from Vibecodekit v5 (Contractor–Worker Protocol) and the RRI methodology family (RRI, RRI-T, RRI-UI, RRI-UX). Integrated into OMC as a skill-pack, not a runtime rewrite.
