```markdown
# Car Recycling Client (Úrvinnslusjóður)

## Overview

This library provides a GraphQL client to interact with the Car Recycling (Skilavottorð) APIs.

## Skilavottord-ws Backend URL

Ensure the `RECYCLING_FUND_GQL_BASE_PATH` configuration parameter is set to the Skilavottord GraphQL server URL.

## GraphQL Client Code Generation

To generate the GraphQL client library, follow these steps:

1. Use `graphql-codegen` and configure it in `project.json`.
2. Implement mutations and queries in a `.graphql` file.
3. Configure `codegen.yaml` to point to the GraphQL schema and the `.graphql` file. In this case, the `api.graphql` schema from the `skilavottord-ws` backend is used.

Run the following command to generate the code:

```shell
yarn codegen
```

Note: Code generation produces types, queries, and mutations but does not generate data fetching functions. These have been manually implemented to accommodate token exchange requirements.

## Running Unit Tests

Execute unit tests using the following command via [Jest](https://jestjs.io):

```shell
nx test clients-car-recycling
```

## Code Owners and Maintainers

- [Deloitte](https://github.com/orgs/island-is/teams/deloitte/members)
```