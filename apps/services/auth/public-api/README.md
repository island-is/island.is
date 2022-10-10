<!-- gitbook-navigation: "Public API" -->

# Auth Public API

## About

A service for external clients which allows them to query the list of available delegations.

## Getting started

To run the API locally, you first need to start the database container:

```bash
yarn dev-services services-auth-ids-api
```

Then run the migration scripts:
(Note: when running locally you need to make sure the environmental variable "DB_PASS" is either empty or equal to "dev_db")

```bash
yarn nx run services-auth-ids-api:migrate
```

Finally, start the service:

```bash
yarn start services-auth-public-api
```
