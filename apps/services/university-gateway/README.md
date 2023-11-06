# University Gateway API

## About

This service manages university program availability, and connects applications between island.is application-system and university DB

## Quickstart

Ensure docker is running, then run the following when running for the first time:

Simply run these two commands:

```
yarn dev-init services-university-gateway
yarn dev services-university-gateway
```

### Backend

## Initial setup (backend)

```bash
yarn dev-services services-university-gateway
```

To run the migrations and seed scripts:

```bash
yarn nx run services-university-gateway:migrate
yarn nx run services-university-gateway:seed
```

## Start the API service (backend)

```bash
yarn start services-university-gateway
```

Open url:
localhost:3380/api/swagger

## Regenerate the OpenAPI file (backend)

```bash
yarn nx run services-university-gateway:schemas/build-openapi
```

### Worker

This service is for running scheduled tasks. Currently, fetching programs and courses from university APIs and adding data to out database.

## Running locally (Worker)

You can serve this service locally by running (make sure backend is running): TODOx

```bash
yarn start services-university-gateway-worker
```
