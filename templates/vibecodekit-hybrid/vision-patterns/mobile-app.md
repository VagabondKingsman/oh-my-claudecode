# Vision Pattern — Mobile App

> Native or cross-platform mobile application with offline-tolerant state and touch-first ergonomics.

## Structural signature
- Hand-held runtime: 360-430dp width, one-thumb reach, interrupt-driven (calls, notifications).
- Explicit screens with a tab bar or stack navigator — **not** a SPA with deep links inside one page.
- State survives kill-and-relaunch; network is assumed unreliable.
- Platform conventions (iOS ≠ Android) must be respected, not fought.

## Canonical layout
1. **Onboarding** — 2-4 screens max; skippable; asks for permissions just-in-time, not upfront.
2. **Home / Tab 1** — the default destination the user returns to. Must be useful with 0 data.
3. **Primary tabs (3-5)** — bottom tab bar on iOS, bottom nav on Android. No hamburger for top-level.
4. **Detail screen** — drill-in with a back gesture + deep-link target.
5. **Create / Action sheet** — center tab or FAB for the one most important write action.
6. **Profile / Settings** — account, notifications, privacy, sign out.
7. **Error + empty states** — every list and every screen has a designed zero / offline / error state.

## Default tech stack (suggestion, not mandate)
- Framework: React Native (Expo) or Flutter
- State: Zustand / Redux Toolkit (RN) or Riverpod (Flutter)
- Persistence: MMKV / SQLite (with migration strategy)
- Networking: TanStack Query / Dio with retry + offline queue
- Analytics: PostHog / Amplitude mobile SDK
- Crash: Sentry
- Deploy: EAS / Fastlane + TestFlight + Play Internal Testing

## Non-goals
- Responsive "works on tablet too" is a separate pattern if it's the primary form factor.
- Pixel-perfect parity with the marketing site — mobile is a different product surface.
- Replacing native capabilities with webviews unless the feature is literally unavailable otherwise.

## Persona focus (RRI)
- **End User**: can I do the primary action one-handed while walking?
- **Business Analyst**: how does offline affect billing / consent / auditable events?
- **QA Destroyer**: airplane mode mid-action, background-kill during upload, permission revoked in Settings, low-memory kill, deep-link to signed-out state.
- **Developer**: OTA update story, breaking-change migration for on-device DB, reproducible crash from Sentry → local.
- **DevOps / Operator**: binary-size budget, rollout staging (phased release), privacy policy + store listing compliance.

## Flow Physics (RRI-UX) priorities
- CLICK DEPTH: primary action reachable in ≤ 2 taps from launch
- TIME TO ACTION: first useful screen < 1.5s cold start, < 400ms warm
- DECISION LOAD: ≤ 5 top-level tabs; never a hidden drawer for the default flow
- TASK SWITCH: state survives app-switch, incoming call, notification tap, deep-link relaunch
- VIEWPORT: thumb-zone for primary CTA; no critical controls in the top-left

## Vietnamese-first checks (when `OMC_LOCALE=vi`)
- VND format everywhere money appears (`1.200.000 ₫`, Vietnamese locale separator).
- Dates default `DD/MM/YYYY`.
- Vietnamese text stays readable at 13sp — no 10pt legalese, no forced uppercase (VN diacritics break).
- CCCD / CMND identity fields validate length 9 / 12, Vietnamese diacritic-insensitive search on names.
- SMS-OTP paths handle Viettel / Vinaphone / Mobifone delivery latency gracefully.

## Acceptance skeleton
```
Given a user opens the app on a mid-range Android device on 3G
When the cold-start completes
Then Home is interactive in < 1.5s and reflects last-known cached state
And the primary action succeeds offline (queued, user sees pending state)
And when the network returns, the queue drains without duplicates
And killing the app mid-action never loses a previously-saved draft
```
