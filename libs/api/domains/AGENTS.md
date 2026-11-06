# GraphQL API domains

NestJS modules (resolvers, services, models, mappers) merged into the shared GraphQL API (`apps/api`), usually wrapping clients from `libs/clients/`. Reference examples: `university-careers/src/lib/resolvers/studentTrack.resolver.ts` (guards, scopes, auditing, a manually audited `@ResolveField`), `health-directorate/src/lib/resolvers/healthConversations.resolver.ts` (pagination, per-query scopes, a DataLoader-batched `@ResolveField`) and `ShipRegistryUserShip` (ids). Naming rules: https://docs.devland.is/technical-overview/api-design-guide/graphql-naming-conventions. Creating a module: `libs/api/README.md`.

## Boundaries

- Modules belong to different teams (`.github/CODEOWNERS`). Check ownership before changing another team's module. New resolver classes get `@CodeOwner(CodeOwners.<team>)` (decorator from `@island.is/nest/core`, enum from `@island.is/shared/constants`); a method you add to another team's resolver gets its own.
- `index.ts` never exports the resolver. Export a service or model only when another module imports it.
- Register a new module in `apps/api/src/app/app.module.ts`, and a new client's config in its `ConfigModule.forRoot({ load })`.
- When a module's existing code breaks these rules, follow the rules for new code; don't copy the module's style.

## Guards and auditing

- Guards aren't global: a resolver serving user data needs `@UseGuards(IdsUserGuard, ScopesGuard)`. `@Scopes` without `ScopesGuard` enforces nothing; `ScopesGuard` without `@Scopes` lets any token through. Several scopes in one `@Scopes` means any one of them.
- A method-level `@Scopes`/`@FeatureFlag` replaces the class-level one; to require both scopes, check the extra one manually.
- A public query uses `@BypassAuth()` in a class without class-level `@Scopes`.
- `@FeatureFlag(Features.x)` needs `FeatureFlagGuard` in `@UseGuards` and `FeatureFlagModule` in the module imports; `FeatureFlagGuard` without `@FeatureFlag` gates nothing. Flags are declared in `libs/feature-flags/src/lib/features.ts`.
- Class-level `@Audit({ namespace })` audits nothing alone; each `@Query`/`@Mutation` needs `@Audit()`.
- `@ResolveField` only attaches when the class has `@Resolver(() => Parent)`. Guards and interceptors don't run on it: the parent query's guards cover it, `@FeatureFlag` doesn't gate it, a stricter scope needs a manual `user.scope.includes(...)` check that throws `ForbiddenException`, and auditing needs a manual `auditService.audit(...)`.

## Modelling

- A type models one thing the user knows (a sailor, a licence, a police case), named in the user's words, not a client DTO or endpoint. One type may combine several client calls and one DTO may split into several types: `ShipRegistrySailor` covers five client endpoints, each a `@ResolveField` on it or on its nested `ShipRegistrySailorCertificates`.
- Expose what a consumer needs, not every DTO field. Field and input names are domain-facing, never the client's names or codes.
- Before adding a type or query, check whether one already represents the thing; extend it (a field, or a `@ResolveField` on the type the data belongs to) instead of adding a parallel one.
- Values derived by a rule (counts, status, eligibility, "latest") are computed in the domain, so every frontend gets the same answer.

## Schema

- Every `@ObjectType`, `@InputType`, `registerEnumType`, query and mutation name carries the module prefix (none when the type is the module name, e.g. `Identity`); the class name may be shorter if the decorator string sets it. A query is named after its type (plural for lists); a mutation is verb first (`createProjectXUser`).
- A root query returning an unbounded list returns a `PaginatedResponse` (`@island.is/nest/pagination`) subclass.
- New GraphQL enum values (the TS enum keys) are ALL_CAPS.
- A kennitala field is named `nationalId`, in the form `##########` (no hyphen).
- Root `@Query` fields are `nullable: true`, or one failing service nulls the whole response.
- Model fields use `field?: type`, never `| null`. Dates are `Date` fields, never formatted strings.
- Types a frontend caches on their own (fetched by id, or updated after a mutation) have a unique, non-nullable `id` built in the domain: composite if needed, never an array index, never a kennitala or anything derived from one (hashes included). If a type's only natural key is a kennitala, ask before choosing an `id`; don't drop the rows.
- A `@ResolveField` on a type that list queries also return runs once per item: batch it with a DataLoader or keep it off list item types.
- Anything a consumer branches on is a GraphQL enum with domain-facing values, not a raw string.
- Bilingual source fields (`{ is, en }` or `name`/`nameEn` pairs) are resolved server-side from a locale argument. Prefer `LocaleEnum` (`@island.is/nest/graphql`) over a `String`/`Locale` argument and string comparisons. Locale goes in `id` only when the mapped data differs per locale.
- Breaking changes: removing or renaming a field, type or enum value, changing a field's type, making an output field nullable, or making an argument or input field required. Deprecate with a `deprecationReason` naming the replacement instead of removing.

## Mappers

An item missing its identifier maps to `undefined` and is filtered with `isDefined` (`@island.is/shared/utils`); never fill a non-nullable field with `?? ''`/`?? 0`; make it nullable.

## Messages

Text from a module's `messages.ts` goes through `IntlService` (`CmsTranslationsModule`). Messages reach Contentful through the module's `extract-strings` target, which writes to Contentful, so a person runs it, not an agent.

## Schema output

`apps/api/src/api.graphql` is gitignored: run `yarn nx run api:codegen/backend-schema` to generate it.
