const audience = ['@island.is/auth/admin', '@admin.island.is']

const devConfig = {
  production: false,
  audit: {
    defaultNamespace: '@island.is/auth-admin-api',
  },
  auth: {
    audience,
    issuer: 'https://identity-server.dev01.devland.is',
  },
  port: 6333,
  clientSecretEncryptionKey:
    process.env.CLIENT_SECRET_ENCRYPTION_KEY ?? 'secret',
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
    issuer: JSON.parse(process.env.IDENTITY_SERVER_ISSUER_URL_LIST || '[]'),
  },
  port: 3333,
  clientSecretEncryptionKey: process.env.CLIENT_SECRET_ENCRYPTION_KEY,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
