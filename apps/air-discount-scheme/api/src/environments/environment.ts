export default {
  production: false,
  sentry: {
    dsn: '',
  },
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=ads.local',
    audience: 'localhost:4200',
    jwtSecret: 'securesecret',
  },
  backendUrl: 'http://localhost:4242',
}
