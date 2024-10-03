# Endorsements API

## About

This service manages endorsement lists within island.is.

## Quickstart

Run these commands:

```bash
yarn dev-init services-endorsements-api
yarn dev services-endorsements-api
```

## Initial setup

### Prerequisites

To run the API locally, ensure you have:

- [Docker](https://www.docker.com/products/docker-desktop) running
- Completed all prerequisites from:
  - [Getting started section at docs.devland.is](https://docs.devland.is/)
  - [AWS secrets section at docs.devland.is](https://docs.devland.is/repository/)

### Optional

- Set up a local test email server as per [instructions](https://docs.devland.is/libs/email-service)

### Initialize the application

```bash
yarn dev-init services-endorsements-api
```

## Run locally

Sign into AWS

```bash
aws sso login
```

Then run the application:

```bash
yarn dev services-endorsements-api
```

Visit localhost when ready:

```url
http://localhost:4246/swagger
```

After code changes, re-initialize the app for code autogeneration:

```bash
yarn dev-init services-endorsements-api
```

## Run tests

```bash
yarn test services-endorsements-api --skip-nx-cache
```

## Code owners and maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)
