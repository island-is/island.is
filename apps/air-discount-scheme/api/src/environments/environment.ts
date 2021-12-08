if (process.env.NODE_ENV === 'production') {
  if (!process.env.BACKEND_URL) {
    throw new Error('Missing BACKEND_URL environment.')
  }
}

const devConfig = {
  production: false,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  accessGroups: {
    developers: process.env.DEVELOPERS,
    admins: process.env.ADMINS,
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL ?? 'https://identity-server.dev01.devland.is',
    identityServerAuth: {
      issuer: 'https://identity-server.dev01.devland.is',
      audience: '@vegagerdin.is',
    },
    domain: process.env.IDENTITY_SERVER_DOMAIN ?? '@vegagerdin.is',
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL ?? 'http://localhost:4200',
    samlEntryPoint: 'https://innskraning.island.is/?id=ads.local',
    audience: '@vegagerdin.is',
    jwtSecret: 'securesecret',
  },
  backendUrl: 'http://localhost:4248',
}

const prodConfig = {
  production: true,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  accessGroups: {
    developers: process.env.DEVELOPERS,
    admins: process.env.ADMINS,
  },
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.AUTH_AUDIENCE,
    jwtSecret: process.env.AUTH_JWT_SECRET,
    identityServerAuth: {
      issuer: 'https://identity-server.dev01.devland.is',
      audience: '@vegagerdin.is',
    },
  },
  backendUrl: process.env.BACKEND_URL,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
