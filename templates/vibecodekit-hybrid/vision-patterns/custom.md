# Vision Pattern — Custom / Hybrid

> Use when the project does not cleanly fit landing / saas / dashboard / blog / portfolio / enterprise-module.

## When to pick this pattern
- The project combines two or more patterns (e.g. "landing + SaaS", "blog + dashboard").
- The project is a CLI, plugin, library, game, embedded device, or other non-web surface.
- The user explicitly overrides with `--pattern custom`.

## What this template is for
A minimum checklist to make sure the custom vision is still concrete enough to BUILD from.

## Required sections for a Custom Vision
1. **One-sentence product thesis**
2. **Primary user journeys** (3-5 numbered flows with start state → end state)
3. **Surfaces** — every UI surface / CLI command / API endpoint / device screen
4. **Non-goals** — what this product deliberately is not
5. **Tech stack decision** with rationale (inherited vs greenfield)
6. **Success metrics** — how we will know it works

## Persona focus (RRI)
Pick the subset of personas that match the project's reality and justify the choice. Examples:
- CLI → End User (developer), Developer, Security Auditor, DevOps
- Game → End User (player), QA Destroyer, Performance (First-Timer onboarding)
- Library → Developer, Security Auditor, Writer (docs), BA (semver/compat)

## Flow Physics (RRI-UX) considerations
Pick the axes that apply. For non-visual surfaces, translate the axes:
- CLI: TIME TO ACTION = time from `cmd --help` to first successful run
- API: DECISION LOAD = number of required params to make a minimal request
- CLI / API: RETURN PATH = ability to undo / reverse the last destructive action

## Acceptance skeleton
```
Given the project's primary user journey
When the user completes it end-to-end
Then success metric X ≥ threshold Y
And the primary non-goal is not accidentally in scope
```

## Reminder
If you find yourself filling in mostly empty sections, you probably picked **custom** when a standard pattern would do. Re-check `landing`, `saas`, `dashboard`, `blog`, `portfolio`, `enterprise-module` before committing to custom.
