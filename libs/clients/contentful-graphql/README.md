# Contentful GraphQL Client

## About

This library implements a GraphQL client code to use Contentful GraphQL APIs.

## GraphQL API endpoint

The `GRAPHQL_API_ENDPOINT` config needs to be configured.

## GraphQL client code generation

To be able to generate the GraphQL library to use couple of things is needed to be done before code generation.

- Use `graphql-codegen`, config it in `project.json`
- Implement mutation and queries in a .graphql file
- Config the `codegen.yaml` to point to GraphQL schema and our .graphql file. In our case we are using the api.graphql schema from the skilavottord-ws backend

Run `yarn codegen`

The code generation doesn't generate the functions to fetch data the from the backend, only types, the queries and mutations. We implemented the fetch "manually" to be abel to fit in token exhange.

## Running unit tests

Run `nx test clients-contentful-graphql` to execute the unit tests via [Jest](https://jestjs.io).

## Code owners and maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)
