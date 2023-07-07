### Initial setup

## Quickstart

Ensure docker is running, then run the following when running for the first time:

```bash
yarn dev-services services-university-gateway
```

To run the migrations and seed scripts:

```bash
yarn nx run services-university-gateway:migrate
yarn nx run services-university-gateway:seed
```

### Initialize the application

```bash
yarn start services-university-gateway
```

### Regenerate the OpenAPI file

```bash
yarn nx run services-university-gateway:schemas/build-openapi
```
