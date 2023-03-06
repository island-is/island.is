const audience = ['@island.is/auth/admin', '@admin.island.is']
const issuer = [
  'https://identity-server.dev01.devland.is',
  'https://identity-server.staging01.devland.is',
  'https://innskra.island.is',
]

const devConfig = {
  production: false,
  audit: {
    defaultNamespace: '@island.is/auth-admin-api',
  },
  auth: {
    audience,
    issuer,
  },
  port: 6333,
}

const prodConfig = {
  production: true,
  audit: {
    defaultNamespace: '@island.is/auth-admin-api',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-auth-admin-api',
  },
  auth: {
    audience,
    issuer,
  },
  port: 3333,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
