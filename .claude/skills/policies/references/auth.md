# Authentication, authorisation and delegations (AUTH)

Sources: [Auth product docs](https://docs.devland.is/products/auth.md), [Delegations](https://docs.devland.is/products/auth/delegations.md), [ADR 0008 OAuth/OIDC](https://docs.devland.is/technical-overview/adr/0008-use-oauth-and-openid-connect.md)

- **AUTH-1** Every endpoint and resolver declares its scopes (`@Scopes`) and uses the auth guards (`IdsUserGuard`, `ScopesGuard`, or the domain's equivalent). A route without an explicit guard is a finding.
- **AUTH-2** Decide explicitly which delegation types a feature supports (legal guardian, procuration holder, personal representative, custom, legal representative). Clients and scopes are named `@domain/name` and declare their supported delegation types.
- **AUTH-3** In a delegation token, `nationalId` is the subject being acted for and `actor.nationalId` is the signed-in person. Authorise and audit on the right one. Never key a person's data on `sub` (it is unique per subject and actor pair).
- **AUTH-4** Access tokens are short-lived and can't be revoked. Refresh tokens rotate, and reuse kills the chain, so serialise refreshes (in the BFF). Refresh tokens never reach client-side JavaScript.
- **AUTH-5** Don't persist delegation information past sign-out. Re-fetch it at login.
- **AUTH-6** Audit-log every action that reads or changes a user's data (`@island.is/nest/audit`), with the acting and subject identity.
- **AUTH-7** Machine-to-machine traffic between organisations goes over X-Road with machine clients, not user tokens.
