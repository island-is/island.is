# RSK Customs Calculator Client

Client for Skatturinn customs calculator endpoints.

This client follows the generated API pattern (no wrapper service class). Inject
the generated `CustomsCalculatorApi` from this package in your API domain service.

## Generate client code

Run the OpenAPI generator target to regenerate `gen/fetch` from
`src/clientConfig.json`:

`yarn nx run clients-rsk-customs-calculator:codegen/backend-client`

## Running unit tests

Run `nx test clients-rsk-customs-calculator` to execute the unit tests via [Jest](https://jestjs.io).
