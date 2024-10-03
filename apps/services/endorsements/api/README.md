# Endorsements API

## About

This service manages endorsement lists within island.is.

## Quickstart

Start the service by executing the following commands:

```bash
yarn dev-init services-endorsements-api
yarn dev services-endorsements-api
```

## Initial Setup

### Prerequisites

To run the API locally, ensure you have the following:

- [Docker](https://www.docker.com/products/docker-desktop) up and running.
- Complete the prerequisites listed in the following sections:
  - [Getting Started at docs.devland.is](https://docs.devland.is/)
  - [AWS Secrets at docs.devland.is](https://docs.devland.is/repository/)

### Optional

- Set up a local test email server following [these instructions](https://docs.devland.is/libs/email-service).

### Initialize the Application

To initialize the application, run:

```bash
yarn dev-init services-endorsements-api
```

## Running Locally

Sign into AWS:

```bash
aws sso login
```

Then, start the application with:

```bash
yarn dev services-endorsements-api
```

Once the project is ready and running, access it at:

```bash
http://localhost:4246/swagger
```

After making code changes, re-initialize the app to auto-generate code for Swagger, OpenAPI, fetch client, and other components:

```bash
yarn dev-init services-endorsements-api
```

## Running Tests

Execute the tests with the following command:

```bash
yarn test services-endorsements-api --skip-nx-cache
```

## Code Owners and Maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)
