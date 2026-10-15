# Lens: IDS scopes and client grants

When a scope is missing, a call fails at runtime. A data provider errors, or
a token exchange returns `invalid_scope`, usually days after the merge.

Precedents: #15179, #14702, #17267, #19151, #23006, #19030, #23248, #20529.

## How scopes reach a call

- **A client library declares the scopes it exchanges for.** It does so
  through `tokenExchangeScope`, `autoAuth.scope`, or a `scope:` in its
  `*.config.ts` or `apiProvider`. Defaults may sit behind an env override
  (`env.optionalJSON('X_SCOPE') ?? [...]`).
- **The token exchange runs as the calling app's client id**
  (`libs/clients/middlewares/src/lib/withAutoAuth.ts:195-210`). The
  identity server grants only scopes in that client's allowed scopes:

  | Code lives in                                                                                 | Runs in                               | Client id                               |
  | --------------------------------------------------------------------------------------------- | ------------------------------------- | --------------------------------------- |
  | `libs/application/template-api-modules/**`                                                    | application-system-api and its worker | `@island.is/clients/application-system` |
  | `libs/api/domains/**`, reached by the form's GraphQL queries, async selects and custom fields | apps/api                              | `@island.is/clients/api`                |
  | `apps/download-service`                                                                       | download-service                      | `@island.is/clients/download-service`   |

  application-system-api also calls apps/api over GraphQL
  (`GRAPHQL_API_URL`), so that leg needs `clients/api`.

- **Test with more than one user.** A flow can pass for one test user and
  fail for another.
- **A config in an app's `load: [...]` is not proof of use.** Both app
  modules load configs they never call. Trace module imports instead.
- **Grants are made in one of two places:**

  - a seeder in `libs/auth-api-lib/seeders/data/`, through
    `addScopesToClient`, `createScope({ addToClients })` or
    `createClient({ allowedScopes })`;
  - IDS admin, outside the repo. Many external scopes are granted there.

  So a missing seeder is a question to ask, never proof of a bug.

- **Seeds have three runtime traps:**
  - Seeds run once per **filename**, in alphabetical order (`add-*`, then
    `client-*`, then `scope-*`).
  - A wrong `client_id` hits a foreign key and leaves the seed job in a
    retry loop.
  - Spell `scope_name` exactly as the library does (`libs/auth-api-lib/migrations/20200828110359-create-clients.js:61-66`).
- **The form's own queries run on the user's token,** not a machine
  client. The application-system BFF requests only `applicationSystemScopes`
  (`libs/auth/scopes/src/lib/clients/application-system-scopes.ts`, used by
  `apps/application-system/form/src/app/App.tsx`). A form query, async
  select or custom field that reaches a resolver whose `@Scopes(...)` is
  outside that list fails `ScopesGuard` for every user. See SC8.
- **`requiredScopes` on a template is checked against the user's token.**
  That token is issued by the my-pages BFF client `@island.is/web`, and the
  check matters only for custom delegation. It never touches a machine client's grants.

## Step 1: build the scope ledger

Gather every scoped call the change makes newly reachable, or whose scopes
it changes. Look for:

- a `@island.is/clients/*` import new to `template-api-modules`, to
  `libs/api/domains`, or to a template's form GraphQL;
- a module added to a template-api module's `imports`;
- a changed scope list in `libs/clients/**`;
- a renamed value in `libs/auth/scopes`.

For each scoped call, record one row:

| Library | Scope strings (resolve enums to literal strings) | Calling app → client id | Grant evidence |
| ------- | ------------------------------------------------ | ----------------------- | -------------- |

For the grant evidence:

1. Grep the seeders **at the reviewed ref** (`review-N`, the branch, or
   `HEAD` for the working tree), never the checkout:
   `git grep -l "<scope>" <ref> -- libs/auth-api-lib/seeders/data`.
   Then confirm the client id in each file it lists.
2. If nothing is seeded, check whether **the same client already exchanges
   the same scope in production** through another library. One example is
   `charge-fjs-v2`, which every paid application runs as
   `clients/application-system`. If so, the grant exists in IDS admin.
   Cite that library and mark the row clean.
3. Record **seeded in this PR**, **seeded earlier** (give the file),
   **granted, already exchanged by `<library>`**, or **not in repo**.
4. A row is clean only when every scope has evidence for every calling
   client.

The step is done when every newly reachable scoped call has a row.

