const devConfig = {
  production: false,
  port: 3366,
  smsOptions: {
    url: 'https://smsapi.devnova.is',
    username: 'IslandIs_User_Development',
    password: process.env.NOVA_PASSWORD ?? '',
    acceptUnauthorized: true,
  },
  islykillConfig: {
    cert: process.env.ISLYKILL_CERT ?? '',
    basePath: process.env.ISLYKILL_SERVICE_BASEPATH ?? '',
    passphrase: process.env.ISLYKILL_SERVICE_PASSPHRASE ?? '',
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
    audience: ['@island.is', '@admin.island.is'],
  },
}

const prodConfig = {
  production: true,
  port: 3333,
  smsOptions: {
    url: process.env.NOVA_URL ?? '',
    username: process.env.NOVA_USERNAME ?? '',
    password: process.env.NOVA_PASSWORD ?? '',
    acceptUnauthorized: process.env.NOVA_ACCEPT_UNAUTHORIZED === 'true',
  },
  islykillConfig: {
    cert: process.env.ISLYKILL_CERT ?? '',
    basePath: process.env.ISLYKILL_SERVICE_BASEPATH ?? '',
    passphrase: process.env.ISLYKILL_SERVICE_PASSPHRASE ?? '',
  },
  emailOptions: {
    useTestAccount: false,
    options: {
      region: process.env.EMAIL_REGION ?? '',
    },
  },
  audit: {
    defaultNamespace: '@island.is/user-profile',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-user-profile',
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL ?? '',
    audience: ['@island.is', '@admin.island.is'],
  },
}

export default process.env.PROD_MODE === 'true' ||
process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig
