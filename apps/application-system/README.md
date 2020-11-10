# Application system

## About

TODO

## URLs

- Dev: N/A
- Staging: N/A
- Production: N/A

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
yarn nx schemas/build-schema api
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

### Testing

It is as simple as:

```bash
yarn nx test application-system-form
```

## Code owners and maintainers

- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
