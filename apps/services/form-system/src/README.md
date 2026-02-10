# Form System

## Quickstart

Ensure docker is running, then run the following when running for the first time:

```bash
yarn dev-init services-form-system-api
```

To start the app:

```bash
yarn dev services-form-system-api
```

These commands are just shorthands for the setup described below.

## URLs

- [Dev](https://beta.dev01.devland.is/TODO/)
- [Staging](https://beta.staging01.devland.is/TODO/)
- [Production](https://island.is/TODO/)

## API

### Initial setup

First, make sure you have docker, then run:

```bash
yarn dev-services services-form-system-api
```

Then run the migrations:

```bash
yarn nx run services-form-system-api:migrate
```

### Running locally

You can serve this service locally by running:

```bash
yarn start services-form-system-api
```

## Code owners and maintainers

- [Advania](https://github.com/orgs/island-is/teams/advania/members)
