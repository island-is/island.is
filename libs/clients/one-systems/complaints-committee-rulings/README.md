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

- `COMPLAINTS_COMMITTEE_RULINGS_API_BASE_PATH`: The base URL for the Rulings API (default: `https://onedemo.onecrm.is`). A value with a path, such as `https://kvth-one2.onecrm.is/addons/Kvth_one2/KVTH_RulingsAPI`, is used as the API root as is. A bare origin gets `/OneRulings` appended.
- `COMPLAINTS_COMMITTEE_RULINGS_API_KEY`: The API key for authentication
