export default {
  production: false,
  applicationSystem: {
    baseApiUrl: 'http://localhost:3333',
  },
  nationalRegistry: {
    baseSoapUrl: 'https://localhost:8443',
    user: process.env.SOFFIA_USER ?? '',
    password: process.env.SOFFIA_PASS ?? '',
    host: 'soffiaprufa.skra.is',
  },
  userProfile: {
    userProfileServiceBasePath: 'http://localhost:3366',
  },
  identityServer: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '',
    jwksUri:
      'https://identity-server.dev01.devland.is/.well-known/openid-configuration/jwks',
  },
  documentService: {
    basePath: 'https://test-skjalabirting-island-is.azurewebsites.net',
    clientId: process.env.POSTHOLF_CLIENTID ?? '',
    clientSecret: process.env.POSTHOLF_CLIENT_SECRET ?? '',
    tokenUrl: process.env.POSTHOLF_TOKEN_URL ?? '',
  },
  documentProviderService: {
    basePath:
      'https://test-documentprovidermanagement-island-is.azurewebsites.net',
    clientId: process.env.DOCUMENT_PROVIDER_CLIENTID_TEST ?? '',
    clientSecret: process.env.DOCUMENT_PROVIDER_CLIENT_SECRET_TEST ?? '',
    tokenUrl: process.env.DOCUMENT_PROVIDER_TOKEN_URL_TEST ?? '',
  },
}
