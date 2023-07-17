const devConfig = {
  production: false,
  idsTokenCookieName: process.env.IDS_COOKIE_NAME ?? 'next-auth.session-token',
  identityServerAuth: {
    issuer: process.env.IDENTITY_SERVER_DOMAIN
      ? `https://${process.env.IDENTITY_SERVER_DOMAIN}`
      : 'https://identity-server.dev01.devland.is',
    audience: '@rettarvorslugatt.island.is',
  },
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=judicial-system.local',
    audience: '@rettarvorslugatt.island.is',
    allowAuthBypass: true,
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-backend-api-token',
  },

  auditTrail: {
    useGenericLogger: true,
  },
  backend: {
    url: 'http://localhost:3344',
  },
  features: {
    hidden: process.env.HIDDEN_FEATURES ?? '',
  },
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.SAML_ENTRY_POINT) {
    throw new Error('Missing SAML_ENTRY_POINT environment.')
  }
  if (!process.env.AUTH_JWT_SECRET) {
    throw new Error('Missing AUTH_JWT_SECRET environment.')
  }
  if (!process.env.BACKEND_ACCESS_TOKEN) {
    throw new Error('Missing BACKEND_ACCESS_TOKEN environment.')
  }
  if (!process.env.AUDIT_TRAIL_GROUP_NAME) {
    throw new Error('Missing AUDIT_TRAIL_GROUP_NAME environment.')
  }
  if (!process.env.AUDIT_TRAIL_REGION) {
    throw new Error('Missing AUDIT_TRAIL_REGION environment.')
  }
  if (!process.env.BACKEND_URL) {
    throw new Error('Missing BACKEND_URL environment.')
  }
}

const prodConfig = {
  production: true,
  identityServerAuth: {
    issuer: process.env.IDENTITY_SERVER_DOMAIN
      ? `https://${process.env.IDENTITY_SERVER_DOMAIN}`
      : '',
    audience: '@rettarvorslugatt.island.is',
  },
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.AUTH_AUDIENCE,
    allowAuthBypass: process.env.ALLOW_AUTH_BYPASS === 'true',
    jwtSecret: process.env.AUTH_JWT_SECRET ?? '',
    secretToken: process.env.BACKEND_ACCESS_TOKEN ?? '',
  },
  auditTrail: {
    useGenericLogger: process.env.AUDIT_TRAIL_USE_GENERIC_LOGGER === 'true',
    groupName: process.env.AUDIT_TRAIL_GROUP_NAME,
    serviceName: 'judicial-system-api',
    region: process.env.AUDIT_TRAIL_REGION,
  },
  backend: {
    url: process.env.BACKEND_URL,
  },
  features: {
    hidden: process.env.HIDDEN_FEATURES,
  },
  idsTokenCookieName: process.env.IDS_COOKIE_NAME ?? 'next-auth.session-token',
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
