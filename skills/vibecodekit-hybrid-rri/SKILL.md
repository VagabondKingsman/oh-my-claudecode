---
name: vibecodekit-hybrid-rri
description: RRI stage of vibecodekit-hybrid — Reverse Requirements Interview across 5 personas × 3 modes
argument-hint: "<slug> [--mode challenge|guided|explore]"
agent: rri-interviewer
next-skill: vibecodekit-hybrid-vision
handoff: .omc/specs/vibecodekit-hybrid-rri-*.md
level: 3
---

<Purpose>
Stage 2 of the Vibecodekit Hybrid pipeline. Runs a **Reverse Requirements Interview** using the `rri-interviewer` agent (5 fixed personas × 3 modes). Produces a Requirements Matrix + Decisions Log + Open Questions artifact consumed by VISION and BLUEPRINT.
</Purpose>

<Use_When>
- Called by `vibecodekit-hybrid` as the second stage, after SCAN.
- User explicitly asks for a 5-persona requirements interview ("rri interview", "reverse requirements").
</Use_When>

<Do_Not_Use_When>
- User wants a general Socratic interview with mathematical ambiguity scoring → use `deep-interview` directly.
- SCAN has not produced a report yet → run `vibecodekit-hybrid-scan` first.
</Do_Not_Use_When>

<Why_This_Exists>
`deep-interview` is great for reducing ambiguity mathematically, but it is persona-agnostic. Vibecodekit's RRI mandates five fixed personas (End User / BA / QA / Dev / DevOps) so compliance, robustness, ergonomics, and operations are each covered — not just user-facing functionality. This skill wraps the `rri-interviewer` agent with deterministic artifact handling.
</Why_This_Exists>

<Execution_Policy>
- Delegate the interview to the `rri-interviewer` agent via Task tool.
- Pass the SCAN report path so the agent can filter auto-answered questions.
- Commit to ONE mode (Challenge / Guided / Explore) at the start and keep it for the whole session.
- Respect the user's locale (Vietnamese questions if the project is Vietnamese).
- Cap wall-clock at ~45 minutes of user engagement. If the user stalls, park the remaining questions.
</Execution_Policy>

<Steps>
1. Resolve `<slug>` and locate `.omc/research/vibecodekit-hybrid-scan-<slug>.md`. If missing, invoke `vibecodekit-hybrid-scan` first.
2. Determine mode (flag > user signal > ask once).
3. Delegate via:
   ```
   Task(subagent_type="oh-my-claudecode:rri-interviewer",
        description="RRI for <slug>",
        prompt=<scan-summary> + <mode> + <locale>)
   ```
4. Collect the agent's output artifact from `.omc/specs/vibecodekit-hybrid-rri-<slug>.md`.
5. Validate the artifact: each of 5 personas has ≥ 3 requirements OR is marked `N/A` with justification.
6. Return a ≤ 15-line summary + artifact path to the caller.
</Steps>

<Handoff_Contract>
- Input: `<slug>`, optional `--mode`.
- Output: `.omc/specs/vibecodekit-hybrid-rri-<slug>.md`.
- Next skill: `vibecodekit-hybrid-vision`.
</Handoff_Contract>

<Final_Checklist>
- [ ] Mode committed for the full session
- [ ] 5 personas covered or marked N/A with reason
- [ ] Requirements Matrix has ≥ 3 rows per covered persona
- [ ] Decisions Log has one-line rationale per "A/B/C" choice
- [ ] Artifact saved and path returned
</Final_Checklist>
