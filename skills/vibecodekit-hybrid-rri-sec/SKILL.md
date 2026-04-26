---
name: vibecodekit-hybrid-rri-sec
description: RRI-SEC stage of vibecodekit-hybrid — adversarial security walk using 5 security personas × 8 attack axes
argument-hint: "<slug> [--personas <csv>] [--axes <csv>]"
agent: rri-security-auditor
next-skill: vibecodekit-hybrid-verify
handoff: .omc/verify/vibecodekit-hybrid-rri-sec-*.md
level: 3
---

<Purpose>
Pre-release security walk that proves the system can defend itself against realistic attackers AND surfaces threat-model gaps spec forgot to write down. Delegates the walk to the `rri-security-auditor` agent and returns a 4-level verdict (PASS / FAIL / PAINFUL / MISSING) + Module × Attack-axis coverage matrix + release-gate decision.
</Purpose>

<Use_When>
- A vibecodekit-hybrid BUILD stage has produced something that handles authn, authz, payments, PII, uploads, or external integrations.
- `vibecodekit-hybrid-verify` needs structured security coverage before emitting the final release verdict.
- User explicitly asks for "rri-sec", "security audit", "threat model", "compliance audit".
</Use_When>

<Do_Not_Use_When>
- Feature is still in RRI / VISION / BLUEPRINT — there is nothing concrete to attack.
- User wants a static-analysis lint pass only → use `security-reviewer` directly.
- User asks for live exploitation against a production environment — refuse and emit a ticket stub via the agent.
</Do_Not_Use_When>

<Why_This_Exists>
`security-reviewer` answers "does this code conform to OWASP Top 10?". RRI-SEC additionally answers "what trust assumption did spec forget?" and "which attack axis has zero coverage?" Without this layer, MISSING threats (no AuthZ on /admin, no rate-limit on /reset-password, secrets in client bundle, no audit trail) ship silently. The five personas (Threat Modeler / AppSec / Red Teamer / Compliance Auditor / Privacy Officer) force coverage that a single security-reviewer pass routinely flattens into one perspective.
</Why_This_Exists>

<Execution_Policy>
- Delegate the full pass to the `rri-security-auditor` agent via the Task tool.
- Pass the Blueprint + SCAN + RRI artifacts so the agent can target real modules and trust boundaries.
- Respect locale (`OMC_LOCALE=vi` → Vietnamese threat-case bodies, English headings; Vietnamese PDPL becomes a mandatory compliance lane).
- Never approve a release when any P0 threat case is FAIL — block and emit tickets instead.
- Privacy Officer persona is mandatory whenever the system stores user data. Compliance Auditor persona is mandatory whenever the system handles payments, health records, or operates under a regulatory regime named in the SCAN report.
</Execution_Policy>

<Steps>
1. Resolve `<slug>`; locate Blueprint (`.omc/plans/vibecodekit-hybrid-<slug>.md`), RRI artifact (`.omc/specs/vibecodekit-hybrid-rri-<slug>.md`), and SCAN report (`.omc/specs/vibecodekit-hybrid-scan-<slug>.md`). Fail loudly if Blueprint or RRI is missing; SCAN may be absent for greenfield.
2. Compute the target modules (default: every P0 + P1 module that handles authn / authz / payments / PII / uploads / external integrations).
3. Delegate:
   ```
   Task(subagent_type="oh-my-claudecode:rri-security-auditor",
        description="RRI-SEC for <slug>",
        prompt=<blueprint-summary> + <rri-summary> + <scan-summary> + <modules> + <locale>)
   ```
4. Collect `.omc/verify/vibecodekit-hybrid-rri-sec-<slug>.md`.
5. Validate the artifact: Coverage Matrix computed, Release Gate emitted, every FAIL has a ticket stub with severity, every MISSING is echoed back to the Requirements Matrix tagged `[security]`, every Compliance citation has a control-evidence pointer.
6. Return a ≤ 20-line summary + artifact path.
</Steps>

<Handoff_Contract>
- Input: `<slug>`, Blueprint + RRI artifacts (+ SCAN when present).
- Output: `.omc/verify/vibecodekit-hybrid-rri-sec-<slug>.md` + entry appended to `.omc/deliverables.json` (`rri_sec_gate` field).
- Next skill: `vibecodekit-hybrid-verify`.
- Feedback loop: MISSING items → `vibecodekit-hybrid-rri` (tagged `[security]`); PAINFUL UX-shaped items → `vibecodekit-hybrid-rri-ux`; FAIL items → `executor` / `security-reviewer` / `debugger` via ticket stubs (severity decides routing).
</Handoff_Contract>

<Final_Checklist>
- [ ] All 5 security personas walked (or explicitly marked N/A with reason)
- [ ] All 8 attack axes have at least one threat case per P0 module that handles sensitive surface
- [ ] Coverage Matrix computed; Release Gate verdict present
- [ ] 4-level verdict recorded for every threat case
- [ ] Every FAIL has severity (CVSS-style band) and owner in the ticket stub
- [ ] `.omc/deliverables.json` updated with `rri_sec_gate: 🟢|🟡|🔴`
- [ ] Privacy / Compliance personas executed when their mandatory triggers fire (PII / payments / regulated data)
</Final_Checklist>

<Advanced>
- `--personas modeler,red,privacy` restricts the walk to listed personas (comma-separated, short names: `modeler`, `appsec`, `red`, `compliance`, `privacy`).
- `--axes A1,A2,A5` restricts to listed attack axes.
- `--regime gdpr,pci,pdpl` forces additional Compliance Auditor scope on top of what SCAN detected.
- When `OMC_LOCALE=vi`, the agent adds Vietnamese-specific threat banks automatically (PDPL Decree 13/2023 control-evidence rows, diacritic-stripping side-channel under A8, Telex/VNI input fuzz under A3).
</Advanced>
