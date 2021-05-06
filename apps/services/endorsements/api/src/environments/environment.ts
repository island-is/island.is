export const environment = {
  metadataProviser: {
    nationalRegistry: {
      baseSoapUrl: 'https://localhost:8443',
      user: process.env.SOFFIA_USER ?? '',
      password: process.env.SOFFIA_PASS ?? '',
      host: 'soffiaprufa.skra.is',
    },
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '',
    jwksUri:
      'https://identity-server.dev01.devland.is/.well-known/openid-configuration/jwks',
  },
  swagger: {
    authUrl: 'https://identity-server.dev01.devland.is/connect/authorize',
    tokenUrl: 'https://identity-server.dev01.devland.is/connect/token',
  },
  apiMock: process.env.API_MOCKS === 'true',
  audit: {
    defaultNamespace: '@island.is/services-endorsements-api',
  },
}
