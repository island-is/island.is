# RSK Relationships (Prókúra) Client

This library was generated with [Nx](https://nx.dev).

## Methods access

Following table describes methods and which scopes are needed to access them, e.g. by the IDS machine client configured in the service using this client.

| Method                          | Scope                   | Description                                                                                                                                                    |
| ------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getLegalEntityRelationships()` | `@rsk.is/prokura:admin` | Returns relationships for individuals related to a specific legal entity. The data is sensitive and should only be accessible to Ísland.is service desk admins |
| `getIndividualRelationships()`  | `@rsk.is/prokura`       | Returns relationships for companies related to a specific individual                                                                                           |

## Running unit tests

Run `nx test clients-rsk-relationships` to execute the unit tests via [Jest](https://jestjs.io).
