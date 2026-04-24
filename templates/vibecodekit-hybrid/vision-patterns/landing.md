# Vision Pattern — Landing Page

> Single-page marketing site that converts visitors on first scroll.

## Structural signature
- One long scroll page; no logged-in state.
- 6-9 sections. 1-2 primary CTAs that recur.
- Above-the-fold must communicate what + who + why in 5 seconds.

## Canonical layout
1. **Hero** — headline, sub, primary CTA, hero visual.
2. **Social proof strip** — logos / press / metrics.
3. **Problem** — what the user struggles with today.
4. **Solution** — the product's thesis + primary CTA (secondary placement).
5. **Features** — 3-6 concrete capabilities with short icons + copy.
6. **How it works** — 3 steps (verbs + outcomes).
7. **Testimonials / case studies**.
8. **Pricing / waitlist** — CTA.
9. **FAQ** — 5-8 objections handled.
10. **Footer** — minimal links, legal, contact.

## Default tech stack (suggestion, not mandate)
- Framework: Next.js 14 (App Router) or Astro
- Styling: Tailwind CSS
- Content: MDX or CMS (Sanity / Contentlayer) if non-dev editors exist
- Analytics: PostHog / Plausible
- Deploy: Vercel / Cloudflare Pages

## Non-goals
- Accounts / auth / dashboards. If needed, this is probably a SaaS pattern instead.
- Infinite scroll / virtualisation.

## Persona focus (RRI)
- **End User**: can I tell what this is in 5 seconds?
- **Business Analyst**: is the value prop + pricing clear and unambiguous?
- **QA Destroyer**: broken images, misaligned CTAs on mobile, slow LCP.

## Flow Physics (RRI-UX) priorities
- SCROLL: ≤ 2 full viewport heights to primary CTA
- EYE TRAVEL: headline → CTA in one diagonal
- DECISION LOAD: ≤ 2 CTAs above the fold
- TIME TO ACTION: CTA reachable within 3s

## Acceptance skeleton
```
Given a first-time visitor on desktop or mobile
When they land on the page
Then LCP < 2.5s, CLS < 0.1, primary CTA is visible above the fold
And bounce reason is not "what is this?"
```
