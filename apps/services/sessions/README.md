# Sessions

REST API for managing user sessions from the Identity Server.

## Quickstart

To start the service locally:

```bash
yarn dev-init services-sessions
yarn start services-sessions
```

## Getting Started

### Local Environment Setup

This service needs a PostgreSQL database and a Redis cluster. Ensure Docker is installed:

```bash
yarn dev-services services-sessions
```

Run database migrations:

```bash
yarn nx run services-sessions:migrate
```

### API

To serve the service API locally:

```bash
yarn start services-sessions
```

You can now access the [Access API OpenAPI UI](http://localhost:3333/swagger).

### Worker

To start the worker locally:

```bash
PORT=3343 yarn nx run services-sessions:worker
```

## Contribute

Refer to our [documentation](https://docs.devland.is) before contributing.

### Add Database Migration

To create a database migration:

```bash
yarn nx run services-sessions:migration-create -- --name <migration-name>
```

## Code Owners and Maintainers

- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
- [Fuglar](https://github.com/orgs/island-is/teams/fuglar/members)
