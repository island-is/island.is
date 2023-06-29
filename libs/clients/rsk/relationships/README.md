<!-- gitbook-navigation: "Procuring" -->

# RSK Relationships (Prókúra) Client

This library was generated with [Nx](https://nx.dev).

## Methods access

Following table describes methods and what scopes are needed to access them.
The machine clients that will be accessing these methods should have the following
scopes in their access token or token exchange: `@rsk.is/prokura`, `@rsk.is/prokura:admin`

| Method                          | Scope                                                                       | Description                                                                                                                                  |
| ------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `getLegalEntityRelationships()` | `@rsk.is/prokura`, `@rsk.is/prokura:admin`, `@admin.island.is/service-desk` | Gets legal entity for and individual relationships, e.g. companies. The data is sensitive and should only be accessed by service desk admins |
| `getIndividualRelationships()`  | `@identityserver.api/authentication`, `@island.is/auth/actor-delegations`   | Gets individual and his relationships                                                                                                        |

## Running unit tests

Run `nx test clients-rsk-relationships` to execute the unit tests via [Jest](https://jestjs.io).
