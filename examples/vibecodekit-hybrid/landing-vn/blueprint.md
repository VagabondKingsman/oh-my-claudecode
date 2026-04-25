# Blueprint — landing-vn

> Frozen excerpt of `.omc/plans/vibecodekit-hybrid-landing-vn.md` for the `landing-vn` worked example. Keep headings in English even for `OMC_LOCALE=vi`.

## Metadata

| Key | Value |
|-----|-------|
| slug | landing-vn |
| pattern | landing |
| locale | vi |
| approved | yes |
| date | 2026-04-24 |

## Vision summary

Single-page marketing site for a yoga studio. Above-the-fold hero with "Đặt lịch thử" CTA, class schedule grid, pricing in VND, trainer carousel, testimonial section, contact form. No auth. No backend beyond a Google Sheet webhook.

## RRI Requirements Matrix (excerpt)

| ID | Persona | Requirement | Priority | Acceptance (Given/When/Then) |
|----|---------|-------------|----------|------------------------------|
| REQ-001 | End User | Book a trial class without scrolling | P0 | Given the home page loaded on a 375 px viewport / When it renders / Then the primary CTA is within the first 100 vh. |
| REQ-002 | End User | Read pricing in VND | P0 | Given any plan card / When it renders / Then the price is formatted `250.000 ₫` (dot thousands separator). |
| REQ-003 | End User | Submit the contact form with a Vietnamese name | P0 | Given the form / When a user enters `Nguyễn Thị Hồng Ánh` / Then the field retains diacritics and the form submits. |
| REQ-004 | Business | Honor DD/MM/YYYY date format | P1 | Given any date input / When the page loads in VN locale / Then the placeholder is `23/02/2026`. |
| REQ-005 | QA Destroyer | Tolerate diacritic-insensitive search | P1 | Given the class finder / When a user searches `yoga co` / Then results including `yoga cơ bản` appear. |
| REQ-006 | DevOps | No hard-coded secrets | P0 | Given the repo / When scanned / Then `.env.example` exists and the live webhook is only in `.env` (gitignored). |

## Task Decomposition Preview

1. Scaffold Next.js app router project with Tailwind + VN-first font stack.
2. Implement hero + CTA (sticky on mobile).
3. Build schedule grid + pricing cards with VND formatter.
4. Build contact form with VN phone mask + CCCD-tolerant name field.
5. Wire Google Sheet webhook via env var.
6. Probe responsive at 375 / 768 / 1440 px with longest VN string.
7. Run `vibecodekit-hybrid-verify` with 4-level verdict.

## Non-goals (from vision pattern)

- No authentication.
- No CMS — copy is part of the repo.
- No analytics dashboard in Phase 1.
