# Auth Admin API

## About

This is the backend API for the authentication administration user interface.

## Project Structure

The API integrates with the authentication administration user interface, sharing services and a database with the backend API for the authentication server ([auth-api](https://docs.devland.is/apps/services/auth/ids-api)).

## Environment URLs

- Dev: N/A
- Staging: N/A
- Production: N/A

## Getting Started

To run the API locally, start the database container:

```bash
yarn dev-services services-auth-ids-api
```

Run the migration and seed scripts:

```bash
yarn nx run services-auth-ids-api:migrate
yarn nx run services-auth-ids-api:seed
```

Start the service:

```bash
yarn start services-auth-admin-api
```

## Code Owners and Maintainers

- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
- [Fuglar](https://github.com/orgs/island-is/teams/fuglar/members)