## Endorsements API

### About

This service manages endorsement lists within island.is.

### Quickstart

Run the following:

```
yarn dev-init services-endorsements-api
yarn dev services-endorsements-api
```

### Initial Setup

#### Prerequisites

To run the API locally, ensure you:

- Have [Docker](https://www.docker.com/products/docker-desktop) running.
- Fulfill prerequisites from:
  - [Getting Started](https://docs.devland.is/)
  - [AWS Secrets](https://docs.devland.is/repository/)

#### Optional

- Set up a local test email server [here](https://docs.devland.is/libs/email-service).

### Initialize the Application

```bash
yarn dev-init services-endorsements-api
```

### Run Locally

Sign into AWS:

```bash
aws sso login
```

Start the application:

```bash
yarn dev services-endorsements-api
```

Access the project:

```bash
http://localhost:4246/swagger
```

Re-initialize after code changes to regenerate Swagger, OpenAPI, etc.:

```bash
yarn dev-init services-endorsements-api
```

### Run Tests

```bash
yarn test services-endorsements-api --skip-nx-cache
```

### Code Owners and Maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)