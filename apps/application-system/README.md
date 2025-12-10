# Application System

## Quickstart

Ensure docker is running, then run the following when running for the first time:

```bash
yarn dev-init application-system-api
or
yarn dev-init application-system-form
```

depending on whether you're working on the API or an application form.

To start the app:

```bash
yarn dev application-system-api
or
yarn dev application-system-form
```

depending on whether you're working on the API or an application form.

These commands are just shorthands for the setup described below.

## About

This project forms the base for all business applications belonging to island.is.

## URLs

- [Dev](https://beta.dev01.devland.is/umsoknir/)
- [Staging](https://beta.staging01.devland.is/umsoknir/)
- [Production](https://island.is/umsoknir/)

## API

### Initial setup

First, make sure you have docker, then run:

```bash
yarn dev-services application-system-api
```

Then run the migrations:

```bash
yarn nx run application-system-api:migrate
```

### Running locally

You can serve this service locally by running:

```bash
yarn start application-system-api
```

### Graphql

Make sure you are serving the graphql client as well in order for you to make graphql calls to this service:

```bash
yarn start api
```

### OpenApi and Swagger

When making changes to the module code, run

```bash
yarn nx codegen/backend-schema application-system-api
```

to generate the code needed for openapi and swagger. Then you can visit

```bash
localhost:3333/swagger
```

In order to generate a typed fetch client run

```bash
yarn nx codegen/backend-client api-domains-application
```

In order to update the graphql schema as well, run

```bash
yarn nx codegen/backend-schema api
```

## Form

This app contains the frontend app for the application system

### Running locally

You can serve this app locally by running:

```bash
yarn start application-system-form
```

The only backend apps this app depends on are the graphql api and the application-system-api. Therefore, make sure you run those as well:

```bash
yarn start application-system-api
```

(see `apps/application-system/api/README.md` if you run into any problems here)

and

```bash
yarn start api
```

### Adding a new template (make a new application)

- [Follow the example templates](https://github.com/island-is/island.is/tree/main/libs/application/templates/examples/README.md)

After following the example templates, repeat the steps from [OpenAPI and Swagger](https://github.com/island-is/island.is/tree/main/apps/application-system#openapi-and-swagger) or run `yarn codegen`.

### Adding a payment step

If your application requires that the user pay a fee as part of the application process,
that can be implemented by following the
[adding a payment step](../../handbook/misc/application-payment-guide.md) guide

### Testing

It is as simple as:

```bash
yarn nx test application-system-form
```

## Code owners and maintainers

- [Norda](https://github.com/orgs/island-is/teams/norda/members)
