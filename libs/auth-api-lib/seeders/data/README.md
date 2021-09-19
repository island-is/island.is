# Migrating Data in the IDS

You can define clients and scopes for production using seed migrations in the `seeders/data` folder.

These are generally for "island.is" clients and scopes that need to be deployed to our dev, staging and prod environments. Other organisations will eventually get access to a self-service interface and should not need to manage their data in all IDS environments.

## Defining seed migrations

First, create a TypeScript module with a file name describing your new client or scope, prefixed with `client-` or `scope-` respectively. E.g. `scooe-finance.ts`.

{% hint style="info" %}
The filename is important in that Sequelize uses the filename to deduplicate seed migrations. Each seed migration is run only once in each environment.

Also, the seed migrations run in alphabetized order based on file names. Generally we need to seed `clients` before seeding `scopes` which is the reason for these filename prefixes.
{% endhint %}

{% hint style="warning" %}
It is not possible to import any modules from outside the `seeders/data` folder since everything in this folder is transpiled manually into the dist folder during build.
{% endhint %}

### Creating clients

We provide a helper called `createClient` to seed a client in all environments:

```typescript
// client-test.ts
import { createClient } from './helpers'

export const up = createClient({
  // Required:
  clientId: '@island.is/test',
  clientType: 'machine',
  displayName: 'Test client',
  description: 'Talar við test API',

  // Optional:
  contactNationalId: '1111111111',
  contactEmail: 'hello@test.is',
  grantTypes: ['client_credentials']
  allowedScopes: ['openid', '@island.is/applications:read'],
  supportDelegations: true,
  redirectUris: {
    dev: ['http://localhost:4444/some/path', 'https://beta.dev01.devland.is/some/path'],
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

- `clientId` should be prefixed with the organisation domain, eg `@island.is`.
- `clientType` should be `spa` for front-end web apps, `web` for websites that have a cookie based authentication through a backend, `native` for mobile apps and `machine` for backend clients.
- `displayName` will be shown to the user when they are authenticating to this client.
- `description` should describe the purpose of the client. Not shown to the user.
- `contactNationalId` and `contactEmail` default to Digital Iceland and it's technical contact.
- `grantTypes` specifies which token grant flows the client can use. Defaults to `['client_credentials']` for `machine` and `web` clients, `['authorization_code']` for `spa` and `native` clients.
- `allowedScopes` lists the scopes this client can request. Should include `openid` and any identity and api scopes that the client needs access to.
- `supportDelegations` toggles whether users can authenticate to this client with delegations (legal guardians, procuring holders and custom delegations).
- `redirectUri` should specify the list of allowed redirect uris for each environment.
- `postLogoutRedirectUri` is where the user should be redirected to after logging out.

{% hint style="info" %}
The module export must be named `up` so Sequelize picks it up. You don't need to define `down` exports. All migrations should be one directional and backwards compatible and never need a rollback.
{% endhint %}

### Creating scopes

There's another helper called `createScope` to seed a scope in all environments:

```typescript
// scope-test.ts
import { createScope } from './helpers'

export const up = createScope({
  // Required:
  name: '@island.is/test',
  displayName: 'Test scope',
  description: 'Good description for the scope',

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

- `name` should be prefixed with the organisation domain, eg `@island.is`.
- `displayName` is the name of the scope, shown to users.
- `description` is a description of what the scope gives access to, also shown to users.
- `delegation` allows you to configure if the scope should be automatically granted to legal guardians and procuring holders, or if it should support custom delegations. Defaults to no delegation support.
- `accessControlled: true` makes this a special scope that normal users don't have access to. It is possible to give users access to this scope in the IDS admin. This is a simple tool to manage access to admin clients and resources.
- `addToResource` specifies which resource this scope belongs to. Defaults to `@island.is`.
- `addToClients` adds this scope as `allowedScopes` for the specified clients.

### Using compose.

Each seed migration can define multiple clients and scopes using `compose`:

```ts
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
    addToClients: ['@island.is/clients/national-registry'],
  }),
  createScope({
    name: '@island.is/test2',
    displayName: 'Test 2',
    description: 'Bla',
    addToClients: ['@island.is/clients/national-registry'],
  }),
)
```

Please keep in mind the order of filenames if there are dependencies between seed migrations in the same release.
