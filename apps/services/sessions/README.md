# Sessions

REST API to store and list user sessions from our Identity Server.

## Quickstart

Start the service locally:

```bash
yarn dev-init services-sessions
yarn start services-sessions
```

## Getting Started

### Local Environment Setup

This service requires a PostgreSQL database and a Redis cluster. Ensure Docker is installed:

```bash
yarn dev-services services-sessions
```

Run the database migrations:

```bash
yarn nx run services-sessions:migrate
```

### API

Serve the service API locally:

```bash
yarn start services-sessions
```

Access API OpenAPI specs at:

```plaintext
http://localhost:3333/swagger
```

### Worker

Start the worker locally:

```bash
PORT=3343 yarn nx run services-sessions:worker
```

## Contribute

Refer to our [documentation](https://docs.devland.is) before contributing.

### Add Database Migration

To update the database, create a new migration file:

```bash
yarn nx run services-sessions:migration-create -- --name <migration-name>
```

## Code Owners and Maintainers

- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
- [Fuglar](https://github.com/orgs/island-is/teams/fuglar/members)
