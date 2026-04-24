---
name: vibecodekit-hybrid-rri-t
description: RRI-T stage of vibecodekit-hybrid — adversarial QA walk using 5 testing personas × 7 dimensions × 8 stress axes
argument-hint: "<slug> [--personas <csv>] [--dimensions <csv>]"
agent: rri-tester
next-skill: vibecodekit-hybrid-verify
handoff: .omc/verify/vibecodekit-hybrid-rri-t-*.md
level: 3
---

<Purpose>
Post-build adversarial QA pass that proves the system holds up under real-world use AND surfaces missing requirements. Delegates the walk to the `rri-tester` agent and returns a 4-level verdict (PASS / FAIL / PAINFUL / MISSING) + coverage matrix + release-gate decision.
</Purpose>

<Use_When>
- A vibecodekit-hybrid BUILD stage has produced something runnable.
- `vibecodekit-hybrid-verify` needs adversarial coverage before emitting the final release verdict.
- User explicitly asks for "rri-t", "stress test", or "adversarial QA".
</Use_When>

<Do_Not_Use_When>
- Feature is still in RRI / VISION / BLUEPRINT — there is nothing to stress yet.
- User wants only a functional spec-vs-build check → use `verifier` / `ultraqa` instead.
</Do_Not_Use_When>

<Why_This_Exists>
`verifier` and `ultraqa` answer "does the build match spec?". RRI-T additionally answers "does the build match REALITY?" and "what did spec forget?". Without this layer, PAINFUL and MISSING verdicts slip through and become user-facing bugs. The five testing personas (End User / BA / QA Destroyer / DevOps / Security) force Infrastructure and Security coverage that purely spec-driven suites skip.
</Why_This_Exists>

<Execution_Policy>
- Delegate the full pass to the `rri-tester` agent via the Task tool.
- Pass the Blueprint + SCAN + RRI artifacts so the agent can target real modules and P0 paths.
- Respect locale (`OMC_LOCALE=vi` → Vietnamese test-case bodies, English headings).
- Never approve a release when any P0 test case is FAIL — block and emit tickets instead.
</Execution_Policy>

<Steps>
1. Resolve `<slug>`; locate Blueprint (`.omc/plans/blueprint-<slug>.md`) and RRI artifact (`.omc/specs/vibecodekit-hybrid-rri-<slug>.md`). Fail loudly if either is missing.
2. Compute the target modules to cover (default: all P0 + P1 modules from the Blueprint).
3. Delegate:
   ```
   Task(subagent_type="oh-my-claudecode:rri-tester",
        description="RRI-T for <slug>",
        prompt=<blueprint-summary> + <rri-summary> + <modules> + <locale>)
   ```
4. Collect `.omc/verify/vibecodekit-hybrid-rri-t-<slug>.md`.
5. Validate the artifact: Coverage Matrix computed, Release Gate emitted, every FAIL has a ticket stub, every MISSING is echoed back to the Requirements Matrix.
6. Return a ≤ 20-line summary + artifact path.
</Steps>

<Handoff_Contract>
- Input: `<slug>`, Blueprint + RRI artifacts.
- Output: `.omc/verify/vibecodekit-hybrid-rri-t-<slug>.md` + entry appended to `.omc/deliverables.json` (`rri_t_gate` field).
- Next skill: `vibecodekit-hybrid-verify`.
- Feedback loop: MISSING items → `vibecodekit-hybrid-rri`; PAINFUL items → `vibecodekit-hybrid-rri-ux`; FAIL items → `executor` / `debugger` via ticket stubs.
</Handoff_Contract>

<Final_Checklist>
- [ ] All 5 testing personas walked (or explicitly marked N/A with reason)
- [ ] All 7 dimensions have at least one test case per P0 module
- [ ] At least one stress-axis combination exercised per P0 module
- [ ] Coverage Matrix computed; Release Gate verdict present
- [ ] 4-level verdict recorded for every test case
- [ ] `.omc/deliverables.json` updated with `rri_t_gate: 🟢|🟡|🔴`
</Final_Checklist>

<Advanced>
- `--personas user,security` restricts the walk to listed personas (comma-separated).
- `--dimensions D1,D4,D7` restricts to listed testing dimensions.
- `--stress time+data` forces a specific stress-axis mix on every test case.
- When `OMC_LOCALE=vi`, the agent adds the Vietnamese-specific test bank automatically.
</Advanced>
