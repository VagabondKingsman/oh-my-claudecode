---
name: vibecodekit-hybrid-vision
description: VISION stage of vibecodekit-hybrid — pick one of 7 canonical patterns and render the Vision section
argument-hint: "<slug> [--pattern landing|saas|dashboard|blog|portfolio|enterprise-module|custom]"
next-skill: ralplan
handoff: .omc/plans/vibecodekit-hybrid-*.md
level: 2
---

<Purpose>
Stage 3 of the Vibecodekit Hybrid pipeline. Selects one of 7 canonical vision patterns and renders the Vision section of the Blueprint using the matching template from `templates/vibecodekit-hybrid/vision-patterns/`.
</Purpose>

<Use_When>
- Called by `vibecodekit-hybrid` as the third stage, after RRI.
- User explicitly asks to "pick a vision pattern" or "define the vision" for a new project.
</Use_When>

<Do_Not_Use_When>
- The project is a non-code artifact (document, recording) → skip VISION.
- User has already chosen a bespoke architecture → use `architect` agent directly.
</Do_Not_Use_When>

<Why_This_Exists>
Blank-page vision writing is slow and tends to drift. Having 7 named patterns (landing, saas, dashboard, blog, portfolio, enterprise-module, custom) with explicit layouts, default stacks, non-goals, and persona-focus makes the decision fast AND reviewable. The "custom" pattern exists only as a deliberate escape hatch, not a default.
</Why_This_Exists>

<Execution_Policy>
- Prefer the 6 standard patterns over "custom". Only choose "custom" if none of the standard patterns fit after honest review.
- Default stacks in pattern templates are **suggestions**, not mandates. User choices captured in RRI override the defaults — record the override in Blueprint §4.
- Do NOT hardcode Next.js / Tailwind / Supabase as the only stack. Preserve the ability to inherit host-app stack for enterprise modules.
</Execution_Policy>

<Steps>
1. Resolve `<slug>` and locate `.omc/specs/vibecodekit-hybrid-rri-<slug>.md` + `.omc/research/vibecodekit-hybrid-scan-<slug>.md`.
2. Detect the candidate pattern:
   - `--pattern` flag wins.
   - Else infer from RRI answers + scan (e.g. "authenticated + billing" → saas, "public long-form content" → blog).
   - Confirm with the user in ONE question ("I'm picking pattern X because Y. OK, switch to Z, or explain more?").
3. Load the pattern file: `templates/vibecodekit-hybrid/vision-patterns/<pattern>.md`.
4. Render the Vision section into the Blueprint template at `.omc/plans/vibecodekit-hybrid-<slug>.md`:
   - Copy the canonical layout, trim bullets that don't apply.
   - Override default tech stack with user choices from RRI (document overrides).
   - Record Non-goals explicitly.
5. Stop before Blueprint §6 (Requirements Matrix) — that is filled by `ralplan` / Planner using the RRI artifact.
6. Return a ≤ 10-line summary: chosen pattern, rationale, 3 key non-goals, override list.
</Steps>

<Handoff_Contract>
- Input: `<slug>`, optional `--pattern`.
- Output: Vision section materialised in `.omc/plans/vibecodekit-hybrid-<slug>.md`.
- Next skill: `ralplan` (for Blueprint consensus).
</Handoff_Contract>

<Final_Checklist>
- [ ] Pattern confirmed with the user (or overridden via flag)
- [ ] Non-goals section has ≥ 2 entries
- [ ] Tech stack overrides from RRI recorded
- [ ] Vision section written; remaining Blueprint sections empty for ralplan
</Final_Checklist>
