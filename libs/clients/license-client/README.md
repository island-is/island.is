# License Client

This library was generated with [Nx](https://nx.dev).

## About

This library serves as a license client factory for the following clients

- Firearm license
- Machine License
- ADR License
- Drivers License
- Disability License
- EHIC card
- Machine license
- Hunting license
- P Card
- Passport

The factory can return two types of clients, however only the license clients are meant for use inside the monorepo!
The update clients are for external organizations to query so they can update digital licenses

For examples of use, see api/domains/license-service

### License Client

- Provides interactions with both the digital license issuer and the organisation that issues the license itself.
- Requires IDS config.

### License Update Client

- To be used by machine clients **only**
- Provides interactions with the digital license issuer to update digital licenses, so external organisations can update user's digital licenses. Also communicates with the organisation through (as of now) _ApiKey_ authenticated functions.

## Running unit tests

Run `nx test clients-license-client` to execute the unit tests via [Jest](https://jestjs.io).
