```markdown
# License Client

This library was generated with [Nx](https://nx.dev).

## About

This library functions as a license client factory supporting the following license types:

- Firearm License
- Machine License
- ADR License
- Driver's License
- Disability License

The factory can produce two types of clients. Note: Only the license clients are intended for use within the monorepo. The update clients are designated for external organizations to update digital licenses.

For usage examples, refer to `api/domains/license-service`.

### License Client

- Facilitates interactions with both the digital license issuer and the organization responsible for issuing the license.
- Requires IDS (Identity Server) configuration.

### License Update Client

- Designated for machine clients **only**.
- Facilitates interactions with the digital license issuer to allow external organizations to update users' digital licenses. Communication with the organization is performed through currently available _ApiKey_ authenticated functions.

## Running Unit Tests

Use the command `nx test clients-license-client` to run the unit tests with [Jest](https://jestjs.io).
```