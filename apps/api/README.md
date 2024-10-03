# API

## Quickstart

Ensure docker is running, then run the following when running for the first time:

```bash
yarn dev-init api
```

To start the app:

```bash
yarn dev api
```

These commands are just shorthands for the setup described below.

## About

This project forms the basis of a unified API for products belonging to island.is.

It's built as a thin GraphQL layer on top of data and services provided by government organisations and island.is microservices, where each unit is wrapped in a domain.

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcblx0c3ViZ3JhcGggSXNsYW5kLmlzXG5cdFx0c3ViZ3JhcGggQVBJXG5cdFx0XHRhcHBbXCJHcmFwaFFMIHNlcnZlcjxicj48YnI-L2FwcHMvYXBpPGJyPkF1dGhlbnRpY2F0aW9uPGJyPk1ldHJpY3NcIl1cblx0XHRcdGRvbWFpbltcIlJTSyBkb21haW48YnI-PGJyPi9saWJzL2FwaS9kb21haW5zL3Jzazxicj5HcmFwaFFMIFNjaGVtYTxicj5HcmFwaFFMIFJlc29sdmVyczxicj5TZXJ2aWNlc1wiXVxuXHRcdFx0ZG9tYWluMltcIkFwcGxpY2F0aW9ucyBkb21haW48YnI-PGJyPi9saWJzL2FwaS9kb21haW5zL2FwcGxpY2F0aW9uczxicj5HcmFwaFFMIFNjaGVtYTxicj5HcmFwaFFMIFJlc29sdmVyczxicj5TZXJ2aWNlc1wiXVxuXG5cdFx0XHRhcHAtLT58Q29tYmluZXMgR3JhcGhRTHxkb21haW4gJiBkb21haW4yXG5cdFx0XHRkb21haW4yIC0tPiB8Q2FsbHMgc2VydmljZXN8ZG9tYWluXG5cdFx0ZW5kXG5cdFx0eC1yb2FkW1wiWC1Sb2FkIFNlY3VyaXR5IFNlcnZlclwiXVxuXHRcdG1pY3Jvc2VydmljZVtcIkFwcGxpY2F0aW9ucyBNaWNyb3NlcnZpY2U8YnI-PGJyPi9hcHBzL3NlcnZpY2VzL2FwcGxpY2F0aW9uc1wiXVxuXHRcdGRhdGFiYXNlW1wiUG9zdGdyZVNRTCBEYXRhYmFzZVwiXVxuXHRcdGRvbWFpbjIgLS0-IG1pY3Jvc2VydmljZSAtLT4gZGF0YWJhc2Vcblx0ZW5kXG5cdHN1YmdyYXBoIFJTS1xuXHRcdHgtcm9hZDJbXCJYLVJvYWQgU2VjdXJpdHkgU2VydmVyXCJdXG5cdFx0cnNrLXNlcnZpY2VbXCJSU0sgV2Vic2VydmljZVwiXVxuXHRlbmRcblxuXHRkb21haW4gLS0-IHgtcm9hZFxuXHR4LXJvYWQgLS0-IHgtcm9hZDJcblx0eC1yb2FkMiAtLT4gcnNrLXNlcnZpY2VcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcblx0c3ViZ3JhcGggSXNsYW5kLmlzXG5cdFx0c3ViZ3JhcGggQVBJXG5cdFx0XHRhcHBbXCJHcmFwaFFMIHNlcnZlcjxicj48YnI-L2FwcHMvYXBpPGJyPkF1dGhlbnRpY2F0aW9uPGJyPk1ldHJpY3NcIl1cblx0XHRcdGRvbWFpbltcIlJTSyBkb21haW48YnI-PGJyPi9saWJzL2FwaS9kb21haW5zL3Jzazxicj5HcmFwaFFMIFNjaGVtYTxicj5HcmFwaFFMIFJlc29sdmVyczxicj5TZXJ2aWNlc1wiXVxuXHRcdFx0ZG9tYWluMltcIkFwcGxpY2F0aW9ucyBkb21haW48YnI-PGJyPi9saWJzL2FwaS9kb21haW5zL2FwcGxpY2F0aW9uczxicj5HcmFwaFFMIFNjaGVtYTxicj5HcmFwaFFMIFJlc29sdmVyczxicj5TZXJ2aWNlc1wiXVxuXG5cdFx0XHRhcHAtLT58Q29tYmluZXMgR3JhcGhRTHxkb21haW4gJiBkb21haW4yXG5cdFx0XHRkb21haW4yIC0tPiB8Q2FsbHMgc2VydmljZXN8ZG9tYWluXG5cdFx0ZW5kXG5cdFx0eC1yb2FkW1wiWC1Sb2FkIFNlY3VyaXR5IFNlcnZlclwiXVxuXHRcdG1pY3Jvc2VydmljZVtcIkFwcGxpY2F0aW9ucyBNaWNyb3NlcnZpY2U8YnI-PGJyPi9hcHBzL3NlcnZpY2VzL2FwcGxpY2F0aW9uc1wiXVxuXHRcdGRhdGFiYXNlW1wiUG9zdGdyZVNRTCBEYXRhYmFzZVwiXVxuXHRcdGRvbWFpbjIgLS0-IG1pY3Jvc2VydmljZSAtLT4gZGF0YWJhc2Vcblx0ZW5kXG5cdHN1YmdyYXBoIFJTS1xuXHRcdHgtcm9hZDJbXCJYLVJvYWQgU2VjdXJpdHkgU2VydmVyXCJdXG5cdFx0cnNrLXNlcnZpY2VbXCJSU0sgV2Vic2VydmljZVwiXVxuXHRlbmRcblxuXHRkb21haW4gLS0-IHgtcm9hZFxuXHR4LXJvYWQgLS0-IHgtcm9hZDJcblx0eC1yb2FkMiAtLT4gcnNrLXNlcnZpY2VcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)

