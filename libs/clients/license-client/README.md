# License Client

This library was generated with [Nx](https://nx.dev).

## About

This library acts as a license client factory for these clients:

- Firearm License
- Machine License
- ADR License
- Driver's License
- Disability License

The factory can return two types of clients, but only license clients are intended for internal use. Update clients are for external organizations to query for digital license updates.

Refer to `api/domains/license-service` for usage examples.

### License Client

- Allows interaction with the digital license issuer and the license-issuing organization.
- Requires IDS configuration.

### License Update Client

- Exclusively for machine clients.
- Facilitates digital license updates by external organizations via the digital license issuer, using _ApiKey_ authentication for communication with the organization.

## Running Unit Tests

Execute unit tests via [Jest](https://jestjs.io) by running `nx test clients-license-client`.
