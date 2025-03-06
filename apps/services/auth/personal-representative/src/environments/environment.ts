const devConfig = {
  production: false,
  audit: {
    defaultNamespace: '@island.is/personal-representative',
  },
  port: 3376,
  auth: {
    audience: '@island.is/auth',
    issuer:
      process.env.IDENTITY_SERVER_ISSUER_URL ??
      'https://innskra.dev01.devland.is',
  },
}

const prodConfig = {
  production: true,
  audit: {
    defaultNamespace: '@island.is/personal-representative',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-personal-representative',
  },
  port: 3333,
  auth: {
    audience: '@island.is/auth',
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL ?? '',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
