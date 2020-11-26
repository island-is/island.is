export default {
  production: true,
  environment: process.env.ENVIRONMENT,
  identityServer: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '',
    jwksUri: process.env.IDENTITY_SERVER_JWKS_URI,
  },
  redis: {
    urls: [process.env.REDIS_URL_NODE_01],
  },
  servicePortalBasePath: process.env.SERVICE_PORTAL_BASE_PATH,
  emailOptions: {
    useTestAccount: false,
    options: {
      region: process.env.EMAIL_REGION,
    },
  },
}
