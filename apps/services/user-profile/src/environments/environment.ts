const devConfig = {
  production: false,
  port: 3366,
  email: {
    fromEmail: 'noreply@island.is',
    fromName: 'island.is',
    replyToEmail: 'noreply@island.is',
    replyToName: 'island.is',
    servicePortalBaseUrl:
      process.env.SERVICE_PORTAL_BASE_URL ?? 'http://localhost:4200',
  },
  smsOptions: {
    url: 'https://smsapi.devnova.is',
    username: 'IslandIs_User_Development',
    password: process.env.NOVA_PASSWORD,
    acceptUnauthorized: true,
  },
  islykillConfig: {
    cert: process.env.ISLYKILL_CERT,
    basePath: process.env.ISLYKILL_SERVICE_BASEPATH,
    passphrase: process.env.ISLYKILL_SERVICE_PASSPHRASE,
  },
  emailOptions: {
    useTestAccount: true,
    useNodemailerApp: process.env.USE_NODEMAILER_APP === 'true' ?? false,
  },
  audit: {
    defaultNamespace: '@island.is/user-profile',
  },
  auth: {
    issuer:
      process.env.IDENTITY_SERVER_ISSUER_URL ??
      'https://identity-server.dev01.devland.is',
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
    acceptUnauthorized: process.env.NOVA_ACCEPT_UNAUTHORIZED === 'true',
  },
  islykillConfig: {
    cert: process.env.ISLYKILL_CERT,
    basePath: process.env.ISLYKILL_SERVICE_BASEPATH,
    passphrase: process.env.ISLYKILL_SERVICE_PASSPHRASE,
  },
  emailOptions: {
    useTestAccount: false,
    options: {
      region: process.env.EMAIL_REGION,
    },
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

export default process.env.PROD_MODE === 'true' ||
process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig
