A very simple and straightforward application that demonstrates how you can connect 
a client made in Angular to island.is IdentityServer

Default settings to connect to IDS4, implemented in auth.service.ts
```ts
export function getClientSettings(): UserManagerSettings {
  return {
    authority: 'https://localhost:6001/',
    client_id: 'island-is-1',
    redirect_uri: `${window.location.origin}/signin-oidc`,
    response_type: 'code',
    scope: 'openid profile offline_access api_resource.scope',
    loadUserInfo: true,
    filterProtocolClaims: true,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  };
}

```