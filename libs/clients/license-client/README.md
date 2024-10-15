# License Client

This library was generated with [Nx](https://nx.dev).

## Overview

The library functions as a license client factory for:

- Firearm License
- Machine License
- ADR License
- Driver's License
- Disability License

The factory provides two types of clients:

- **License Clients**: For internal use.
- **Update Clients**: For external organizations to update licenses.

For usage examples, refer to `api/domains/license-service`.

### License Client

- Interacts with the digital license issuer and the organization.
- Requires IDS configuration.

### License Update Client

- For machine clients only.
- Uses _ApiKey_ authentication for external organizations to update licenses via the digital license issuer.

## Running Unit Tests

Run unit tests with [Jest](https://jestjs.io) using:

```bash
nx test clients-license-client
```
