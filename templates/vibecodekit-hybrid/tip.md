# Task Instruction Pack (TIP) — {{TASK_ID}}

> One TIP per delegated worker task. Contractor (orchestrator) fills this in and hands it to the worker (executor / child agent / team worker).

## HEADER
- **Task ID**: {{TASK_ID}}
- **Title**: {{TITLE}}
- **Parent blueprint**: `{{BLUEPRINT_PATH}}`
- **Assigned worker**: executor | designer | test-engineer | security-reviewer | …
- **Model routing hint**: haiku | sonnet | opus
- **Depends on**: {{TASK_IDS}}
- **Blocks**: {{TASK_IDS}}

## CONTEXT
- **Why this task exists** (1-3 sentences, linked to a Blueprint requirement #)
- **Files likely involved** (paths with line ranges when known)
- **Relevant prior decisions** (from RRI Decisions Log / ralplan ADR)

## TASK
A single imperative sentence describing what the worker must produce.

## SPECIFICATIONS
Concrete technical specs. Use bullet lists, tables, or small snippets. Do NOT paste unrelated context.

- …

## ACCEPTANCE CRITERIA (Gherkin)
```
Given   …
When    …
Then    …
And     …
```

List all scenarios that must pass. Each MUST be testable. Unverifiable wording (“works well”, “fast”) is rejected — replace with concrete metrics.

## CONSTRAINTS
- **Must do**: …
- **Must NOT do**: …
- **Scope boundary**: do not touch files outside {{PATHS}}
- **Style / lint**: follow existing project conventions (see SCAN report §4)
- **Locale**: if `OMC_LOCALE=vi`, apply `templates/rules/locale/vi/` rules (Phase 2)

## REPORT FORMAT
Worker MUST reply using `templates/vibecodekit-hybrid/completion-report.md` with this exact task ID in the header. Any other format is treated as incomplete.

## ESCALATION
If the worker cannot satisfy acceptance criteria after 3 attempts, STOP and return a Completion Report with `STATUS: NEEDS_DECISION`, listing:
1. What was tried
2. What remains blocked
3. Concrete options for the contractor to choose from
