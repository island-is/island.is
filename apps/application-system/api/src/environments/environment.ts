export default {
  production: false,
  environment: 'local',
  identityServer: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: 'api_resource.scope', // TODO update scope when a new one has been created, uses same scope as graphql api atm
    jwksUri:
      'https://identity-server.dev01.devland.is/.well-known/openid-configuration/jwks',
  },
  redis: {
    urls: [
      'localhost:7000',
      'localhost:7001',
      'localhost:7002',
      'localhost:7003',
      'localhost:7004',
      'localhost:7005',
    ],
  },
  emailOptions: {
    useTestAccount: true,
  },
  servicePortalBasePath: undefined, // locally, do not depend on the user profile service being run as well
}
