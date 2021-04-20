export default {
  production: false,
  documentService: {
    basePath: process.env.POSTHOLF_BASE_PATH ?? '',
    clientId: process.env.POSTHOLF_CLIENTID ?? '',
    clientSecret: process.env.POSTHOLF_CLIENT_SECRET ?? '',
    tokenUrl: process.env.POSTHOLF_TOKEN_URL ?? '',
  },
  identityServer: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '',
    jwksUri:
      'https://identity-server.dev01.devland.is/.well-known/openid-configuration/jwks',
  },
}
