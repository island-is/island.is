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
    basePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV || '',
    clientId: process.env.XROAD_CLIENT_ID || '',
    clientCert: process.env.XROAD_CLIENT_CERT || '',
    clientKey: process.env.XROAD_CLIENT_KEY || '',
    clientCa: process.env.XROAD_CLIENT_PEM || '',
  },
  courtService: {
    apiPath: process.env.XROAD_COURT_API_PATH || '',
    memberCode: process.env.XROAD_COURT_MEMBER_CODE || '',
    username: process.env.COURT_USERNAME || '',
    password: process.env.COURT_PASSWORD || '',
  },
  hiddenFeatures: '',
  backendUrl: 'http://localhost:3344',
}
