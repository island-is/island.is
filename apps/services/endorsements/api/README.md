# Endorsements API

## About

This service manages endorsement lists within Ísland.is.

## Quick start

Simply run these two commands:

```bash
yarn dev-init services-endorsements-api
yarn dev services-endorsements-api
```

## Initial setup

### Prerequisites

To run the API locally make sure you:

- Have [Docker](https://www.docker.com/products/docker-desktop) running
- Fulfill all prerequisites listed in:
- - [Getting started](https://docs.devland.is/development/getting-started)
- - [AWS secrets](https://docs.devland.is/repository/)

### Optional

- Have a local test email server according to [these instructions](https://docs.devland.is/libs/email-service).

### Initialize the application

```bash
yarn dev-init services-endorsements-api
```

## Run locally

Sign into AWS

```bash
aws sso login
```

Then run application using this command

```bash
yarn dev services-endorsements-api
```

And go to the [Swagger UI](http://localhost:4246/swagger) once project is ready and started

After making changes to the module code, re-initialize app to auto-generate code for swagger, OpenAPI, fetch clients etc.

```bash
yarn dev-init services-endorsements-api
```

## Run tests

```bash
yarn test services-endorsements-api --skip-nx-cache
```

## Code owners and maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)
