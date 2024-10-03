# Sessions

REST API to store and list user sessions from our Identity Server.

## Quickstart

To start the service locally, run:

```bash
yarn dev-init services-sessions
yarn start services-sessions
```

## Getting Started

### Local Environment Setup

This service requires a Postgres database and a Redis cluster. To start them, ensure you have Docker and run:

```bash
yarn dev-services services-sessions
```

Run database migrations:

```bash
yarn nx run services-sessions:migrate
```

### API

To serve the API locally, execute:

```bash
yarn start services-sessions
```

Access the OpenAPI specs at:

```
http://localhost:3333/swagger
```

### Worker

Start the worker locally with:

```bash
PORT=3343 yarn nx run services-sessions:worker
```

## Contribute

Refer to our [documentation](https://docs.devland.is) before contributing to understand the repository.

### Add DB Migration

To update the database, create a new migration file using:

```bash
yarn nx run services-sessions:migration-create -- --name <migration-name>
```

## Code Owners and Maintainers

- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
- [Fuglar](https://github.com/orgs/island-is/teams/fuglar/members)