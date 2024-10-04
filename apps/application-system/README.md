# Application System

## Quickstart

Ensure Docker is running. For initial setup, run:

For API:

```bash
yarn dev-init application-system-api
```

For Application Form:

```bash
yarn dev-init application-system-form
```

To start the app:

For API:

```bash
yarn dev application-system-api
```

For Application Form:

```bash
yarn dev application-system-form
```

These commands streamline the process detailed below.

## Overview

This project supports all business applications related to island.is.

## URLs

- [Dev](https://beta.dev01.devland.is/umsoknir/)
- [Staging](https://beta.staging01.devland.is/umsoknir/)
- [Production](https://island.is/umsoknir/)

## API

### Initial Setup

Ensure Docker is running, then execute:

```bash
yarn dev-services application-system-api
```

Run migrations:

```bash
yarn nx run application-system-api:migrate
```

### Local Execution (API)

Serve locally with:

```bash
yarn start application-system-api
```

### GraphQL

Serve the GraphQL client concurrently to enable queries:

```bash
yarn start api
```

### OpenAPI and Swagger

After code changes, generate the OpenAPI and Swagger code:

```bash
yarn nx codegen/backend-schema application-system-api
```

You can now access the [Swagger UI](localhost:3333/swagger).
Generate a typed fetch client with:

```bash
yarn nx codegen/backend-client api-domains-application
```

Update the GraphQL schema with:

```bash
yarn nx codegen/backend-schema api
```

## Form

This app includes the frontend for the application system.

### Local Execution (Form)

Serve locally with:

```bash
yarn start application-system-form
```

Ensure backend services are running:

```bash
yarn start application-system-api
yarn start api
```

### Adding a New Template

- [Reference Template](https://github.com/island-is/island.is/tree/main/libs/application/templates/reference-template)

Follow the steps from the [OpenAPI and Swagger](https://github.com/island-is/island.is/tree/main/apps/application-system#openapi-and-swagger) or run `yarn codegen`.

### Payment Step

For payment integration, follow the [application payment guide](https://docs.devland.is/misc/application-payment-guide).

### Testing

Run tests with:

```bash
yarn nx test application-system-form
```

## Code Owners and Maintainers

- [Norda](https://github.com/orgs/island-is/teams/norda-applications/members)
