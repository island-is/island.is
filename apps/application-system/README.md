# Application System

## Quickstart

Ensure Docker is running, then execute one of the following commands when setting up for the first time:

```bash
yarn dev-init application-system-api
```

or

```bash
yarn dev-init application-system-form
```

depending on whether you are working on the API or the application form.

To start the application, use:

```bash
yarn dev application-system-api
```

or

```bash
yarn dev application-system-form
```

based on your focus area (API or form).

These commands are shorthands for the comprehensive setup described below.

## About

This project serves as the foundation for all business applications for island.is.

## URLs

- [Development](https://beta.dev01.devland.is/umsoknir/)
- [Staging](https://beta.staging01.devland.is/umsoknir/)
- [Production](https://island.is/umsoknir/)

## API

### Initial Setup

Ensure Docker is installed, then run:

```bash
yarn dev-services application-system-api
```

Next, execute the database migrations:

```bash
yarn nx run application-system-api:migrate
```

### Running Locally

You can serve the API service locally by executing:

```bash
yarn start application-system-api
```

### GraphQL

Ensure the GraphQL client is running to enable GraphQL queries to this service:

```bash
yarn start api
```

### OpenAPI and Swagger

After modifying module code, run the following to update OpenAPI and Swagger definitions:

```bash
yarn nx codegen/backend-schema application-system-api
```

Then access Swagger at:

```plaintext
localhost:3333/swagger
```

To generate a typed fetch client, execute:

```bash
yarn nx codegen/backend-client api-domains-application
```

To update the GraphQL schema, run:

```bash
yarn nx codegen/backend-schema api
```

## Form

This app includes the frontend functionality for the application system.

### Running Locally

To serve the application locally, execute:

```bash
yarn start application-system-form
```

Ensure dependencies (GraphQL API and application-system-api) are also running:

```bash
yarn start application-system-api
```

(Refer to `apps/application-system/api/README.md` for troubleshooting)

and

```bash
yarn start api
```

### Adding a New Template

Follow the instructions provided in the [Reference Template](https://github.com/island-is/island.is/tree/main/libs/application/templates/reference-template).

After following the Reference Template, refer back to [OpenAPI and Swagger](https://github.com/island-is/island.is/tree/main/apps/application-system#openapi-and-swagger) or execute `yarn codegen`.

### Adding a Payment Step

If your application requires a fee payment as part of the process, follow the [Adding a Payment Step](../../handbook/misc/application-payment-guide.md) guide.

### Testing

Run the following command to initiate testing:

```bash
yarn nx test application-system-form
```

## Code Owners and Maintainers

- [Norda](https://github.com/orgs/island-is/teams/norda-applications/members)