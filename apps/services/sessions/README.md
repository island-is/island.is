# Sessions

REST API to store and list user sessions from our Identity Server.

## Quick start

To start the service locally, simply run this command:

```bash
yarn dev services-sessions
```

## Getting started

### Local environment setup

This service depends on Postgres database and a Redis cluster. So first we need
to start it, make sure you have docker:

```bash
yarn dev-services services-sessions
```

Then run the db migrations:

```bash
yarn nx run services-sessions:migrate
```

### API

You can serve this service API locally by running:

```bash
yarn start services-sessions
```

The OpenAPI specs will now be accessible [locally](http://localhost:3333/swagger)

### Worker

You can start the worker locally by running:

```bash
PORT=3343 yarn nx run services-sessions:worker
```

## Contribute

Please read our [docs](https://docs.devland.is) to learn about the repository
before getting started.

### Add DB migration

To make updates to the database you need to create a new migration file. To do
this run the following command:

```bash
yarn nx run services-sessions:migration-create -- --name <migration-name>
```

## Code owners and maintainers

- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
- [Fuglar](https://github.com/orgs/island-is/teams/fuglar/members)
