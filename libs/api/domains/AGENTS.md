# GraphQL API domains

NestJS modules (resolvers, services, models, mappers) merged into the shared GraphQL API (`apps/api`), usually wrapping clients from `libs/clients/`. Reference: `ship-registry` (`resolvers/sailors.resolver.ts` for guards, field resolvers and auditing; `ShipRegistryUserShip` for ids). Naming rules: https://docs.devland.is/technical-overview/api-design-guide/graphql-naming-conventions. Creating a module: `libs/api/README.md`.

## Boundaries

- Modules belong to different teams (`.github/CODEOWNERS`). Check ownership before changing another team's module. New resolver classes get `@CodeOwner(CodeOwners.<team>)` (decorator from `@island.is/nest/core`, enum from `@island.is/shared/constants`); a method you add to another team's resolver gets its own.
- `index.ts` never exports the resolver. Export a service or model only when another module imports it.
- Register a new module in `apps/api/src/app/app.module.ts`, and a new client's config in its `ConfigModule.forRoot({ load })`.
- When a module's existing code breaks these rules, follow the rules for new code; don't copy the module's style.

## Guards and auditing

- Guards aren't global: a resolver class needs `@UseGuards(IdsUserGuard, ScopesGuard)`. `@Scopes` without `ScopesGuard` enforces nothing; `ScopesGuard` without `@Scopes` lets any token through. Several scopes in one `@Scopes` means any one of them.
- `@FeatureFlag(Features.x)` needs `FeatureFlagGuard` in `@UseGuards` and `FeatureFlagModule` in the module imports. Flags are declared in `libs/feature-flags/src/lib/features.ts`.
- Class-level `@Audit({ namespace })` audits nothing alone; each `@Query`/`@Mutation` needs `@Audit()`.
- `@ResolveField` only attaches when the class has `@Resolver(() => Parent)`. Guards and interceptors don't run on it: the parent query's guards cover it, a stricter scope needs a manual `user.scope.includes(...)` check that throws `ForbiddenException`, and auditing needs a manual `auditService.audit(...)`.

## Schema

- Every `@ObjectType`, `@InputType` and `registerEnumType` name carries the module prefix; the class name may be shorter if the decorator string sets it.
- Root `@Query` fields are `nullable: true`, or one failing service nulls the whole response.
- Model fields use `field?: type`, never `| null`. Dates use `GraphQLISODateTime`.
- Types a frontend caches on their own (fetched by id, or updated after a mutation) have a unique, non-nullable `id` built in the domain: composite if needed, never an array index, never a kennitala or anything derived from one (hashes included). If a type's only natural key is a kennitala, ask before choosing an `id`; don't drop the rows.
- A `@ResolveField` on a type that list queries also return runs once per item.
- Anything a consumer branches on is a GraphQL enum with domain-facing values, not a raw string.
- Bilingual `{ is, en }` source fields are resolved server-side from a locale argument; locale goes in `id` only when the mapped data differs per locale.
- Removing or renaming a field or type, making a field non-nullable, or changing an input shape is a breaking change. Deprecate with `deprecationReason` instead of removing.

## Mappers

An item missing its identifier maps to `undefined` and is filtered with `isDefined`; never fill a non-nullable field with `?? ''`/`?? 0`.

## Messages

Text from a module's `messages.ts` goes through `IntlService` (`CmsTranslationsModule`). Messages reach Contentful through the module's `extract-strings` target, which writes to Contentful, so a person runs it, not an agent.

## Schema output

`apps/api/src/api.graphql` is gitignored: run `yarn nx run api:codegen/backend-schema` to generate it.
