export default {
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
