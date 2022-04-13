# Application System

## About

This project forms the base for all business applications belonging to island.is.

## Quickstart

Ensure docker is running, then run the following to set up:

```bash
yarn nx run application-system-api:dev/init
```

This command runs all _initial setup_ in the sections [API](#API) and [Form](#Form) below.

Then whenever you want to work on the application-system run this command:

```bash
yarn nx run application-system-api:dev
```

This command runs all _running locally_ in the sections [API](#API), [Form](#Form) and [graphql](#graphql) below, as well as starting x-road and soffia proxies.

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
yarn nx schemas/build-openapi application-system-api
```

to generate the code needed for openapi and swagger. Then you can visit

```bash
localhost:3333/swagger
```

In order to generate a typed fetch client run

```bash
yarn nx schemas/openapi-generator api-domains-application
```

In order to update the graphql schema as well, run

```bash
yarn nx schemas/build-graphql-schema api
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

### Adding a new template

- [Follow the Reference Template](https://github.com/island-is/island.is/tree/main/libs/application/templates/reference-template)

After following the Reference Template, repeat the steps from [OpenAPI and Swagger](https://github.com/island-is/island.is/tree/main/apps/application-system#openapi-and-swagger) or run `yarn install` to update schemas.

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

- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
