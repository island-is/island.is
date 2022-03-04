const devConfig = {
  production: false,
  audit: {
    defaultNamespace: '@island.is/auth-admin-api',
  },
  auth: {
    audience: '@island.is/auth/admin',
    issuer: 'https://identity-server.dev01.devland.is',
  },
}

const prodConfig = {
  production: true,
  audit: {
    defaultNamespace: '@island.is/auth-admin-api',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-auth-admin-api',
  },
  auth: {
    audience: '@island.is/auth/admin',
    issuer: process.env.IDS_ISSUER,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
