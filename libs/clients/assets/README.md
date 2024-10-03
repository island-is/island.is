````markdown
# Assets Client

The Assets Client library is a component built with [Nx](https://nx.dev), providing functionality for managing assets within an application.

## Running Unit Tests

To run the unit tests for the Assets Client, use the following command. The tests are executed via [Jest](https://jestjs.io):

```bash
nx test clients-assets
```
````

## Running Lint

To run linting checks for the Assets Client, use the command below. The linting is carried out using [ESLint](https://eslint.org/):

```bash
nx lint clients-assets
```

## Updating the OpenAPI Definition

If you need to update the OpenAPI definition, which is configured in `clientConfig.json`, execute the following command:

```bash
yarn nx run clients-assets:codegen/backend-client
```

```

```
