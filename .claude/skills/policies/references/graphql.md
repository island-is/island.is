# GraphQL (GQL)

Sources: [GraphQL naming conventions](https://docs.devland.is/technical-overview/api-design-guide/graphql-naming-conventions.md), [Versioning](https://docs.devland.is/technical-overview/api-design-guide/versioning.md), [Codegen](https://docs.devland.is/development/codegen.md)

- **GQL-1** Prefix every type, input, enum, query and mutation with the module/domain name (e.g. `AuthDelegationRequest`, `authDelegationRequests`).
- **GQL-2** Mutations are verb-first (`createAuthDelegation`) and take a single `input: XInput!` argument.
- **GQL-3** Enum values are `ALL_CAPS`.
- **GQL-4** Never remove or rename a field, argument or enum value that has shipped. Add the new one and mark the old one `@deprecated(reason: "...")`.
- **GQL-5** Lists return `{ totalCount, items, pageInfo }` and take `first`/`after` (follow the domain's existing connection type).
- **GQL-6** Schema-affecting files use the `*.resolver|service|dto|input|model|enum|module|controller.ts` suffixes, so the codegen cache sees them. Generated files are not committed.
- **GQL-7** Resolvers declare scopes and guards explicitly (see `AUTH-1`) and get user identity from `@CurrentUser()`, never from arguments.
