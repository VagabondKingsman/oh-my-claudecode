---
name: vibecodekit-hybrid-rri-ux
description: RRI-UX stage of vibecodekit-hybrid — Flow-Physics UX critique using 5 UX personas × 7 UX dimensions × 8 axes
argument-hint: "<slug> [--screens <csv>] [--axes <csv>]"
agent: rri-ux-critic
next-skill: vibecodekit-hybrid-verify
handoff: .omc/research/vibecodekit-hybrid-rri-ux-*.md
level: 3
---

<Purpose>
Pre-code (or post-mockup) UX critique that catches Flow-Physics anti-patterns while they are still cheap to fix. Delegates the critique to the `rri-ux-critic` agent and returns 80-120 UX issues in S→V→P→F→I format + a UX Coverage Matrix + a release gate.
</Purpose>

<Use_When>
- A wireframe, mockup, staging build, or even a user-flow description exists and needs UX review before code is written (or before release).
- `vibecodekit-hybrid-rri-t` flagged a cluster of PAINFUL items and the UX root cause needs characterizing.
- User explicitly asks for "rri-ux", "ux critique", "flow physics", or "ux audit".
</Use_When>

<Do_Not_Use_When>
- Project has no UI (backend service, CLI tool) — use `rri-tester` for API ergonomics instead.
- Problem is already architectural, not UX → use `architect` / `critic`.
</Do_Not_Use_When>

<Why_This_Exists>
Functional tests do not detect "CTA is off-screen when content grows", "scroll-back loop after save", "Vietnamese text breaks the table at 1440 px", or "user loses filter state when switching tabs". These anti-patterns flow directly into support tickets and churn. RRI-UX surfaces them using five persona lenses (Speed Runner / First-Timer / Data Scanner / Multi-Tasker / Field Worker) crossed with the 8 Flow Physics axes and the 7 UX dimensions.
</Why_This_Exists>

<Execution_Policy>
- Delegate the full pass to the `rri-ux-critic` agent via the Task tool.
- Provide the target artifact (screenshot path, Figma export, staging URL, or flow spec). Agent refuses to proceed without something concrete.
- Respect locale: Vietnamese violations are written in Vietnamese, section headings stay in English.
- Never approve a screen that violates any of the 5 mandatory UI rules without an explicit user override.
</Execution_Policy>

<Steps>
1. Resolve `<slug>`; locate Blueprint + any mockup/staging URL. Fail loudly if no concrete UX artifact is available.
2. Select scope (default: every primary screen in the Blueprint; `--screens` narrows).
3. Delegate:
   ```
   Task(subagent_type="oh-my-claudecode:rri-ux-critic",
        description="RRI-UX for <slug>",
        prompt=<blueprint-summary> + <ux-artifact-refs> + <axes> + <locale>)
   ```
4. Collect `.omc/research/vibecodekit-hybrid-rri-ux-<slug>.md`.
5. Validate: 80-120 issues, 5 personas covered, all 8 axes hit at least once, Vietnamese checklist present when `OMC_LOCALE=vi`.
6. Return a ≤ 20-line summary + artifact path. Annotate any ❌ BROKEN items that block release.
</Steps>

<Handoff_Contract>
- Input: `<slug>`, UX artifact references.
- Output: `.omc/research/vibecodekit-hybrid-rri-ux-<slug>.md` + `.omc/deliverables.json` update (`rri_ux_gate` field).
- Next skill: `vibecodekit-hybrid-verify`.
- Loops: BROKEN fixes → `designer`; MISSING screens → `vibecodekit-hybrid-rri`; post-fix regression → `vibecodekit-hybrid-rri-t`.
</Handoff_Contract>

<Final_Checklist>
- [ ] 5 UX personas covered (Speed Runner, First-Timer, Data Scanner, Multi-Tasker, Field Worker)
- [ ] 8 Flow Physics axes each hit at least once
- [ ] 7 UX dimensions scored with FLOW %
- [ ] 0 unresolved ❌ BROKEN items OR explicit user override logged
- [ ] Vietnamese checklist present (12 items) when `OMC_LOCALE=vi`
- [ ] `.omc/deliverables.json` updated with `rri_ux_gate: 🟢|🟡|🔴`
</Final_Checklist>

<Advanced>
- `--screens dashboard,detail-modal` restricts the critique to listed screens.
- `--axes scroll,click-depth,decision` restricts the axes covered.
- `--strict` escalates every FRICTION to BROKEN and hard-blocks release until each is resolved.
</Advanced>
