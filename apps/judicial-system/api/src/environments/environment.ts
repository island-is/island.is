export default {
  production: false,
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=judicial-system.local',
    audience: 'localhost:4200',
    jwtSecret: 'securesecret',
  },
  backendUrl: 'http://localhost:3344',
}
