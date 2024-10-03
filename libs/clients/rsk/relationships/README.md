```markdown
# RSK Relationships (Prókúra) Client

This library was generated with [Nx](https://nx.dev).

## Method Access

The following table describes the methods available in this client, the required scopes for access, and their descriptions. For example, the IDS machine client configured in the service using this client must have these scopes to access respective methods.

| Method                          | Scope                   | Description                                                                                                                                                    |
| ------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getLegalEntityRelationships()` | `@rsk.is/prokura:admin` | Returns relationships for individuals related to a specific legal entity. The data is sensitive and should only be accessible to Ísland.is service desk admins |
| `getIndividualRelationships()`  | `@rsk.is/prokura`       | Returns relationships for companies related to a specific individual                                                                                           |

## Running Unit Tests

To execute the unit tests via [Jest](https://jestjs.io), run the following command:

```sh
nx test clients-rsk-relationships
```
```