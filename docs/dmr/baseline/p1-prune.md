# P1 — Light prune (apps-only)

Status: **GREEN** — all 7 judicial services build after deleting the 21 non-judicial apps.
Date: 2026-10-19 · Branch: `chore/judicial-prune` · Gate: `nx run-many build` (7/7) → rc=0, ~200s cold.

## What was deleted
All 21 non-judicial `apps/*` directories (kept only `apps/judicial-system/`):
air-discount-scheme, api, application-system, auth-admin-web, consultation-portal,
contentful-apps, download-service, financial-aid, form-system, github-actions-cache,
icelandic-names-registry, native, payments, portals, reference-backend,
reference-next-app, services, skilavottord, system-e2e, tools, web.

`apps/` dropped from ~500 MB to **22 MB**. 7054 files, ~574k lines deleted.

**Correction (2026-10-20, `0960706fbe`):** deleting `system-e2e` also removed the judicial
Playwright suite — it is not in the Nx build graph, so the closure check missed it.
`apps/system-e2e` is restored judicial-only (10 specs, 61 tests; islandis tests and
islandis-only support files removed). Kept apps are now `apps/judicial-system/` + `apps/system-e2e/`.

## Pre-delete safety check (why this is safe)
Verified via the Nx project graph **before** deleting:
- The judicial build closure is **54 projects** and contains **zero** non-judicial `apps/*` projects.
- Judicial is fully independent of the 5 apps that other kept libs still reference
  (`services`, `application-system`, `air-discount-scheme`, `financial-aid`, `skilavottord`).
- `apps/api` (island.is gateway): nothing surviving depends on the *app*; the gateway
  *schema* is the separate lib `libs/api/schema` (kept for now — deeper lib prune later).

## Config cleanup required by the prune
1. **`package.json`**: `workspaces` was `["apps/native/*"]` → set to `[]` (native deleted).
   Triggered a lockfile resync: **333 packages / 119 MiB removed** — all React-Native
   deps that only `apps/native` pulled in. No judicial dep touched.
2. **`tsconfig.base.json`**: removed 7 path mappings pointing at deleted apps
   (air-discount-scheme-web, consultation-portal, financial-aid-web osk/veita,
   skilavottord-web, web/*, web/component*). All lib mappings preserved.
3. **18 lib `project.json`** had `implicitDependencies` on now-deleted backend apps
   (e.g. `clients-payments` → `services-payments`). Nx refuses the whole project graph
   with `WorkspaceValidityError` until these dangle-free. Removed only the dangling
   entries, then re-ran Prettier to keep diffs to one line each.

## Carry-forward (deeper prune / later phases)
- **~100 surviving libs still import `@island.is/api/schema`** (gateway schema). They are
  NOT in the judicial closure, so they don't break the judicial build — but they keep
  `libs/api/schema` (and its codegen input `apps/api/src/api.graphql`) alive. Since
  `apps/api` is deleted, that codegen input no longer regenerates; those libs would fail
  an out-of-closure typecheck/lint. This is the **deeper libs/ dependency-closure prune**
  (explicitly deferred by the EPIC). Judicial is unaffected.
- `infra/` kept untouched (still has the DSL; retire in P3).
- CI reminder (from P0): node 22.22.3 + JDK, and run the 3 codegen steps in order.
