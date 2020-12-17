export default {
  production: true,
  applicationSystem: {
    baseApiUrl: process.env.APPLICATION_SYSTEM_API_URL,
  },
  drivingLicense: {
    baseApiUrl: process.env.DRIVING_LICENSE_REGISTRY_URL,
  },
  nationalRegistry: {
    baseSoapUrl: process.env.SOFFIA_SOAP_URL,
    user: process.env.SOFFIA_USER,
    password: process.env.SOFFIA_PASS,
    host: process.env.SOFFIA_HOST_URL,
  },
  userProfile: {
    userProfileServiceBasePath: process.env.SERVICE_USER_PROFILE_URL,
  },
  identityServer: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '',
    jwksUri: process.env.IDENTITY_SERVER_JWKS_URI,
  },
  documentService: {
    basePath: process.env.POSTHOLF_BASE_PATH,
    clientId: process.env.POSTHOLF_CLIENTID ?? '',
    clientSecret: process.env.POSTHOLF_CLIENT_SECRET ?? '',
    tokenUrl: process.env.POSTHOLF_TOKEN_URL ?? '',
  },
  documentProviderService: {
    basePath: process.env.DOCUMENT_PROVIDER_BASE_PATH_TEST,
    clientId: process.env.DOCUMENT_PROVIDER_CLIENTID_TEST ?? '',
    clientSecret: process.env.DOCUMENT_PROVIDER_CLIENT_SECRET_TEST ?? '',
    tokenUrl: process.env.DOCUMENT_PROVIDER_TOKEN_URL_TEST ?? '',
  },
}
