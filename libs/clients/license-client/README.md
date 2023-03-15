# License Client

This library was generated with [Nx](https://nx.dev).

## About

This library serves as a license client factory for the following clients

- Firearm license
- Machine License
- ADR License
- Drivers License
- Disability License

There are two kinds of clients that can be generated that are meant to be used by different entities, _License Clients_ or _License Update Clients_.
As of now, users can import either, or both, if they want, as long as they fulfill the dependancies. The clients have different roles, which are expanded upon below
Maybe better to export a factory function with an `${authentication scheme}` parameter that provides either client type?

### License Client (IDS authenticated)

- Provides interactions with both the digital license issuer and the organization that issues the license itself.
- Requires IDS config.

### License Update Client

- To be used by machine clients **only**
- Provides interactions with the digital license issuer to update digital licenses, so external organisations can update user's digital licenses. Also communicates with the organisation through (as of now) _ApiKey_ authenticated functions.

## Running unit tests

Run `nx test clients-license-client` to execute the unit tests via [Jest](https://jestjs.io).
