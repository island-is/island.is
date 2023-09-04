### Initial setup

## Quickstart

Ensure docker is running, then run the following when running for the first time:

```bash
yarn dev-services services-university-gateway-backend
```

To run the migrations and seed scripts:

```bash
yarn nx run services-university-gateway-backend:migrate
yarn nx run services-university-gateway-backend:seed
```

### Initialize the application (backend)

```bash
yarn start services-university-gateway-backend
```

Open url: localhost:3380/api/swagger

### Regenerate the OpenAPI file (backend)

```bash
yarn nx run services-university-gateway-backend:schemas/build-openapi
```

### Scheduler

This service is for running scheduled tasks. Currently, fetching programs and courses from university APIs and adding data to out database.

## Running locally (Scheduler)

You can serve this service locally by running:

```bash
yarn start services-university-gateway-scheduler
```
