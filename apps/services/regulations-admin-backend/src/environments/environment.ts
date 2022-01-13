export default {
  production: process.env.NODE_ENV === 'production',
  regulationsApiUrl:
    process.env.REGULATIONS_API_URL ??
    'https://reglugerdir-api.herokuapp.com/api/v1',
  audit: {
    defaultNamespace: '@island.is/services/regulations-admin-backend',
    groupName: process.env.AUDIT_GROUP_NAME,
    // Same service name as in Nx workspace.json
    serviceName: 'regulations-admin-backend',
  },
  auth: {
    issuer:
      process.env.IDENTITY_SERVER_ISSUER_URL ??
      'https://identity-server.dev01.devland.is',
    audience: '@island.is',
  },
  nationalRegistry: {
    baseSoapUrl: process.env.SOFFIA_SOAP_URL ?? '',
    user: process.env.SOFFIA_USER ?? '',
    password: process.env.SOFFIA_PASS ?? '',
    host: process.env.SOFFIA_HOST_URL ?? 'soffiaprufa.skra.is',
  },
}
