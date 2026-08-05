# clients-rulings

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test rulings` to execute the unit tests via [Jest](https://jestjs.io).

### Regenerating the client:

```sh
yarn nx run rulings:codegen/backend-client
```

## Configuration

This client requires the following environment variables:

- `COMPLAINTS_COMMITTEE_RULINGS_API_BASE_PATH`: The base URL for the Rulings API (default: `https://api.onesystems.is`)
- `COMPLAINTS_COMMITTEE_RULINGS_API_KEY`: The API key for authentication
