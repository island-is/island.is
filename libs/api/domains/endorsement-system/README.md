````markdown
# API Domains Endorsement System

This library routes requests to the endorsement system application.

## Generate Types and API Clients

This library leverages types and API clients from the endorsement system, which are generated using [OpenAPI Generator](https://openapi-generator.tech/).

To generate the API clients and types, follow these steps:

1. Build a fresh OpenAPI schema in the endorsement system app by running:
   ```bash
   yarn nx run services-endorsement-api:codegen/backend-schema
   ```
````

2. Create clients and types within this domain by executing:
   ```bash
   yarn nx run api-domains-endorsement-system:codegen/backend-client
   ```

## Running Unit Tests

Execute unit tests using [Jest](https://jestjs.io) by running the following command:

```bash
ng test api-domains-endorsement-system
```

```

```
