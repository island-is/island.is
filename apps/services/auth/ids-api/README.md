## About

Backend API for the island.is authentication server.

## Project Structure

The API interfaces solely with the authentication server, sharing services and database resources with the [auth-admin-api](https://docs.devland.is/apps/services/auth/admin-api).

## URLs

- Dev: N/A
- Staging: N/A
- Production: N/A

## Getting Started

Connect to either the AWS dev database or a local database container.

### Using Local Database

**Important:** For database migrations, use a local database container.

Ensure `sequelize.config.js` environment variables are set or cleared:

```bash
export DB_USER=dev_db
export DB_PASS=dev_db
export DB_NAME=dev_db
export DB_PORT=5433
```

Start the container:

```bash
yarn dev-services services-auth-ids-api
```

Run migration and seed scripts:

```bash
yarn nx run services-auth-ids-api:migrate
yarn nx run services-auth-ids-api:seed
```

### Using DEV Database

Use `scripts/run-db-proxy.sh` for AWS DEV database connection. Setup variables first:

```bash
export DB_USER=servicesauth
export DB_PASS=<AWS Param Store: '/k8s/services-auth/api/DB_PASSWORD'>
export DB_NAME=servicesauth
export DB_PORT=5432
```

Start the proxy:

```bash
./scripts/run-db-proxy.sh
```

### Running the API

Start the service:

```bash
yarn start services-auth-ids-api
```

## Code Owners and Maintainers

- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
- [Fuglar](https://github.com/orgs/island-is/teams/fuglar/members)