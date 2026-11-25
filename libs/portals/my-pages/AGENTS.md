# My Pages modules

Feature modules for My Pages (Mínar síður, island.is/minarsidur), the self-service portal for individuals and companies. Most folders export a `PortalModule` (contract: `libs/portals/core/README.md`, types: `libs/portals/core/src/types/portalCore.ts`) loaded by the app shell in `apps/portals/my-pages`. `core/`, `constants/` and `graphql/` are shared support libs; the delegations module lives in `libs/portals/shared-modules`.

## Boundaries

- Modules belong to different teams (`.github/CODEOWNERS`). Check ownership before changing another team's module or `core/`.
- Reference for new overview/detail screens: `assets/src/screens/Ships`.

## Registration and visibility

- Register a module in `apps/portals/my-pages/src/lib/modules.ts`, and add its `lib/navigation.ts` export to `MAIN_NAVIGATION` in `apps/portals/my-pages/src/lib/masterNavigation.ts`.
- A nav card shows only when its `path` exactly matches a generated route path. A route with `enabled: false` shows a locked card, not a hidden one. A nested nav item gets its own dashboard card through `customShortcut` (see `assets/src/lib/navigation.ts`).
- Routes with `dynamic: true` stay hidden until their path is added to `DynamicPaths` and the fetch condition in `core/src/hooks/useDynamicRoutes`.
- Company users get `companyRoutes` instead of `routes` when a module defines it (`signature-collection`), or a separate company-only module (`companyInformationModule` in `information/src/module.tsx`). Each route checks its own scope.
- Feature flags: gate a whole module with `featureFlag` on the `PortalModule`; gate one screen with `key: Features.x` on its route, which also hides its nav card. Don't add new string-form `key`s. Flags are declared in `libs/feature-flags/src/lib/features.ts`.
- A new `@island.is/...` scope goes in `libs/auth/scopes/src/lib/clients/service-portal-scopes.ts`; then run `yarn charts`, and make sure the scope exists in IDS; for company users it must be granted to procuring holders.

## Paths are public

Paths in `lib/paths.ts` are also hardcoded in native app deep links (`apps/native/app/src/lib/deep-linking.ts`, `my-pages-links.ts`), `DynamicPaths` in core, `libs/portals/core/src/utils/filterNavigationTree/filterNavigationTree.ts` and the Contentful dashboard ordering. When renaming one, keep a `<Navigate replace />` at the old path; `<Navigate>` drops params, so an `:id` path needs a small `useParams` wrapper.

## Messages

- Module messages live in `lib/messages.ts` under `sp.*` namespaces. Nav names and descriptions use `service.portal` and search tags use `sp.search.tags` (both in `core/src/lib/messages.ts`), because the shell preloads only those (`apps/portals/my-pages/src/components/Layout/Layout.tsx`).
- New or changed messages reach Contentful through the project's `extract-strings` target. It writes to Contentful, so a person runs it, not an agent.

## GraphQL

Queries sit beside their screen as `<Screen>.graphql`. `apps/api/src/api.graphql` and `*.generated.ts` are gitignored: run `yarn nx run api:codegen/backend-schema` before checking fields against the schema, then `yarn nx run portals-my-pages-<module>:codegen/frontend-client`.

## Analytics

The shell already sends a masked pageview per route. Custom Plausible events go through `libs/plausible/src/lib/servicePortalEvents.ts`; always pass the route pattern as the second argument to `formatPlausiblePathToParams` (`@island.is/portals/my-pages/core`), or identifiers leak.
