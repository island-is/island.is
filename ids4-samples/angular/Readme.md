A very simple and straightforward application that demonstrates how you can connect 
a client made in Angular to island.is IdentityServer

The service is setup with environment variables for nonproduction only
Default environment variables for nonproduction are
```ts
export const environment = {
  production: false,
  serviceLink: 'https://localhost:5001/',
  identityServer: {
    authority: 'https://localhost:6001/',
    clientId: 'island-is-1',
    redirectUri: `${window.location.origin}/signin-oidc`,
    responseType: 'code',
    scope: 'openid profile offline_access api_resource.scope'
  }
};
```