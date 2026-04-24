# Verify Report — RRI-Reverse

> Produced by `vibecodekit-hybrid-verify` after BUILD. Confirms delivery against the Blueprint through four lenses:
> 1. Requirement Traceability
> 2. Scenario Walkthrough per Persona
> 3. Stress / Edge / Failure Scenarios
> 4. Technical Health Check

## 0. Scope of this verify run
- Blueprint path: `{{BLUEPRINT_PATH}}`
- Commit range: `{{BASE}}..{{HEAD}}`
- Environment: local / CI / preview URL

## 1. Requirement Traceability
For every row in the Blueprint's *RRI Requirements Matrix*, record where it was implemented and whether it is covered by a test.

| # | Requirement | Implemented at (file:line) | Test reference | Verdict |
|---|-------------|----------------------------|----------------|---------|
| 1 | | | | PASS / FAIL / PAINFUL / MISSING |

Verdicts:
- `PASS` ✅ — requirement implemented and covered by an automated or manual test with evidence
- `FAIL` ❌ — requirement not implemented or broken
- `PAINFUL` ⚠️ — works but violates UX / performance / maintainability expectations
- `MISSING` 🔲 — implementation present but no verifying test

## 2. Scenario Walkthrough per Persona
Run the 5 RRI personas through the most important flows. Summarise each persona's experience in 3-5 bullets.

- **End User** — daily happy path
- **Business Analyst** — compliance / business rules
- **QA Destroyer** — boundary, invalid input, concurrency
- **Developer** — ergonomics, build, debuggability
- **DevOps / Operator** — deploy, scale, observe, rollback

For RRI-T deployments also add:
- **Security Auditor** — authN/authZ, data exposure, injection, secrets

## 3. Stress / Edge / Failure Scenarios
At least one scenario per stress axis that applies to the project:

- Time pressure (slow network, timeouts)
- Data volume (empty / 1 / 10k / 1M rows)
- Error injection (bad input, 5xx upstream, DB down)
- Collaboration / concurrency (multiple users / tabs / sessions)
- Emergency / recovery (crash mid-transaction)
- Locale edges (Vietnamese diacritics, VND formatting, DD/MM/YYYY, CCCD/CMND)
- Infra failure (disk full, OOM)
- Security attack (XSS, SSRF, auth bypass attempt)

Each row must include: setup, action, expected, actual, verdict.

## 4. Technical Health Check
| Check | Evidence | Verdict |
|-------|----------|---------|
| Build green | CI link / command output | PASS / FAIL |
| Tests green | CI link | PASS / FAIL |
| Lint / format clean | diff | PASS / FAIL |
| No new `TODO` / `FIXME` left behind in production code | grep diff | PASS / FAIL |
| No new dependencies without justification in Blueprint | `git diff package.json` | PASS / FAIL |
| Security: no new `.env`, secret, credential files committed | grep | PASS / FAIL |

## 5. Overall Verdict
One of: **SHIP** / **SHIP WITH FOLLOW-UPS** / **DO NOT SHIP**.

If **SHIP WITH FOLLOW-UPS** or **DO NOT SHIP**, list all required follow-ups as TIPs for the next REFINE iteration.
