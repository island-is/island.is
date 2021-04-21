export default {
  production: false,
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=financial-aid.local',
    audience: 'localhost:4200',
    allowAuthBypass: true,
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-token',
  },
  backend: {
    url: 'http://localhost:3344',
  },
}
