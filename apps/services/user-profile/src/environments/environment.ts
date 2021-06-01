const devConfig = {
  production: false,
  port: 3366,
  email: {
    fromEmail: 'noreply@island.is',
    fromName: 'island.is',
    replyToEmail: 'noreply@island.is',
    replyToName: 'island.is',
    servicePortalBaseUrl: 'http://localhost:4200',
  },
  smsOptions: {
    url: 'https://smsapi.devnova.is',
    username: 'IslandIs_User_Development',
    password: process.env.NOVA_PASSWORD,
  },
  emailOptions: {
    useTestAccount: true,
  },
  sentry: {
    dsn:
      'https://3c45a55273774b91a897b85e0a1243d1@o406638.ingest.sentry.io/5501494',
  },
  audit: {
    defaultNamespace: '@island.is/user-profile',
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@island.is',
  },
}

const prodConfig = {
  production: true,
  port: 3333,
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
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
