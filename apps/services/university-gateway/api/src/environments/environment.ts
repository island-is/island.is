const audience = ['@island.is']

const devConfig = {
  production: false,
  port: 3379,

  backend: {
    url: 'http://localhost:3380',
  },

  auth: {
    audience,
    issuer: 'https://identity-server.dev01.devland.is',
  },

  features: {
    hidden: process.env.HIDDEN_FEATURES ?? '',
  },
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.SAML_ENTRY_POINT) {
    throw new Error('Missing SAML_ENTRY_POINT environment.')
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
  port: 3379,
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.AUTH_AUDIENCE,
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    allowAuthBypass: process.env.ALLOW_AUTH_BYPASS === 'true',
    secretToken: process.env.BACKEND_ACCESS_TOKEN ?? '',
  },
  auditTrail: {
    useGenericLogger: process.env.AUDIT_TRAIL_USE_GENERIC_LOGGER === 'true',
    groupName: process.env.AUDIT_TRAIL_GROUP_NAME,
    serviceName: 'university-gateway-api',
    region: process.env.AUDIT_TRAIL_REGION,
  },
  backend: {
    url: process.env.BACKEND_URL,
  },
  features: {
    hidden: process.env.HIDDEN_FEATURES,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
