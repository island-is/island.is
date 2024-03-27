# Endorsements API

## About

This service manages endorsement lists within island.is.

## Quick start

Simply run this command:

```bash
yarn dev services-endorsements-api
```

## Initial setup

### Prerequisites

To run the API locally make sure you:

- Have [Docker](https://www.docker.com/products/docker-desktop) running
- Fulfill all prerequisites listed in:
- - [Getting started section in our docs](https://docs.devland.is/development/getting-started)
- - [AWS secrets section at our](https://docs.devland.is/repository/)

### Optional

- Have a local test email server according to these [instructions](https://docs.devland.is/libs/email-service)

### Initialize the application

```bash
yarn nx run services-endorsements-api:dev:init
```

## Run locally

Sign into AWS

```bash
aws sso login
```

Then run application using this command

```bash
yarn nx run services-endorsements-api:dev:run
```

The application should now be available [locally](http://localhost:4246/).

After making changes to the module code, re-initialise app to auto-generate code
for swagger, OpenAPI, fetch client etc.

```bash
yarn nx run services-endorsements-api:dev:init
```

## Run tests

```bash
yarn test services-endorsements-api
```

## Code owners and maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)
