# clients-ship-registry

This library was generated with [Nx](https://nx.dev).

## Running Unit Tests

Execute unit tests using [Jest](https://jestjs.io) with the following command:

```sh
nx test ship-registry
```

## Updating OpenAPI Definition

To update the OpenAPI definition (`clientConfig.json`), run:

```sh
yarn nx run ship-registry:update-openapi-document
```

## Regenerating the Client

To regenerate the client, execute:

```sh
yarn nx run ship-registry:schemas/external-openapi-generator
```