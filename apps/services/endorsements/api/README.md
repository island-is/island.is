# Endorsements API

## About

This service manages endorsement lists within island.is.

## Quickstart

Simply run these two commands:

```
yarn dev-init services-endorsements-api
yarn dev services-endorsements-api
```

## Initial setup

### Prerequisites

To run the API locally make sure you:

- Have [Docker](https://www.docker.com/products/docker-desktop) running
- Fulfill all prerequisites listed in:
- - [Getting started section at docs.devland.is](https://docs.devland.is/)
- - [AWS secrets section at docs.devland.is](https://docs.devland.is/repository/)

### Optional

- Have a local test email server according to these [instructions](https://docs.devland.is/libs/email-service)

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

And go to localhost once project is ready and started

```bash
http://localhost:4246/
```

After making changes to the module code, re-initalize app to autogenerate code for swagger, openapi, fetch client etc.

```bash
yarn dev-init services-endorsements-api
```

## Run tests

```bash
yarn test services-endorsements-api --skip-nx-cache
```

## Code owners and maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)
