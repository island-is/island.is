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
    samlEntryPoint: 'https://innskraning.island.is/?id=ads.local',
    audience: 'localhost:4200',
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
  },
  backendUrl: process.env.BACKEND_URL,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
