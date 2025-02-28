export default {
  production: process.env.NODE_ENV === 'production',
  port: process.env.NODE_ENV === 'production' ? 3333 : 3369,
  audit: {
    defaultNamespace: '@island.is/documents',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-documents',
  },
  auth: {
    issuer:
      process.env.IDENTITY_SERVER_ISSUER_URL ??
      'https://innskra.dev01.devland.is',
    audience: ['@island.is', '@admin.island.is'],
  },
}
