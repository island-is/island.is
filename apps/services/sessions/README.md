# Sessions

REST API to store and list user sessions from our Identity Server.

## Quickstart

To start the service locally, simply run these two commands:

```
yarn dev-init services-sessions
yarn start services-sessions
```

## Getting started

### Local env setup

This service depends on Postgres database and a redis cluster. So first we need to start it, make sure you have docker:

```bash
yarn dev-services services-sessions
```

Then run the db migrations:

```bash
yarn nx run services-sessions:migrate
```

### API

You can serve this service api locally by running:

```bash
yarn start services-sessions
```

Api open api specs will now be accessible at

```bash
http://localhost:3333/swagger
```

### Worker

You can start the worker locally by running:

```bash
PORT=3343 yarn nx run services-sessions:worker
```

## Contribute

Please read our [docs](https://docs.devland.is) to learn about the repository before getting started.

### Add DB migration

To make updates to the database you need to create a new migration file. To do this run the following command:

```bash
yarn nx run services-sessions:migration-create -- --name <migration-name>
```

## Code owners and maintainers

- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
- [Fuglar](https://github.com/orgs/island-is/teams/fuglar/members)
