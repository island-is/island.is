export const environment = {
  production: true,
  audit: {
    defaultNamespace: '@island.is/auth-admin-api',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-auth-admin-api',
  },
  auth: {
    issuer: process.env.IDS_ISSUER,
    jwksUri: process.env.JWKS_URI,
  },
}
