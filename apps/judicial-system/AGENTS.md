# Judicial System — Agent Guide

## Localization strings

We are moving away from Contentful. **Do not add new Contentful-backed
localization strings** — whether in `.strings.ts` files, `messages/` modules,
`notifications.ts`, or anywhere else using `defineMessage` / `defineMessages`.
New user-facing text should be hardcoded directly where it is used (e.g. template
literals in the calling code). Existing strings may stay as-is until migrated.

## Async style

**Prefer `async`/`await` over chained `.then()`/`.catch()`.** Await promises and
handle their results with straight-line code rather than promise chains — it
reads better and keeps error handling consistent. Make the enclosing function
`async` when needed (a `Promise`-returning function is fine where a fire-and-
forget callback is expected).

## Codegen

Regenerate after changing GraphQL schema/resolvers, REST controllers/DTOs, or
shared types in `@island.is/judicial-system/types`.

| Project | Command                                                      | Output                                          |
| ------- | ------------------------------------------------------------ | ----------------------------------------------- |
| backend | `yarn nx run judicial-system-backend:codegen/backend-schema` | `apps/judicial-system/backend/src/openapi.yaml` |
| api     | `yarn nx run judicial-system-api:codegen/backend-schema`     | `apps/judicial-system/api/src/api.graphql`      |
| web     | `yarn nx run judicial-system-web:codegen/frontend-client`    | generated GraphQL client/types                  |

Notes:

- **message-handler has no codegen target** — nothing to run there.
- `digital-mailbox-api` and `xrd-api` also expose `codegen/backend-schema` if you
  touch their controllers.
- Codegen type-checks/boots the app first, so it fails on any TypeScript error in
  the project — fix compile errors before assuming codegen is broken.
- To regenerate everything across the whole repo: `yarn codegen`.
- Docs: https://docs.devland.is/repository/codegen
