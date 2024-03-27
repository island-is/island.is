# API Domains Endorsement System

This library routes requests to the endorsement system app.

## Generate types and API clients

This library uses types and API clients from the endorsement system generated
via [OpenAPI generator](https://openapi-generator.tech/).
To generate API clients and types first build fresh OpenAPI schema in
endorsement system app, then create clients and types in this domain:

```bash
yarn nx run services-endorsement-api:codegen/backend-schema
yarn nx run api-domains-endorsement-system:codegen/backend-client`
```

## Running unit tests

Run using NX to execute the unit tests via [Jest](https://jestjs.io):

```bash
nx test api-domains-endorsement-system
```
