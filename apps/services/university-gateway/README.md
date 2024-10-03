# University Gateway API

## Overview

This service manages university program availability and facilitates connectivity between the island.is application-system and the university database.

## Quickstart

Ensure Docker is running. For initial setup, execute these commands:

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

To execute migrations and seed scripts:

```bash
yarn nx run services-university-gateway:migrate
yarn nx run services-university-gateway:seed
```

### Start the API Service

Start the service with:

```bash
yarn start services-university-gateway
```

Access the API documentation at:

```
localhost:3380/api/swagger
```

### Regenerate the OpenAPI File

To regenerate the OpenAPI file, use:

```bash
yarn nx run services-university-gateway:codegen/backend-schema
```

## Worker

The worker handles scheduled tasks such as fetching programs and courses from university APIs and updating the database.

### Running Locally

Start the worker locally using:

```bash
yarn nx run services-university-gateway:worker
```
