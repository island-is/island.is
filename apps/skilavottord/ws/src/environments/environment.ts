export default {
  production: false,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=sv_citizen.local',
    audience: 'localhost:4200',
    jwtSecret: 'securesecret',
  },
  backendUrl: 'http://localhost:4248',
}
