# Clients Electronic Registrations

This library was generated using [Nx](https://nx.dev). It connects to a server to provide statistics on electronic and paper registrations.

## Running Unit Tests

Execute unit tests with [Jest](https://jestjs.io) by running:

```sh
nx test clients-electronic-registration-statistics
```

## Running Lint

Execute linting using [ESLint](https://eslint.org) by running:

```sh
nx lint clients-electronic-registration-statistics
```

## Usage

### Update Open API Definition

To update the OpenAPI definition (clientConfig.json), run:

```sh
yarn nx run clients-electronic-registration-statistics:update-openapi-document
```

### Regenerate Client

To regenerate the client, run:

```sh
yarn nx run clients-electronic-registration-statistics:codegen/backend-client
```