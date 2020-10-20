export default {
  production: false,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=sv_citizen.local',
    samlEntryPoint2: 'https://innskraning.island.is/?id=sv_company.local',
    audience: 'localhost:4200',
    audience2: 'localhost:4200',
    jwtSecret: 'securesecret',
    jwtSecret2: 'securesecret'
  },
  backendUrl: 'http://localhost:3333',
}
