---
name: vibecodekit-hybrid-verify
description: VERIFY stage of vibecodekit-hybrid — RRI-Reverse traceability + persona walkthrough + stress tests with 4-level verdict
argument-hint: "<slug>"
next-skill: ai-slop-cleaner
handoff: .omc/plans/vibecodekit-hybrid-verify-*.md
level: 3
---

<Purpose>
Stage 7 of the Vibecodekit Hybrid pipeline. Confirms delivery against the Blueprint with four lenses: requirement traceability, scenario walkthrough per persona, stress/edge/failure scenarios, and technical health. Uses 4-level verdict (PASS ✅ / FAIL ❌ / PAINFUL ⚠️ / MISSING 🔲) instead of binary pass/fail.
</Purpose>

<Use_When>
- Called by `vibecodekit-hybrid` after BUILD.
- User asks "verify this against the blueprint" or "run RRI reverse".
</Use_When>

<Do_Not_Use_When>
- No Blueprint exists → use `verifier` agent directly.
- User wants a quick build+test check → use `verifier` or `ultraqa`.
</Do_Not_Use_When>

<Why_This_Exists>
Binary pass/fail loses signal. Many real-world requirements are technically implemented but "painful" — they work only on happy paths, fail on Vietnamese input, degrade on large datasets, or skip observability. The 4-level verdict + RRI-Reverse walkthrough force those cases to surface and get recorded in the verify report so REFINE has explicit follow-up tasks.
</Why_This_Exists>

<Execution_Policy>
- Delegate the technical health checks to `verifier` (standard) or `code-reviewer` + `security-reviewer` (large / security-sensitive).
- Delegate the persona walkthrough to `qa-tester` + the `rri-interviewer` persona bank (reused in reverse mode).
- Do NOT rewrite the Blueprint during VERIFY. If a requirement is wrong, mark it FAIL and file a follow-up TIP — the fix happens in REFINE or a new BLUEPRINT revision.
- Collect evidence for every verdict. A verdict without evidence is treated as MISSING.
</Execution_Policy>

<Steps>
1. Resolve `<slug>` and locate `.omc/plans/vibecodekit-hybrid-<slug>.md`.
2. **Requirement Traceability**: walk every row of the Blueprint's RRI Requirements Matrix, find the implementing code + test, assign a verdict.
3. **Persona Walkthrough**: 3-5 bullets per persona covering the happy path (End User / BA / QA / Dev / DevOps, plus Security Auditor when RRI-T is enabled).
4. **Stress Scenarios**: run at least one scenario per applicable stress axis (time, data volume, error, concurrency, emergency, locale, infra failure, security attack). Record setup, action, expected, actual, verdict.
5. **Technical Health**: build, tests, lint, typecheck, no-new-TODO, no-new-secrets, dependency diff check. Delegate to `verifier`.
6. **Overall verdict**: SHIP / SHIP WITH FOLLOW-UPS / DO NOT SHIP.
7. Write the report to `.omc/plans/vibecodekit-hybrid-verify-<slug>.md` using `templates/vibecodekit-hybrid/verify-report.md`.
8. Return a ≤ 15-line summary + verdict + count of PAINFUL / MISSING rows + artifact path.
</Steps>

<Handoff_Contract>
- Input: `<slug>`.
- Output: `.omc/plans/vibecodekit-hybrid-verify-<slug>.md`.
- Next skill: `ai-slop-cleaner` if REFINE is warranted, else end of pipeline.
</Handoff_Contract>

<Final_Checklist>
- [ ] Every Requirements Matrix row has a verdict with evidence
- [ ] At least one stress scenario per applicable axis
- [ ] Technical health passes are backed by command output evidence
- [ ] Overall verdict chosen and justified
- [ ] Follow-up TIPs filed for every PAINFUL / MISSING row
</Final_Checklist>
