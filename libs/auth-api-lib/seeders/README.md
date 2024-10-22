# Migrating Data in the IDS

Define clients and scopes for production using seed migrations in the `seeders/data` folder. These are primarily for "island.is" clients and scopes in dev, staging, and prod environments. Other organizations should use the self-service interface to manage their data.

Avoid creating machine clients through seed migrations due to the need for manual client secret management.

## Defining Seed Migrations

Create a TypeScript module named after your new client or scope, prefixed with `client-` or `scope-` (e.g., `scope-finance.ts`). File names are crucial since Sequelize uses them to deduplicate migrations. Migrations run only once per environment and follow alphabetical order.

Ensure that any connected data is correctly ordered; for instance, create the client first, then the scope.

Do not import modules from outside the `seeders/data` folder.

### Creating Clients

Use `createClient` to seed clients across all environments:

```typescript
// client-test.ts
import { createClient } from './helpers'

export const up = createClient({
  clientId: '@island.is/test',
  clientType: 'machine',
  displayName: 'Test client',
  description: 'Talar við test API',
  contactNationalId: '1111111111',
  contactEmail: 'hello@test.is',
  grantTypes: ['client_credentials'],
  allowedScopes: ['openid', '@island.is/applications:read'],
  supportDelegations: true,
  delegation: {
    custom: false,
    legalGuardians: true,
    procuringHolders: true,
  },
  redirectUris: {
    dev: [
      'http://localhost:4444/some/path',
      'https://beta.dev01.devland.is/some/path',
    ],
    staging: ['https://beta.staging01.devland.is/some/path'],
    prod: ['https://island.is/some/path'],
  },
  postLogoutRedirectUri: {
    dev: 'https://beta.dev01.devland.is',
    staging: 'https://beta.staging01.devland.is',
    prod: 'https://island.is',
  },
})
```

Arguments:

- `clientId`: Prefix with the organization's domain, e.g., `@island.is`.
- `clientType`: Use `spa` for front-end web apps, `web` for sites with backend cookie-based authentication, `native` for mobile apps, `machine` for backend clients.
- `displayName`: Shown during user authentication.
- `description`: Describes client purpose; not shown to users.
- `contactNationalId`, `contactEmail`: Default to Digital Iceland's contact.
- `grantTypes`: Token grant flows. Defaults vary by `clientType`.
- `allowedScopes`: Identity and/or API scopes the client can request. Machine clients shouldn't request identity scopes.
- `supportDelegations`: Defines if users can authenticate with delegations.
- `delegations`: Specifies the types of delegations permitted.
- `redirectUris`: Lists allowed URIs for the `authorization_code` grant type.
- `postLogoutRedirectUri`: Redirect after logout. Defaults to the island.is front page.

Exports must be named `up` for Sequelize recognition. No `down` export is needed; migrations are one-directional.

### Creating Scopes

Use `createScope` to seed scopes:

```typescript
// scope-test.ts
import { createScope } from './helpers'

export const up = createScope({
  name: '@island.is/test',
  displayName: 'Test scope',
  description: 'Good description for the scope',
  delegation: {
    custom: true,
    legalGuardians: true,
    procuringHolders: true,
  },
  accessControlled: false,
  addToResource: '@island.is',
  addToClients: ['@island.is/test'],
})
```

Arguments:

- `name`: Prefixed with the organization's domain, e.g., `@island.is`.
- `displayName`: Scope name, shown to users if custom delegations are supported.
- `description`: Describes access granted; shown if delegations are supported.
- `delegation`: Configures automatic granting for legal guardians, procuring holders, or custom delegations.
- `accessControlled`: Special scope limiting normal user access.
- `addToResource`: Deprecated. Previously specified scope's resource.
- `addToClients`: Adds the scope as `allowedScopes` for clients.

### Using Compose

Define multiple clients and scopes with `compose`:

```typescript
import { compose, createClient, createScope } from './helpers'

export const up = compose(
  createClient({
    clientId: '@island.is/test',
    clientType: 'machine',
    displayName: 'Test Client',
    description: 'Bla',
    allowedScopes: ['openid'],
  }),
  createScope({
    name: '@island.is/test',
    displayName: 'Test',
    description: 'Bla',
    addToClients: ['@island.is/test'],
  }),
  createScope({
    name: '@island.is/test2',
    displayName: 'Test 2',
    description: 'Bla',
    addToClients: ['@island.is/test'],
  }),
)
```

Ensure the filename order aligns with dependencies within a release.

## Error Handling and Create/Update Logic

Helpers handle and log database errors, mainly related to unique index conflicts. This allows coexisting seeded and IDS admin-defined data. Migrations add new rows/relations but do not update existing data.

For instance, if client X is specified with scopes A and B, and X with A already exists in `dev`, the migration adds scope B. Client X might still be created in `staging` and `prod` if absent.

