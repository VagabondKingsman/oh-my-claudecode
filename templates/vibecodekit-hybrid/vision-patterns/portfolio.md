# Vision Pattern — Portfolio / Showcase

> Personal or studio site that demonstrates work and routes to contact.

## Structural signature
- Strong visual identity (distinctive typography + motion).
- 3-15 projects shown as case studies.
- One clear contact / hire CTA.

## Canonical layout
1. **Hero**: name / studio, one-liner, hero visual.
2. **Selected work**: grid of 3-9 projects with thumbnail + short label.
3. **Case study page** per project:
   - Problem / role / stack.
   - Hero image / video.
   - Body: challenge, process, outcome, evidence.
   - Next / previous project.
4. **About** (optional).
5. **Contact / hire** — single dominant CTA with fallback (email, Calendly, form).

## Default tech stack (suggestion)
- Framework: Astro / Next.js / Nuxt
- Motion: Framer Motion / GSAP for the hero and transitions only
- Images: next/image or @astro/image with proper AVIF/WebP
- CMS (if non-dev editor): Sanity / Notion

## Non-goals
- Accounts, carts, dashboards, complex filtering.
- Per-case-study heavy JS bundles.

## Persona focus (RRI)
- **First-Timer**: do I get the story in 10 seconds?
- **Field Worker** (recruiter on phone): is the site legible on mobile in one thumb?
- **Designer**: typography, spacing, motion intentionality.

## Flow Physics (RRI-UX) priorities
- EYE TRAVEL: hero → CTA in one diagonal
- CLICK DEPTH: any case study ≤ 2 clicks from home
- SCROLL: case study consumable in ≤ 3 viewports
- RETURN PATH: "back to work" persistently visible

## Acceptance skeleton
```
Given a visitor on mobile
When they open any case study
Then the hero image is visible within 2s (LCP)
And the contact CTA is reachable within one scroll
```
