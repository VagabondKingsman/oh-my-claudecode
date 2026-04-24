# Vision Pattern — Enterprise Module

> A feature module inside a larger, existing enterprise application. Integration constraints dominate the design.

## Structural signature
- Lives inside an existing codebase with established conventions.
- Must honour existing auth, RBAC, audit, logging, and i18n.
- Often gated by feature flags and staged rollouts.

## Canonical layout
Follow the host application. Typical shape:
1. **Module entry point** registered in the host shell's navigation / router.
2. **List view** of domain objects with filters + bulk actions.
3. **Detail / edit view** with tabs for sub-sections.
4. **Admin / settings sub-view** (permissions, defaults).
5. **Reports / exports** if relevant.

## Integration checklist (MUST before BUILD)
- [ ] Routing conventions (file-based vs explicit route table)
- [ ] Auth / RBAC: which permission scopes gate this module?
- [ ] Audit logging hook points
- [ ] Observability: logs, traces, metrics naming conventions
- [ ] i18n keys namespace + ICU format conventions
- [ ] Feature flag provider + flag naming
- [ ] Data access layer (repository / ORM / service) pattern
- [ ] Error handling + user-facing error surface conventions
- [ ] Test conventions: unit / integration / e2e layouts
- [ ] CI pipeline stages that must pass

## Default tech stack (suggestion)
Do **not** introduce a new stack. Inherit the host application's stack. If a gap exists (e.g. charts), propose the **smallest additive dependency** and document the rationale in BLUEPRINT §4.

## Non-goals
- Replacing host-app design system or build tooling.
- Greenfield styling or routing decisions.

## Persona focus (RRI)
- **Developer (host-app maintainer)**: does this module match existing conventions?
- **BA**: compliance, auditability, reporting.
- **DevOps**: deploy shape, migration story, rollback plan.
- **Security**: least-privilege scopes, no new trust boundaries without review.

## Flow Physics (RRI-UX) priorities
- Match the host shell's spacing, typography, components. Deviation is a smell.
- CLICK DEPTH and RETURN PATH inherit host conventions.

## Acceptance skeleton
```
Given an existing user with role X in the host app
When they navigate to the new module
Then they see only the permitted data
And all actions emit the standard audit events
And no new dependencies were added outside BLUEPRINT §4
```
