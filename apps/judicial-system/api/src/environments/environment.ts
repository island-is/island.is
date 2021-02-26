// Set for auth library environment in local development
process.env.AUTH_JWT_SECRET = 'securesecret'

export default {
  production: false,
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=judicial-system.local',
    audience: 'localhost:4200',
    allowAuthBypass: true,
  },
  auditTrail: {
    useGenericLogger: true,
  },
  xRoad: {
    basePathWithEnv: '',
    clientId: '',
  },
  courtService: {
    apiPath: '',
    memberCode: '',
    username: '',
    password: '',
  },
  backendUrl: 'http://localhost:3344',
}
