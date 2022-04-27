const devConfig = {
  production: false,
  audit: {
    defaultNamespace: '@island.is/download',
  },
  documentService: {
    basePath: process.env.POSTHOLF_BASE_PATH ?? '',
    clientId: process.env.POSTHOLF_CLIENTID ?? '',
    clientSecret: process.env.POSTHOLF_CLIENT_SECRET ?? '',
    tokenUrl: process.env.POSTHOLF_TOKEN_URL ?? '',
  },
  fjarmalDomain: {
    xroadApiPath:
      process.env.XROAD_FINANCES_PATH ??
      'IS-DEV/GOV/10021/FJS-Public/financeIsland',
    ttl: 600,
  },
  xroad: {
    baseUrl: process.env.XROAD_BASE_PATH ?? 'http://localhost:8081',
    clientId:
      process.env.XROAD_CLIENT_ID ?? 'IS-DEV/GOV/10000/island-is-client',
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '',
  },
  regulationsAdmin: {
    baseApiUrl:
      process.env.REGULATIONS_ADMIN_URL ?? 'http://localhost:3333/api',
    regulationsApiUrl:
      process.env.REGULATIONS_API_URL ??
      'https://reglugerdir-api.herokuapp.com/api/v1',
  },
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.IDENTITY_SERVER_ISSUER_URL) {
    throw new Error('Missing IDENTITY_SERVER_ISSUER_URL environment.')
  }
  if (!process.env.POSTHOLF_BASE_PATH) {
    throw new Error('Missing POSTHOLF_BASE_PATH environment.')
  }
}

const prodConfig = {
  production: true,
  audit: {
    defaultNamespace: '@island.is/download',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'download-service',
  },
  documentService: {
    basePath: process.env.POSTHOLF_BASE_PATH!,
    clientId: process.env.POSTHOLF_CLIENTID ?? '',
    clientSecret: process.env.POSTHOLF_CLIENT_SECRET ?? '',
    tokenUrl: process.env.POSTHOLF_TOKEN_URL ?? '',
  },
  fjarmalDomain: {
    xroadApiPath: process.env.XROAD_FINANCES_PATH ?? '',
    ttl: 600,
  },
  xroad: {
    baseUrl: process.env.XROAD_BASE_PATH ?? '',
    clientId: process.env.XROAD_CLIENT_ID ?? '',
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL!,
    audience: '',
  },
  regulationsAdmin: {
    baseApiUrl: process.env.REGULATIONS_ADMIN_URL ?? '',
    regulationsApiUrl: process.env.REGULATIONS_API_URL ?? '',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
