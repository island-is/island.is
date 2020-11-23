# Use OAuth 2.0 and OpenID Connect as protocols for Authentication and Authorization

- Status: accepted
- Date: 2020-06-02

## Context and Problem Statement

What protocol(s) shall we use as the new standard for authentication and authorization. It would be supported by our new centralized authority server and should be implemented in all new clients and resource systems needing authentication or authorization. A requirement might be made that the authority service need to support other protocols for legacy systems but all new systems should be encourage to use the same protocol.

## Decision Drivers

- Secure
- Well defined and well reviewed standard
- Easy to implement by client and resource systems
- Support for non web client systems i.e. mobile devices

## Considered Options

- OAuth 2.0 + OpenID Connect
- SAML 2.0

## Decision Outcome

Chosen option: "OAuth 2.0 + OpenID Connect", because it is secure and well examined and and has support libraries for our tech stack.

## Pros and Cons of the Options

### OAuth 2.0 + OpenID Connect

- Good, because the authentication protocal is designed specifically to work with the authorization protocol.
- Good, because it supports non web clients i.e. native apps.
- Good, because it has certified, open source libraries for relying parties for OpenID authentication that match our

  tech stack (javascript with typescript defenitions).

- Bad, because it could require large tokens for authorization for multiple services, or split up tokens complicating

  the process.

### SAML 2.0

- Good, because it is the currently used standard for legacy systems.
- Bad, because it doesn't have good support for non web clients.
- Bad, because main focus is on enterprise SSO, not centralized authorization.
