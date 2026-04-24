# BLUEPRINT — {{PROJECT_NAME}}

> Status: `DRAFT | APPROVED`
> Produced by: `vibecodekit-hybrid` (after RRI + VISION)
> Consumed by: `ralplan`, `autopilot`, `team-exec`, `vibecodekit-hybrid-verify`
> Save to: `.omc/plans/vibecodekit-hybrid-{{slug}}.md`

## 1. Project Info
- **Name**: {{PROJECT_NAME}}
- **Type**: landing | saas | dashboard | blog | portfolio | enterprise-module | custom
- **Locale**: en | vi | other
- **Owner / Homeowner**: {{USER}}
- **Orchestrator / Contractor**: Claude Code (OMC)
- **Executor / Worker**: {{executor|team|ralph}}

## 2. Vision Summary
One paragraph describing what the user will experience when the project is done. No tech terms if possible.

## 3. Design Tokens (UI projects)
| Token | Value | Rationale |
|-------|-------|-----------|
| Primary font | | |
| Body font | | |
| Primary color | | |
| Accent color | | |
| Base spacing | | |
| Touch target min | 44×44 px | WCAG / Apple HIG |
| Body font size min | 14 px | Vietnamese diacritic legibility |
| Line height min | 1.5 | Vietnamese diacritic legibility |

## 4. Tech Stack Decision
| Layer | Choice | Why |
|-------|--------|-----|
| | | |

## 5. File Structure (planned)
```
project-root/
├── …
```

## 6. RRI Requirements Matrix
Map each requirement to the RRI persona that surfaced it and the dimension it touches.

| # | Requirement | Persona | Dimension | Source (Scan / RRI Q#) | Acceptance |
|---|-------------|---------|-----------|------------------------|------------|
| 1 | | end-user | functional | RRI-Q3 | Given … When … Then … |

## 7. Task Decomposition Preview
| Task ID | Title | Dependencies | Est. complexity | Assigned worker |
|---------|-------|--------------|-----------------|-----------------|
| T1 | | — | small | executor |

## 8. Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| | | | |

## 9. Checkpoint
- [ ] Reviewed by Architect (via `ralplan`)
- [ ] Reviewed by Critic (via `ralplan`)
- [ ] `APPROVED` by human (required before BUILD starts in `--interactive` mode)

> To approve, the human replies with the literal word **`APPROVED`** (case-insensitive). Any other reply means the blueprint is not yet accepted.

## 10. Traceability IDs
- Scan report: `.omc/research/vibecodekit-hybrid-scan-{{slug}}.md`
- RRI log: `.omc/specs/vibecodekit-hybrid-rri-{{slug}}.md`
- Vision pattern used: `templates/vibecodekit-hybrid/vision-patterns/{{pattern}}.md`
