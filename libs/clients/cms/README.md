```markdown
# CMS Client - Contentful GraphQL Client Library

## Overview

This library implements the necessary interfaces to interact with Contentful's GraphQL APIs, providing an efficient and streamlined approach for managing content.

## Prerequisites

Ensure that the `CONTENTFUL_ACCESS_TOKEN` environment variable is configured. This token is essential for authenticating requests to the Contentful GraphQL API.

## Fetching the GraphQL Schema

The GraphQL schema is not automatically updated. To fetch the latest schema from Contentful, execute the following command:

```sh
yarn nx run clients-cms:fetch-schema
```

## Running Unit Tests

To execute the unit tests, use [Jest](https://jestjs.io) with the following command:

```sh
nx test cms
```

## Code Owners and Maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members) oversees the ownership and maintenance of this library.
```