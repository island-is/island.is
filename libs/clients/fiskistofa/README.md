```markdown
# Clients Fiskistofa

This library was generated with [Nx](https://nx.dev).

## Running Unit Tests

To execute the unit tests via [Jest](https://jestjs.io), run the following command:

```bash
nx test clients-fiskistofa
```

## Running Lint

To perform linting using [ESLint](https://eslint.org/), run the following command:

```bash
nx lint clients-fiskistofa
```

## Usage

### Updating the OpenAPI Definition

To update the OpenAPI definition (`clientConfig.json`), run:

```bash
yarn nx run clients-fiskistofa:update-openapi-document
```

### Regenerating the Client

To regenerate the client, use the following command:

```bash
yarn nx run clients-fiskistofa:codegen/backend-client
```
```