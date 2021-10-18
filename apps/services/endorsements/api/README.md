# Endorsements API

## About

This service manages endorsement lists within island.is.

## Initial setup

### Prerequisites

To run the API locally make sure you:

- Have [Docker](https://www.docker.com/products/docker-desktop) running
- Fulfill all prerequisites listed in:
- - [Getting started section at docs.devland.is](https://docs.devland.is/)
- - [AWS secrets section at docs.devland.is](https://docs.devland.is/repository/)

### Environment variables

[direnv](https://direnv.net/docs/installation.html) is recommended for autoloading environment variables

### Initialize the application

```bash
yarn nx run services-endorsements-api:dev/init
```

## Running locally

Sign into AWS

```bash
aws sso login
```

Then run application using this command

```bash
yarn nx run services-endorsements-api:dev
```

And go to localhost once project is ready and started

```bash
http://localhost:4246/
http://localhost:4246/liveness
http://localhost:4246/version
```

After making changes to the module code, re-initalize app to autogenerate code for swagger, openapi, fetch client etc.
```bash
yarn nx run services-endorsements-api:dev/init
```

## Run tests

```bash
yarn test services-endorsements-api
```

## Code owners and maintainers

- [Júní, formerly Kosmos&Kaos](https://github.com/orgs/island-is/teams/kosmos-kaos/members)
