---
name: vibecodekit-hybrid-scan
description: SCAN stage of vibecodekit-hybrid — produces a structured brownfield/greenfield scan report
argument-hint: "<slug> [path]"
next-skill: vibecodekit-hybrid-rri
handoff: .omc/research/vibecodekit-hybrid-scan-*.md
level: 2
---

<Purpose>
Stage 1 of the Vibecodekit Hybrid pipeline. Generates a canonical SCAN report so downstream stages (RRI, VISION, BLUEPRINT) can skip any question the codebase already answers. The report follows the schema in `templates/vibecodekit-hybrid/scan-report.md`.
</Purpose>

<Use_When>
- Called by `vibecodekit-hybrid` as the first stage.
- User says "scan this repo for vibecodekit" or "make me a vibecodekit scan report".
- User wants a structured tech-stack + modules + gaps report for any purpose (not just building).
</Use_When>

<Do_Not_Use_When>
- Repo has no code yet AND user has no external context → skip to RRI.
- User wants full code analysis → use `analyst` or `explore` directly.
</Do_Not_Use_When>

<Why_This_Exists>
RRI interviews go faster and feel less bureaucratic when the interviewer knows the repo. Auto-answered questions (stack detection, build tooling, existing patterns) must be filtered out of the interview. A standalone SCAN skill keeps this filter deterministic and reusable.
</Why_This_Exists>

<Execution_Policy>
- Delegate discovery to the `explore` agent (haiku) for speed.
- Read `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `Gemfile`, `pom.xml`, `build.gradle*`, `Dockerfile`, `docker-compose*.y*ml`, `.github/workflows/*`, `.gitlab-ci.yml` if present.
- Read top-level README(s) to understand declared purpose.
- Never dump file contents into the report — summarise.
- Cap total scan time at ~5 minutes wall-clock.
</Execution_Policy>

<Steps>
1. Resolve `<slug>` (from arg 1) and `<path>` (default `process.cwd()`).
2. Delegate codebase enumeration to `explore` agent:
   - Languages + file counts
   - Frameworks (frontend, backend, test, CI)
   - Entry points (`main.*`, `index.*`, `src/index.*`, `cmd/**`)
   - Testing setup
   - CI pipelines
3. Classify repo as Greenfield (near-empty / scaffold-only) or Brownfield (substantial code + patterns).
4. Read the top-level README to capture declared purpose + audience.
5. **Locale auto-detection** (Phase 3 / extended in Phase 4e). Run in order; the **first signal that fires wins**:
   1. Explicit override: `.omc/locale.json` has `{"locale":"vi"}` (or `"ja"`) → set detected locale to that value.
   2. Env var: `OMC_LOCALE=vi` → `vi`. `OMC_LOCALE=ja` → `ja`. (Phase 4e)
   3. User flag: `--locale vi` (or `--locale ja`) passed to the orchestrator. (Phase 4e)
   4. README heuristic: read `README.md` (fallback `README.vi.md` / `README.ja.md`).
      - If `vowels_with_VN_diacritic / total_vowels > 0.08` over any 400-char window → `vi`.
      - If any 400-char window has `count_of_codepoints_in_[\u3040-\u30FF\u4E00-\u9FFF] / total_chars > 0.20` → `ja`. (Phase 4e — Hiragana / Katakana / CJK Unified Ideographs)
   5. Manifest heuristic: if `package.json` `description` / `author.name` / `keywords` (or equivalent in `pyproject.toml` / `Cargo.toml`) contain VN diacritic chars (`À-ỹ`, excluding `Ư`/`Ơ` singletons used in tech names) → `vi`. If they contain any Hiragana / Katakana codepoint → `ja`. (Phase 4e)
   6. Default: `en`.
   Record the winning signal in the scan report's **Locale** section (signal name + evidence snippet). A non-default locale MUST be echoed back to the orchestrator so the rest of the pipeline picks it up without an explicit flag.
6. Identify **Gaps / Smells**: missing tests, inconsistent conventions, obvious tech-debt hotspots.
7. Record **Health Signals**: last commit date, CI status (if visible), coverage (if reported).
8. List **Ready-to-answer questions** (things RRI must NOT re-ask) and **Still-open questions** (things RRI must ask).
9. Write the report to `.omc/research/vibecodekit-hybrid-scan-<slug>.md` using the template.
10. Return a ≤ 10-line summary to the caller + the artifact path + detected locale.
</Steps>

<Handoff_Contract>
- Input: `<slug>`, optional `<path>`.
- Output: `.omc/research/vibecodekit-hybrid-scan-<slug>.md`.
- Next skill: `vibecodekit-hybrid-rri`.
</Handoff_Contract>

<Final_Checklist>
- [ ] Report has all sections from the template (leave empty ones as `N/A — greenfield`)
- [ ] Ready-to-answer list ≥ 3 items (so RRI can skip them)
- [ ] Still-open list ≥ 5 items (otherwise the scan was too shallow)
- [ ] Artifact path returned to caller
- [ ] Locale detection recorded with the winning signal + evidence snippet
- [ ] Detected non-default locale echoed back to caller so downstream stages inherit it
</Final_Checklist>
