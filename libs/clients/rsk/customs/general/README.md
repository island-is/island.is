# RSK Customs General Client

NestJS client for the Tollur Almennt API from Skatturinn (RSK), providing reference data used in customs declarations.

## Codegen

The client is generated from `src/clientConfig.json` using `@hey-api/openapi-ts`. To regenerate:

```bash
nx run clients-rsk-customs-general:codegen/backend-client
```

## Running unit tests

Run `nx test clients-rsk-customs-general` to execute the unit tests via [Jest](https://jestjs.io).
