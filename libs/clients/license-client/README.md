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

There is some doubt about the way the client types are separated, some thoughts below

1. It feels weird to enable different methods based on if some config _(ids)_ is loaded or not. If it was just one big client some methods would only work if an ApiKey was supplied in config, and other would work if IDS config was provided.
2. Seems more logical to separate services based on intended usage. The license client and the update client aren't meant to used simultaneously (or even the same user type), why whould they be bundled in the same service?
3. The clients are under the same umbrella so to speak, so they should be in the same place.
4. The structure in the `License-client` is a bit messy but importing and using it is very nice. See `license-service`and `license-api`

### License Client (IDS authenticated)

- Provides interactions with both the digital license issuer and the organisation that issues the license itself.
- Requires IDS config.

### License Update Client

- To be used by machine clients **only**
- Provides interactions with the digital license issuer to update digital licenses, so external organisations can update user's digital licenses. Also communicates with the organisation through (as of now) _ApiKey_ authenticated functions.

## Running unit tests

Run `nx test clients-license-client` to execute the unit tests via [Jest](https://jestjs.io).
