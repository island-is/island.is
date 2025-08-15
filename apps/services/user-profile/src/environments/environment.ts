const devConfig = {
  production: false,
  port: 3366,
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
