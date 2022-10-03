const devConfig = {
  production: false,
  audit: {
    defaultNamespace: '@island.is/personal-representative-public',
  },
  port: 3378,
  auth: {
    audience: '@island.is/auth',
    issuer:
      process.env.IDENTITY_SERVER_ISSUER_URL ??
      'https://identity-server.dev01.devland.is',
  },
}

const prodConfig = {
  production: true,
  audit: {
    defaultNamespace: '@island.is/personal-representative-public',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-personal-representative-public',
  },
  port: 3333,
  auth: {
    audience: '@island.is/auth',
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL ?? '',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