## Step 2: apply the checks

### SC1. Grant missing for the calling client

- **Flag:** a ledger row marked **not in repo**, where the PR's claim
  does not say the grant was made in IDS admin.
- **Severity:** high. Mark it **unverified** and phrase it as a question:
  "`<scope>` must be an allowed scope of `<client>`. Is it granted in IDS
  admin, or does it need a seeder?"
- **Precedent:** #23006, #19151, #15179.

### SC2. Existing library, new caller

- **Flag:** a scoped library that one app already calls is now imported by
  code that runs as the other client. The scope often exists for the
  first client only.
- **Severity:** high. Mark it unverified, as SC1.
- **Precedent:** #23006, #19151, #14702, #17267.

### SC3. Both clients for both paths

- **Flag:** a template that calls a scoped library from its template-api
  module **and** from form-side GraphQL, async selects or custom fields,
  where only one client is granted.
- **Severity:** high.
- **Precedent:** #17267, #17236.

### SC4. Seeder mechanics

- **Flag each of these:**
  - **Unknown client id:** a `clientId` or `addToClients` value that is not
    a known client. Known ids come from `git grep -h IDENTITY_SERVER_CLIENT_ID -- 'apps/**/infra/*.ts'` plus any
    `createClient` seeder. `@island.is/clients/application-system-api`
    does not exist.
  - **Malformed ids:** an id string that contains a comma or whitespace,
    such as two ids written as one string.
  - **Name mismatch:** a seeded scope name that differs, character for
    character, from the library's or the `libs/auth/scopes` string.
  - **No `up` export:** a new seeder without `export const up =`.
  - **Edited or deleted seeder:** a seeder file that already exists is
    modified or deleted. Once it has run anywhere this is a no-op, so the
    change belongs in a new file.
  - **Grant before client:** an `add-*` file that grants to a client the
    same PR creates in `client-*`. `add-*` runs first, so the foreign key
    fails. Use the client's `allowedScopes`, or the scope's `addToClients`.
  - **Rename without grant:** a scope renamed in `libs/auth/scopes` with no
    grant, seeder or note for the new name.
- **Severity:** high for an unknown client id, a name mismatch or an edited
  seeder; medium otherwise.
- **Precedent:** #20675/#20678, #19404/#19428, #15695/#15770, #19377/#19390, #19200.

### SC5. Custom-delegation completeness

- **Flag:** a template that gains `requiredScopes` or a custom delegation,
  without all four of these pieces:

  1. a `createScope` with `delegation: { custom: true }` and
     `addToClients: ['@island.is/web']`;
  2. the `ApiScope` entry;
  3. the entry in `libs/auth/scopes/src/lib/clients/application-system-scopes.ts`;
  4. regenerated BFF charts (`charts/islandis-services/services-bff-portals-my-pages/values.*.yaml`).

  Also flag the GraphQL resolvers the form calls when their `@Scopes(...)`
  still accepts only `ApiScope.internal`.

- **Severity:** high. Delegated users are blocked.
- **Precedent:** #19030, #23248, #19455, #19469, #23142.

### SC6. `requiredScopes` holds user-delegable scopes only

- **Flag:** institution or token-exchange scopes in `requiredScopes`
  (`HmsScope.*`, `@tr.is/*`, `@mms.is/*`). The user's token never carries
  them, so keep them out of `requiredScopes` (#20523).
- **Severity:** medium.
- **Precedent:** #20523, #21263.

### SC7. Resolver without `@Scopes`

- **Flag:** a new `@Query` or `@Mutation` in `libs/api/domains/**` with no
  `@Scopes(...)` on the method or the class.
- **Severity:** high when the query takes another person's kennitala, or
  returns personal data; medium otherwise.

### SC8. Form query outside the form's scopes

- **Flag:** a form-side GraphQL query (`graphql/**`, `loadOptions`, an
  async select, a custom field) that the diff adds or newly calls, whose
  resolver's `@Scopes(...)` holds no scope in `applicationSystemScopes`.
  Grep the resolver at the reviewed ref, then the scope list.
- **Severity:** high when the field is required or the screen depends on
  it; medium otherwise.
- **Fix:** add the scope to `applicationSystemScopes` (and the BFF client
  in IDS), or fetch the data through a template-api provider.
- **Precedent:** #21150, #21407.

## Report

Put the ledger in the findings, one line per row, so the author can confirm
each grant at a glance.
