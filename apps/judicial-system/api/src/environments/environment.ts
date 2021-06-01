import { CourtClientServiceOptions } from '@island.is/judicial-system/court-client'

export default {
  production: false,
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=judicial-system.local',
    audience: 'localhost:4200',
    allowAuthBypass: true,
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-token',
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
  courtClientOptions: {
    apiPath: process.env.XROAD_COURT_API_PATH || '',
    memberCode: process.env.XROAD_COURT_MEMBER_CODE || '',
    serviceOptions: JSON.parse(
      process.env.COURTS_CREDENTIALS || '{}',
    ) as CourtClientServiceOptions,
  },
  backend: {
    url: 'http://localhost:3344',
  },
  features: {
    hidden: '',
  },
}