## URLs

- Dev: N/A
- [Staging](https://beta.staging01.devland.is/api)
- Production: N/A

## Project structure

The code in this app package should be kept as small as possible. Most business logic should be in [domain libraries](https://github.com/island-is/island.is/tree/main/libs/api/domains). Shared utilities and middlewares should be in libraries as well.

### Domains

Domain libraries represent and wrap an underlying data model or service. As a rule of thumb, each microservice and government organisation should have their own domain library.

They can contain the following exports:

- **typeDefs**: GraphQL schema describing the types, inputs, queries and mutations of the domain.
- **resolvers**: Object containing GraphQL resolvers for any fields, queries and mutations as needed by the domain.
- **services**: The domain can export arbitrary services for other domains. These should be strongly typed and not expose any internals of the domain.

The `typeDefs` and `resolvers` for all domains are merged into a single GraphQL server.

Generally, the resolvers should be really small. They should only manage the resolver arguments, including input and payload wrappers.

The actual resolver logic should be in service functions. These may call another domain's service, call external services and publish messages on exchanges.

### Services

Services are classes that contain most of the logic for a domain. They should be easy to test and use dependency injection (DI) to get access to other services and connectors.

Currently, there is no DI container. Everything is hooked up manually in tests and `/apps/api/src/graphql/context`.

### Type Generation

We use [graphql-codegen](https://graphql-code-generator.com/) to generate TypeScript types for the GraphQL schema.

In addition, client apps can use `graphql-codegen` to join together the API schema with client operations. This validates that operations match the schema, and generates type definitions for operation inputs and payloads.

### Shared libraries

For code that can be reused, consider adding it to a shared library. If it's specific to the API, it should be under `/libs/api`, otherwise consider making it available wider. Either way, we can start flat and refactor into subfoldres as the number of libraries grows.

Examples:

```text
# Flat
/libs/api/middlewares

# Grouped
/libs/api/clients/cms
/libs/api/clients/x-road
/libs/api/utilities/graphql
```

### Fetch development secrets

Run `AWS_PROFILE=<profile> yarn nx get-secrets <project>`

**Example**:

```bash
AWS_PROFILE=islandis yarn nx get-secrets api
```

### Test requirements

This API has minimal logic and mostly wraps external services. Until we figure out an integration/contract testing strategy, the main focus is on unit tests using mocks for external dependencies.

There should be good test coverage on shared code and services. The resolvers are tricky to test so they should be kept simple, with the main logic in unit tested services.

## Getting started

To start the API, run:

```bash
yarn start api
```

### Codegen

If you change a GraphQL schema, you need to update the generated TypeScript types which are used by resolvers and client applications:

```bash
yarn nx run api-schema:codegen/frontend-client
```

### Tests

To run tests, you can either run all tests affected by your changes, or run tests in a specific project:

```bash
yarn affected:test
yarn test api
```

Many jest arguments can be passed to test commands. For more details, add `--help`.

```bash
yarn test api --help
yarn test api --watch
yarn test api --updateSnapshots
yarn test api --runInBand
```

### New domain

You can create a new domain or shared library using an NX schematic:

```bash
yarn generate @nrwl/node:library api/domains/your-domain
yarn generate @nrwl/node:library api/your-library
```

If your domain needs to expose fields in the GraphQL schema, make sure to export `typeDefs` and `resolvers` in your domain's `index.ts`, then add your domain to the list in `/apps/spi/src/graphql/domains.ts`.

## Code owners and maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members): `libs/cms`, `libs/api/domains/content-search`
- [Aranja](https://github.com/orgs/island-is/teams/aranja/members): `libs/cms`, `libs/api/domains/application`, `libs/api/domains/content-search`
- [Norda](https://github.com/orgs/island-is/teams/norda/members): `libs/api/domains/documents`, `libs/api/domains/national-registry`
- [Stefna](https://github.com/orgs/island-is/teams/stefna/members): `libs/api/domains/content-search`
- [Advania](https://github.com/orgs/island-is/teams/advania/members) `libs/api/domains/api-catalogue`
