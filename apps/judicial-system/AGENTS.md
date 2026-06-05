# Judicial System — Agent Guide

## Codegen

Regenerate after changing GraphQL schema/resolvers, REST controllers/DTOs, or
shared types in `@island.is/judicial-system/types`.

| Project | Command | Output |
|---|---|---|
| backend | `yarn nx run judicial-system-backend:codegen/backend-schema` | `apps/judicial-system/backend/src/openapi.yaml` |
| api | `yarn nx run judicial-system-api:codegen/backend-schema` | `apps/judicial-system/api/src/api.graphql` |
| web | `yarn nx run judicial-system-web:codegen/frontend-client` | generated GraphQL client/types |

Notes:
- **message-handler has no codegen target** — nothing to run there.
- `digital-mailbox-api` and `xrd-api` also expose `codegen/backend-schema` if you
  touch their controllers.
- Codegen type-checks/boots the app first, so it fails on any TypeScript error in
  the project — fix compile errors before assuming codegen is broken.
- To regenerate everything across the whole repo: `yarn codegen`.
- Docs: https://docs.devland.is/repository/codegen
