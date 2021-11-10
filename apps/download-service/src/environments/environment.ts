const devConfig = {
  production: false,
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
    baseUrl: 'http://localhost:8081',
    clientId:
      process.env.XROAD_CLIENT_ID ?? 'IS-DEV/GOV/10000/island-is-client',
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '',
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
  documentService: {
    basePath: process.env.POSTHOLF_BASE_PATH!,
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
    baseUrl: process.env.XROAD_BASE_PATH ?? '',
    clientId: process.env.XROAD_CLIENT_ID ?? '',
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL!,
    audience: '',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
