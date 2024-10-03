````markdown
# API Documentation

## Quickstart

Before you begin, ensure Docker is running on your machine. For the first-time setup, execute:

```bash
yarn dev-init api
```
````

Subsequently, to start the application, run:

```bash
yarn dev api
```

These commands are abbreviations for the setup process detailed below.

## About

This project serves as the foundation for a unified API for products associated with island.is. It is constructed as a streamlined GraphQL layer atop data and services rendered by government organizations and island.is microservices, each encapsulated within a domain.

[![GraphQL Architecture Diagram](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcblx0c3ViZ3JhcGggSXNsYW5kLmlzXG5cdFx0c3ViZ3JhcGggQVBJXG5cdFx0XHRhcHBbXCJHcmFwaFFMIHNlcnZlcjxicj48YnI-L2FwcHMvYXBpPGJyPkF1dGhlbnRpY2F0aW9uPGJyPk1ldHJpY3NcIl1cblx0XHRcdGRvbWFpbltcIlJTSyBkb21haW48YnI-PGJyPi9saWJzL2FwaS9kb21haW5zL3Jzazxicj5HcmFwaFFMIFNjaGVtYTxicj5HcmFwaFFMIFJlc29sdmVyczxicj5TZXJ2aWNlc1wiXVxuXHRcdFx0ZG9tYWluMltcIkFwcGxpY2F0aW9ucyBkb21haW48YnI-PGJyPi9saWJzL2FwaS9kb21haW5zL2FwcGxpY2F0aW9uczxicj5HcmFwaFFMIFNjaGVtYTxicj5HcmFwaFFMIFJlc29sdmVyczxicj5TZXJ2aWNlc1wiXVxuXG5cdFx0XHRhcHAtLT58Q29tYmluZXMgR3JhcGhRTHxkb21haW4gJiBkb21haW4yXG5cdFx0XHRkb21haW4yIC0tPiB8Q2FsbHMgc2VydmljZXN8ZG9taW5cblx0XHRlbmRcblx0XHR4LXJvYWRbXCJYLVJvYWQgU2VjdXJpdHkgU2VydmVyXCJdXG5cdFx0bWljcm9zZXJ2aWNlW1wiQXBwbGljYXRpb25zIE1pY3Jvc2VydmljZTxicj48YnI-L2FwcHMvc2VydmljZXMvYXBwbGljYXRpb25zXCJdXG5cdFx0ZGF0YWJhc2VbXCJQb3N0Z3JlU1FMIERhdGFiYXNlXCJdXG5cdFx0ZG9tYWluMiAtLT4gbWljcm9zZXJ2aWNlIC0tPiBkYXRhYmFzZVxuXHRlbmRcblx0c3ViZ3JhcGggUlNLXG5cdFx0eC1yb2FkMltcIlgtUm9hZCBTZWN1cml0eSBTZXJ2ZXJcIl1cblx0XHRyc2stc2VydmljZVtcIlJTSyBXZWJzZXJ2aWNlXCJdXG5cdGVuZFxuXG5cdGRvbWFpbiAtLT4geC1yb2FkXG5cdHgtcm9hZCAtLT4geC1yb2FkMlxuXHR4LXJvYWQyIC0tPiByc2stc2VydmljZVxuIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcblx0c3ViZ3JhcGggSXNsYW5kLmlzXG5cdFx0c3ViZ3JhcGggQVBJXG5cdFx0XHRhcHBbXCJHcmFwaFFMIHNlcnZlcjxicj48YnI-L2FwcHMvYXBpPGJyPkF1dGhlbnRpY2F0aW9uPGJyPk1ldHJpY3NcIl1cblx0XHRcdGRvbWFpbltcIlJTSyBkb21haW48YnI-PGJyPi9saWJzL2FwaS9kb21haW5zL3Jzazxicj5HcmFwaFFMIFNjaGVtYTxicj5HcmFwaFFMIFJlc29sdmVyczxicj5TZXJ2aWNlc1wiXVxuXHRcdFx0ZG9tYWluMltcIkFwcGxpY2F0aW9ucyBkb21haW48YnI-PGJyPi9saWJzL2FwaS9kb21haW5zL2FwcGxpY2F0aW9uczxicj5HcmFwaFFMIFNjaGVtYTxicj5HcmFwaFFMIFJlc29sdmVyczxicj5TZXJ2aWNlc1wiXVxuXG5cdFx0XHRhcHAtLT58Q29tYkluZXMgR3JhcGhRTHxkb21haW4gJiBkb21haW4yXG5cdFx0XHRkb21haW4yIC0tPiB8Q2FsbHMgc2VydmljZXN8ZG9taW5cblx0XHRlbmRcblx0XHR4LXJvYWRbXCJYLVJvYWQgU2VjdXJpdHkgU2VydmVyXCJdXG5cdFx0bWljcm9zZXJ2aWNlW1wiQXBwbGljYXRpb25zIE1pY3Jvc2VydmljZTxicj48YnI-L2FwcHMvc2VydmljZXMvYXBwbGljYXRpb25zXCJdXG5cdFx0ZGF0YWJhc2VbXCJQb3N0Z3JlU1FMIERhdGFiYXNlXCJdXG5cdFx0ZG9tYWluMiAtLT4gbWljcm9zZXJ2aWNlIC0tPiBkYXRhYmFzZVxuXHRlbmRcblx0c3ViZ3JhcGggUlNLXG5cdFx0eC1yb2FkMltcIlgtUm9hZCBTZWN1cml0eSBTZXJ2ZXJcIl1cblx0XHRyc2stc2VydmljZVtcIlJTSyBXZWJzZXJ2aWNlXCJdXG5cdGVuZFxuXG5cdGRvbWFpbiAtLT4geC1yb2FkXG5cdHgtcm9hZCAtLT4geC1yb2FkMlxuXHR4LXJvYWQyIC0tPiByc2stc2VydmljZVxuIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0)

## URLs

- Development: Not Applicable
- [Staging](https://beta.staging01.devland.is/api)
- Production: Not Applicable

## Project Structure

Efforts should be made to keep the code within the app package minimal. Business logic largely belongs in [domain libraries](https://github.com/island-is/island.is/tree/main/libs/api/domains). Shared utilities and middleware should also reside in separate libraries.

### Domains

Domain libraries encapsulate and represent an underlying data model or service. Each microservice and government organization ideally should have its domain library.

Components they may include:

- **typeDefs**: Provides the GraphQL schema defining the types, inputs, queries, and mutations of the domain.
- **resolvers**: An object hosting the GraphQL resolvers for any necessary fields, queries, and mutations within the domain.
- **services**: Domains may export various services for use by other domains. These services should be robustly typed and keep any domain internals concealed.

The combined `typeDefs` and `resolvers` form a single GraphQL server. Resolvers should ideally remain succinct, managing arguments including input and payload encapsulation. The bulk of resolver logic should be positioned within service functions that might call services from other domains, engage with external services, and dispatch messages across exchanges.

### Services

Services are classes designed to contain a domain's primary logic. They should be easily testable and utilize dependency injection (DI) for accessing other services and connectors. Currently, there is no DI container; everything is configured manually within tests and `/apps/api/src/graphql/context`.

### Type Generation

Employ [graphql-codegen](https://graphql-code-generator.com/) to generate TypeScript types for the GraphQL schema. Client apps can also use `graphql-codegen` to integrate the API schema with client operations, enabling schema-operation matching verification and generating type definitions for operation inputs and payloads.

### Shared Libraries

For reusable code, consider placing it within a shared library. API-specific code should reside under `/libs/api`, while more broadly applicable code might be shared wider. Begin with a flat structure, refining into subfolders as library numbers expand.

Examples:

```text
# Flat structure
/libs/api/middlewares

# Grouped structure
/libs/api/clients/cms
/libs/api/clients/x-road
/libs/api/utilities/graphql
```

### Fetch Development Secrets

Execute `AWS_PROFILE=<profile> yarn nx get-secrets <project>` to retrieve development secrets.

**Example**:

```bash
AWS_PROFILE=islandis yarn nx get-secrets api
```

### Test Requirements

The API primarily serves as a wrapper around external services with limited logic. Focus should be placed on unit tests utilizing mocks for external dependencies until an integration/contract testing strategy is established. Ensure comprehensive test coverage on shared code and services. As resolvers are complex to test, keep them minimal with the primary logic centralized in unit-tested services.

## Getting Started

To initiate the API, execute:

```bash
yarn start api
```

### Codegen

Upon altering a GraphQL schema, update the generated TypeScript types leveraged by resolvers and client applications:

```bash
yarn nx run api-schema:codegen/frontend-client
```

### Tests

Execute tests impacting your changes or tests within a specified project:

```bash
yarn affected:test
yarn test api
```

Many Jest arguments are available for test commands. Add `--help` for more information.

```bash
yarn test api --help
yarn test api --watch
yarn test api --updateSnapshots
yarn test api --runInBand
```

### New Domain

A new domain or shared library can be created using an NX schematic:

```bash
yarn generate @nrwl/node:library api/domains/your-domain
yarn generate @nrwl/node:library api/your-library
```

If your domain needs to introduce fields within the GraphQL schema, ensure to export `typeDefs` and `resolvers` within your domain's `index.ts`, then incorporate your domain into the list located at `/apps/spi/src/graphql/domains.ts`.

## Code Owners and Maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members): `libs/cms`, `libs/api/domains/content-search`
- [Aranja](https://github.com/orgs/island-is/teams/aranja/members): `libs/cms`, `libs/api/domains/application`, `libs/api/domains/content-search`
- [Norda](https://github.com/orgs/island-is/teams/norda/members): `libs/api/domains/documents`, `libs/api/domains/national-registry`
- [Stefna](https://github.com/orgs/island-is/teams/stefna/members): `libs/api/domains/content-search`
- [Advania](https://github.com/orgs/island-is/teams/advania/members): `libs/api/domains/api-catalogue`

```

```
