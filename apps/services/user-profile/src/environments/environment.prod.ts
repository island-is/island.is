export default {
  production: true,
  email: {
    fromEmail: process.env.EMAIL_FROM,
    fromName: process.env.EMAIL_FROM_NAME,
    servicePortalBaseUrl: process.env.SERVICE_PORTAL_BASE_URL,
  },
  smsOptions: {
    url: process.env.NOVA_URL,
    username: process.env.NOVA_USERNAME,
    password: process.env.NOVA_PASSWORD,
  },
  emailOptions: {
    useTestAccount: false,
    options: {
      region: process.env.EMAIL_REGION,
    },
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  audit: {
    defaultNamespace: '@island.is/user-profile',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-user-profile',
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '@island.is',
    jwksUri: process.env.IDENTITY_SERVER_JWKS_URI,
  },
}
