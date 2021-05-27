export const environment = {
  production: false,
  audit: {
    defaultNamespace: '@island.is/auth-admin-api',
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    jwksUri:
      'https://identity-server.dev01.devland.is/.well-known/openid-configuration/jwks',
  },
}
