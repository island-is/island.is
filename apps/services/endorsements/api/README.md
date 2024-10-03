# Endorsements API

## Overview

This service manages endorsement lists within island.is.

## Quickstart

Execute:

```bash
yarn dev-init services-endorsements-api
yarn dev services-endorsements-api
```

## Initial Setup

### Prerequisites

To run the API locally, ensure:

- [Docker](https://www.docker.com/products/docker-desktop) is running.
- Completion of all prerequisites from:
  - [Getting Started at docs.devland.is](https://docs.devland.is/)
  - [AWS Secrets at docs.devland.is](https://docs.devland.is/repository/)

### Optional

- Set up a local test email server as per [instructions](https://docs.devland.is/libs/email-service)

### Initialize the Application

```bash
yarn dev-init services-endorsements-api
```

## Run Locally

Sign into AWS:

```bash
aws sso login
```

Then start the application:

```bash
yarn dev services-endorsements-api
```

Access Swagger UI at:

```url
http://localhost:4246/swagger
```

After making code changes, re-initialize for code autogeneration:

```bash
yarn dev-init services-endorsements-api
```

## Run Tests

```bash
yarn test services-endorsements-api --skip-nx-cache
```

## Code Owners and Maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)
