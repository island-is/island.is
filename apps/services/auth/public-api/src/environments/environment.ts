const devConfig = {
  production: false,
  audit: {
    defaultNamespace: '@island.is/auth-public-api',
  },
  auth: {
    issuer: 'https://innskra.dev01.devland.is',
    audience: '@island.is',
  },
  port: 3370,
}

const prodConfig = {
  production: true,
  audit: {
    defaultNamespace: '@island.is/auth-public-api',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-auth-public-api',
  },
  auth: {
    audience: '@island.is',
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL!,
  },
  port: 3333,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
