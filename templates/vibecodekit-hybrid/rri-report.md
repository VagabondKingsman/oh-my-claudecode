# RRI Report — {{slug}}

> Output of the **RRI** stage (Stage 3 of the vibecodekit-hybrid pipeline).
> Captures every requirement the Contractor extracted via Socratic
> interview, the decisions made, and the questions still open. Owned by
> the `rri-interviewer` agent. Locale: `{{locale}}`. Generated: `{{date}}`.

## 1. Snapshot

| Field | Value |
|-------|-------|
| Slug | `{{slug}}` |
| Locale | `{{locale}}` |
| Generated | `{{date}}` |
| Source SCAN | `.omc/research/vibecodekit-hybrid-scan-{{slug}}.md` |
| Downstream | VISION → `.omc/specs/vibecodekit-hybrid-vision-{{slug}}.md` |

## 2. Personas in scope

> The five canonical RRI personas (Project Manager, Domain Expert, End
> User, Operator, Skeptic). Mark each one ACTIVE / SKIP and explain why.
> A persona that is SKIP without justification is a process smell —
> revisit before moving to VISION.

- [ ] **PM (Project Manager)** — strategic intent, deadlines, success metrics.
- [ ] **DOMAIN (Domain Expert)** — invariants, edge cases, regulatory traps.
- [ ] **USER (End User)** — actual day-to-day usage, jobs to be done.
- [ ] **OPS (Operator)** — deploy, observe, page, recover.
- [ ] **SKEPTIC** — adversarial probe, "this won't work because…".

## 3. Requirements Matrix

> Every captured requirement gets one row. Pin it to the persona that
> raised it so reviewers can see whose voice is missing.

| ID | Persona | Mode | Requirement | Verdict | Linked TIP |
|----|---------|------|-------------|---------|------------|
| R-001 | … | discovery / elaboration / verification | … | PASS / FAIL / PAINFUL / MISSING | `.omc/plans/tips/{{slug}}-r-001.md` |
| R-002 | … | … | … | … | … |
| … | | | | | |

## 4. Decisions Log

> Each row pins one decision the team locked during the interview. ADR
> form: Context → Decision → Consequences → Reversibility.

| Decision ID | Context | Decision | Consequences | Reversibility |
|-------------|---------|----------|--------------|---------------|
| D-001 | … | … | … | high / medium / low |
| D-002 | … | … | … | … |
| … | | | | |

## 5. Open Questions

> Questions raised during the interview that the team could not answer
> in-session. Each one is a blocker until resolved or explicitly
> deferred. Move resolved items to the Decisions Log.

- [ ] **Q-001**: …
  - Owner: `<who>`
  - Block / Defer / Decide-later: …
  - Target resolution: `<date>`
- [ ] **Q-002**: …
  - …

## 6. Rejected Alternatives

> Path-dependent constraint: future contributors must read this list
> before re-proposing a rejected option.

| Alternative | Rejected because | Triggered by which decision |
|-------------|------------------|------------------------------|
| … | … | D-… |

## 7. RRI verdict

> Final RRI gate for this slug. Recorded back into
> `.omc/deliverables.json` as `rri_gate` if your pipeline emits it.

- **Gate**: 🟢 PASS / 🟡 PASS_WITH_FOLLOWUPS / 🔴 NEEDS_REWORK / ⚪ NOT_RUN
- **Rationale**: 1–3 sentences. Cite specific R-/D-/Q- IDs.
- **Follow-ups**: list of TIP paths that downstream stages must consume.
