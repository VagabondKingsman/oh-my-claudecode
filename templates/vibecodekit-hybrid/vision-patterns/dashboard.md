# Vision Pattern — Dashboard / Analytics

> Data-dense surface where users monitor KPIs, filter, drill, export.

## Structural signature
- High information density. Charts, tables, filters, date ranges.
- Read-heavy; occasional write (annotations, saved views).
- Power users (Data Scanner + Multi-Tasker UX personas dominate).

## Canonical layout
1. **Header**: title, date range picker, filter pills, refresh, export.
2. **KPI strip**: 4-8 top metrics with trend vs previous period.
3. **Primary chart**: large, interactive (hover tooltip, legend, zoom).
4. **Secondary charts / tables**: grid of smaller widgets.
5. **Drill-down drawer / detail panel**: on row click, open side drawer, don't navigate away.
6. **Saved views / alerts** (optional).

## Default tech stack (suggestion)
- Charts: Recharts / Tremor / ECharts / D3 (last for bespoke)
- Tables: TanStack Table (virtualised for > 1k rows)
- Data: server-side pagination + filtering; avoid client-side when > 10k rows
- Query layer: tRPC / GraphQL / REST with caching (React Query / SWR)

## Non-goals
- Transactional write flows — those belong in SaaS / Enterprise patterns.
- Slow full-page reloads on filter change (use client state + incremental fetch).

## Persona focus (RRI)
- **Data Scanner**: can I F-pattern scan the KPI strip in < 2s?
- **Multi-Tasker**: can I open a second view without losing context?
- **Power User**: keyboard shortcuts for filter / date range / export.
- **BA**: definitions of each metric are discoverable ("?" tooltip with formula).

## Flow Physics (RRI-UX) priorities
- EYE TRAVEL: KPI strip readable in one horizontal sweep
- DECISION LOAD: ≤ 7 primary filters visible; rest behind "More"
- VIEWPORT: widgets reflow at 1280 / 1024 / 768
- RETURN PATH: drill-down drawer closes to the exact scroll position

## Acceptance skeleton
```
Given a user with > 10k rows of data
When they change the date range
Then the dashboard updates within 1s (p95)
And the URL reflects the filter state (shareable links)
```
