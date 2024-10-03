# clients-ship-registry

This library was generated with [Nx](https://nx.dev).

## Running Unit Tests

To execute the unit tests using [Jest](https://jestjs.io), run the following command:

```sh
nx test ship-registry
```

## Updating the OpenAPI Definition

To update the `clientConfig.json` with the OpenAPI definition, run:

```sh
yarn nx run ship-registry:update-openapi-document
```

## Regenerating the Client

To regenerate the client using the updated OpenAPI specifications, execute:

```sh
yarn nx run ship-registry:schemas/external-openapi-generator
```
