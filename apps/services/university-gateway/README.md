# University Gateway API

## Overview

This service manages university program availability, linking the island.is application system with the university database.

## Quickstart

Ensure Docker is running. For setup, execute:

```bash
yarn dev-init services-university-gateway
yarn dev services-university-gateway
```

## API Service and Backend

### Initial Setup

To initialize services, run:

```bash
yarn dev-services services-university-gateway
```

Run migrations and seed scripts:

```bash
yarn nx run services-university-gateway:migrate
yarn nx run services-university-gateway:seed
```

### Start the API Service

Start with:

```bash
yarn start services-university-gateway
```

You can now access the [Swagger UI](localhost:3380/api/swagger).

### Regenerate the OpenAPI File

To regenerate the OpenAPI file, use:

```bash
yarn nx run services-university-gateway:codegen/backend-schema
```

## Worker

The worker handles scheduled tasks like fetching programs and courses from university APIs and updating the database.

### Running Locally

Start the worker with:

```bash
yarn nx run services-university-gateway:worker
```

