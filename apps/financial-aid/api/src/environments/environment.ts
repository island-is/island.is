if (process.env.NODE_ENV === 'production') {
  if (!process.env.SAML_ENTRY_POINT) {
    throw new Error('Missing SAML_ENTRY_POINT environment.')
  }
  if (!process.env.AUTH_AUDIENCE) {
    throw new Error('Missing AUTH_AUDIENCE environment.')
  }
  if (!process.env.ALLOW_FAKE_USERS) {
    throw new Error('Missing ALLOW_FAKE_USERS environment.')
  }
  if (!process.env.AUTH_JWT_SECRET) {
    throw new Error('Missing AUTH_JWT_SECRET environment.')
  }
  if (!process.env.SECRET_TOKEN) {
    throw new Error('Missing SECRET_TOKEN environment.')
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
    allowFakeUsers: process.env.ALLOW_FAKE_USERS === 'true',
    jwtSecret: process.env.AUTH_JWT_SECRET!,
    secretToken: process.env.SECRET_TOKEN!,
  },
  backend: {
    url: process.env.BACKEND_URL,
  },
}

const devConfig = {
  production: false,
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=judicial-system.local',
    audience: 'localhost:4200',
    allowAuthBypass: true,
    allowFakeUsers: true,
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-token',
  },
  backend: {
    url: 'http://localhost:3344',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
