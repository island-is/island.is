# University Gateway API

## Overview

This service manages university program availability and facilitates application connections between island.is application-system and the university database.

## Quickstart

Ensure Docker is running. Initialize and start the service using:

```bash
yarn dev-init services-university-gateway
yarn dev services-university-gateway
```

### API Service and Backend

## Initial Setup

To set up the service, run:

```bash
yarn dev-services services-university-gateway
```

For database migrations and seeding:

```bash
yarn nx run services-university-gateway:migrate
yarn nx run services-university-gateway:seed
```

## Start the API Service

Start the API service with:

```bash
yarn start services-university-gateway
```

Access the Swagger documentation at:
`http://localhost:3380/api/swagger`

## Regenerate the OpenAPI File

To regenerate the backend OpenAPI schema, use:

```bash
yarn nx run services-university-gateway:codegen/backend-schema
```

### Worker Service

This service handles scheduled tasks, such as fetching programs and courses from university APIs and updating the database.

## Running the Worker Locally

To run the worker locally, execute:

```bash
yarn nx run services-university-gateway:worker
```