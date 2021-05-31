export default {
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
