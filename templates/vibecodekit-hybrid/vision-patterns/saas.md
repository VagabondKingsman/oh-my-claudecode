# Vision Pattern — SaaS App

> Authenticated multi-tenant application where users perform repeated jobs-to-be-done.

## Structural signature
- Auth (signup / login / password reset / SSO optional).
- Shell layout: top bar + left nav + main content + right details panel (optional).
- Multiple "workspaces" or "projects" owned by a user/team.
- Billing / plan entitlements.

## Canonical layout
1. **Marketing surface** (small) — landing / pricing / docs.
2. **Auth surface** — signup / login / forgot / verify.
3. **App shell**:
   - Top bar: workspace switcher, global search, notifications, user menu.
   - Left nav: primary sections (Home, Projects, Integrations, Settings).
   - Main area: list → detail patterns.
4. **Settings**: profile, team, billing, security, integrations.
5. **Onboarding**: first-run checklist / empty states with next-action CTAs.

## Default tech stack (suggestion)
- Frontend: Next.js 14 (App Router) + Tailwind + shadcn/ui
- Backend: Next.js API routes or tRPC; Node/NestJS or Python/FastAPI if heavier
- DB: Postgres (Supabase / Neon / RDS)
- Auth: Supabase / Clerk / Auth.js
- Billing: Stripe (Checkout + Customer Portal)
- Queue: BullMQ / Inngest / Cloud Tasks (when async needed)

## Non-goals
- Public unauthenticated read-heavy content (use blog/landing pattern).
- Offline-first (specialist pattern; trigger Custom).

## Persona focus (RRI)
- **End User**: can I finish my top-3 tasks in ≤ 3 clicks each?
- **Business Analyst**: are plan limits, permissions, and audit trail correct?
- **QA Destroyer**: tenant isolation, auth edge cases, stale sessions.
- **DevOps**: deploy, rollback, env vars, DB migrations, secrets, observability.
- **Security**: authN + authZ, rate limits, CSRF/CORS, PII.

## Flow Physics (RRI-UX) priorities
- CLICK DEPTH: top-3 jobs ≤ 3 clicks from home
- RETURN PATH: always visible breadcrumb or back action
- TASK SWITCH: workspace switcher visible at all times
- VIEWPORT: list/detail split viable on ≥1280px; stacks on mobile

## Acceptance skeleton
```
Given a new user signs up
When they complete onboarding
Then they can create their first workspace + first object in < 2 minutes
And switching workspaces preserves selected section
```
