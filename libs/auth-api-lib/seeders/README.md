# Migrating Data in the IDS

You can define clients and scopes for production using seed migrations in the `seeders/data` folder.

These are generally "island.is" clients and scopes that need to be deployed to our development, staging, and production environments. Other organizations can get access to a self-service interface and should manage their data through that.

Note that even though it is possible to create machine clients using this method, we do not recommend doing so as the client secret will need to be manually added to parameter storage.

## Defining Seed Migrations

First, create a TypeScript module with a filename describing your new client or scope, prefixed with `client-` or `scope-` respectively (e.g., `scope-finance.ts`).

The filename is important because Sequelize uses it to deduplicate seed migrations. Each seed migration runs only once in each environment. To avoid any problems, refrain from renaming migrations after they have executed in some environments.

Seed migrations run in alphabetized order based on filenames, meaning that `client-*.ts` migrations are run before `scope-*.ts` migrations.

If you're creating connected data that is migrated in the same release, ensure that one (e.g., the client) is created first and then connect them when creating the other one (e.g., using the `addToClients` option on the scope).

It is not possible to import any modules from outside the `seeders/data` folder since everything in this folder is manually transpiled into the `dist` folder during build.

### Creating Clients

We provide a helper called `createClient` to seed a client in all environments:

```typescript
// client-test.ts
import { createClient } from './helpers'

export const up = createClient({
  // Required:
  clientId: '@island.is/test',
  clientType: 'machine',
  displayName: 'Test client',
  description: 'Communicates with test API',

  // Optional:
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

Notes about the arguments:

- `clientId` should be prefixed with the organization domain, e.g., `@island.is`.
- `clientType` should be `spa` for front-end web apps, `web` for websites that have cookie-based authentication through a backend, `native` for mobile apps, and `machine` for backend clients.
- `displayName` will be shown to the user when they are authenticating with this client.
- `description` should describe the purpose of the client. It is not shown to the user.
- `contactNationalId` and `contactEmail` default to Digital Iceland and its technical contact.
- `grantTypes` specifies which token grant flows the client can use. Defaults to `['client_credentials']` for `machine` clients, `['authorization_code']` for `spa`, `web`, and `native` clients.
- `allowedScopes` lists the identity and/or API scopes this client can request. Machine clients should not request any identity scopes, but `spa`, `web`, and `native` clients usually request the `openid` and `profile` scopes. All clients can request API scopes.
- `supportDelegations` toggles whether users can authenticate with this client using delegations (legal guardians, procuring holders, and custom delegations).
- `delegations` specifies which types of delegations are allowed by the client.
- `redirectUri` should specify the list of allowed redirect URIs for each environment. Required for any client using the `authorization_code` grant type.
- `postLogoutRedirectUri` is where the user should be redirected to after logging out. If no URL is specified, the user will be redirected to the island.is frontpage.

The module export must be named `up` so Sequelize picks it up. You don't need to define `down` exports. All migrations should be one-directional and backward compatible with no need for rollback.

### Creating Scopes

There's another helper called `createScope` to seed a scope in all environments:

```typescript
// scope-test.ts
import { createScope } from './helpers'

export const up = createScope({
  // Required:
  name: '@island.is/test',
  displayName: 'Test scope',
  description: 'A good description for the scope',

  // Optional:
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

Notes about the arguments:

- `name` should be prefixed with the organization domain, e.g., `@island.is`.
- `displayName` is the name of the scope, shown to users if custom delegations are supported.
- `description` is a description of what access the scope provides, also shown to users if custom delegations are supported.
- `delegation` allows you to configure if the scope should be automatically granted to legal guardians and procuring holders, or if it should support custom delegations. Defaults to no delegation support.
- `accessControlled: true` makes this a special scope that normal users don't have access to. It is possible to give users access to this scope in the IDS admin. This is a simple tool to manage access to admin clients and resources.
- `addToResource` is deprecated; assigning scopes to a resource or audience is no longer recommended. Specifies which resource this scope belongs to. Defaults to `@island.is`.
- `addToClients` adds this scope as `allowedScopes` for the specified clients.

### Using Compose

Each seed migration can define multiple clients and scopes using `compose`:

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

Please keep in mind the order of filenames if there are dependencies between seed migrations in the same release.

## Error Handling and Create/Update Logic

These helpers will generally catch and log database errors that correspond to unique index conflicts.

This means that it's generally safe to define the same data in a seed migration as well as in the IDS admin. The migration will ignore any data that already exists.

It works on a row-by-row basis. The migration will not update any existing data, but it will add new rows/relations when they don't exist.

> For example, if you specify a client X in a seed migration that is allowed to use scopes A and B, and client X is already defined in `dev` with scope A when the migration runs, it will only add scope B as an allowed scope for client X. The seed migration may still create client X on `staging` and `prod` if it doesn't already exist.