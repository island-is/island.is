const devConfig = {
  production: false,
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=judicial-system.local',
    audience: 'localhost:4200',
    allowAuthBypass: true,
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-backend-api-token',
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
  if (!process.env.BACKEND_URL) {
    throw new Error('Missing BACKEND_URL environment.')
  }
}

const prodConfig = {
  production: true,
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.AUTH_AUDIENCE,
    allowAuthBypass: process.env.ALLOW_AUTH_BYPASS === 'true',
    jwtSecret: process.env.AUTH_JWT_SECRET ?? '',
    secretToken: process.env.BACKEND_ACCESS_TOKEN ?? '',
  },
  backend: {
    url: process.env.BACKEND_URL,
  },
  features: {
    hidden: process.env.HIDDEN_FEATURES,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
