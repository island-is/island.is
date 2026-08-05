# clients-matilda

This library was generated with [Nx](https://nx.dev).

## OpenAPI workflow

Fetch and store latest Matilda OpenAPI document locally:

```bash
yarn nx run clients-matilda:update-openapi-document
```

Generate typed client code from `src/clientConfig.json`:

```bash
yarn nx run clients-matilda:codegen/backend-client
```

Run both in sequence:

```bash
yarn nx run clients-matilda:update-openapi-document && yarn nx run clients-matilda:codegen/backend-client
```

## Running unit tests

Run `nx test clients-matilda` to execute the unit tests via [Jest](https://jestjs.io).

## Lint

```bash
yarn nx run clients-matilda:lint
```
