````markdown
# Sessions

REST API to store and list user sessions from our Identity Server.

## Quickstart

To start the service locally, run the following commands:

```bash
yarn dev-init services-sessions
yarn start services-sessions
```
````

## Getting Started

### Local Environment Setup

This service requires a PostgreSQL database and a Redis cluster. Ensure you have Docker installed, then start the services:

```bash
yarn dev-services services-sessions
```

Next, run the database migrations:

```bash
yarn nx run services-sessions:migrate
```

### API

You can serve the service API locally by executing:

```bash
yarn start services-sessions
```

Once the service is running, the OpenAPI specifications will be accessible at:

```text
http://localhost:3333/swagger
```

### Worker

Start the worker locally with the following command:

```bash
PORT=3343 yarn nx run services-sessions:worker
```

## Contribute

Please review our [documentation](https://docs.devland.is) to understand the repository before contributing.

### Add Database Migration

To update the database, create a new migration file using the command:

```bash
yarn nx run services-sessions:migration-create -- --name <migration-name>
```

## Code Owners and Maintainers

- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
- [Fuglar](https://github.com/orgs/island-is/teams/fuglar/members)

```

```
