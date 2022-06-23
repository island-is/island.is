# Island.is Authentication Service

Digital Iceland has created the Island.is Authentication Service (IAS) as a modern solution to help government organisations authenticate users online. The service is built on open standards including OAuth2 and Open ID Connect and includes scope-based authorisation functionality to support different kinds of delegations as well as user-based API authorisation across organisational boundaries.

Delegations allow individuals to access digital services on behalf of another individual or legal entities. E.g. guardians can access services on behalf of children they ward, and employees can access services on behalf of the company they work for. Note that with delegations, as opposed to impersonation, each delegated access includes cryptographically signed claims about the actual authenticated user.

This documentation is meant for developers and software architects at Service Providers (SPs) planning to integrate with the IAS. It describes the architecture of the authentication service and how to use it.

A full documentation of Open ID Connect (OIDC) and OAuth2 is outside the scope of this documentation. We recommend reading the following resources before integrating with IAS.

- [Open ID Connect](https://openid.net/connect/)
- [OAuth 2](https://oauth.net/2/)

## Table of contents

- [Terminology](./terminology.md)
- [Integration options](./integration-options.md)
- [Authentication flows](./authentication-flows.md)
- [Authorising API endpoints](./authorising-apis.md)
- [Session lifecycle](./session-lifecycle.md)
- [Scopes and tokens](./scopes-and-tokens.md)
- [Delegations (BETA)](./delegations.md)
- [Configuring clients and scopes](./configuration.md)
- [Tools and integration examples](./integration-guidance.md)
- [Environments](./environments.md)
