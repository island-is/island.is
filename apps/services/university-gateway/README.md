# University Gateway API

## About

This service manages university program availability and connects applications between the island.is application system and the university database.

## Quickstart

Ensure Docker is running. When executing for the first time, run the following commands:

```bash
yarn dev-init services-university-gateway
yarn dev services-university-gateway
```

### API Service and Backend

#### Initial Setup

To set up the project initially, execute:

```bash
yarn dev-services services-university-gateway
```

To run migrations and seed scripts, use:

```bash
yarn nx run services-university-gateway:migrate
yarn nx run services-university-gateway:seed
```

#### Start the API Service

To start the API service, run:

```bash
yarn start services-university-gateway
```

Access the API documentation at http://localhost:3380/api/swagger

#### Regenerate the OpenAPI File

To regenerate the OpenAPI file, execute:

```bash
yarn nx run services-university-gateway:codegen/backend-schema
```

### Worker

The worker service runs scheduled tasks, such as fetching programs and courses from university APIs and adding data to our database.

#### Running Locally

To start the worker locally, run:

```bash
yarn nx run services-university-gateway:worker
```
