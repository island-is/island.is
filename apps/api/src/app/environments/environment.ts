export default {
  production: false,
  xroad: {
    baseUrl: 'http://localhost:8081',
    clientId: 'IS-DEV/GOV/10000/island-is-client',
  },
  applicationSystem: {
    baseApiUrl: 'http://localhost:3333',
  },
  drivingLicense: {
    secret: process.env.DRIVING_LICENSE_SECRET,
  },
  nationalRegistry: {
    baseSoapUrl: 'https://localhost:8443',
    user: process.env.SOFFIA_USER ?? '',
    password: process.env.SOFFIA_PASS ?? '',
    host: 'soffiaprufa.skra.is',
  },
  healthInsurance: {
    wsdlUrl:
      process.env.HEALTH_INSURANCE_XROAD_WSDLURL ??
      'https://test-huld.sjukra.is/islandrg?wsdl',
    baseUrl: process.env.XROAD_BASE_PATH ?? 'http://localhost:8080',
    username: process.env.HEALTH_INSURANCE_XROAD_USERNAME ?? '',
    password: process.env.HEALTH_INSURANCE_XROAD_PASSWORD ?? '',
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
    test: {
      basePath:
        'https://test-documentprovidermanagement-island-is.azurewebsites.net',
      clientId: process.env.DOCUMENT_PROVIDER_CLIENTID_TEST ?? '',
      clientSecret: process.env.DOCUMENT_PROVIDER_CLIENT_SECRET_TEST ?? '',
      tokenUrl: process.env.DOCUMENT_PROVIDER_TOKEN_URL_TEST ?? '',
    },
    prod: {
      basePath:
        'https://test-documentprovidermanagement-island-is.azurewebsites.net',
      clientId: process.env.DOCUMENT_PROVIDER_CLIENTID ?? '',
      clientSecret: process.env.DOCUMENT_PROVIDER_CLIENT_SECRET ?? '',
      tokenUrl: process.env.DOCUMENT_PROVIDER_TOKEN_URL ?? '',
    },
  },
  syslumennService: {
    url: process.env.SYSLUMENN_HOST ?? '',
    username: process.env.SYSLUMENN_USERNAME ?? '',
    password: process.env.SYSLUMENN_PASSWORD ?? '',
  },
}
