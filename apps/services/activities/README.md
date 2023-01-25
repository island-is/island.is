# Activities

REST API to store and list user activities, i.e. login history from our Identity Server.

## Quickstart

To start the service locally, simply run these two commands:

```
yarn dev-init services-activities
yarn start services-activities
```

## Getting started

This service depends on Postgres database. So first we need to start it, make sure you have docker:

```bash
yarn dev-services services-activities
```

Then run the db migrations:

```bash
yarn nx run services-activities:migrate
```

You can serve this service locally by running:

```bash
yarn start services-activities
```

Api open api specs will now be accessible at

```bash
http://localhost:3333/
```

## Contribute

Please read our [docs](https://docs.devland.is) to learn about the repository before getting started.

### Add DB migration

To make updates to the database you need to create a new migration file. To do this run the following command:

```bash
yarn nx run services-activities:migration-create -- --name <migration-name>
```

## Code owners and maintainers

- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
- [Fuglar](https://github.com/orgs/island-is/teams/fuglar/members)
