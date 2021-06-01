import { CourtClientServiceOptions } from '@island.is/judicial-system/court-client'

export default {
  production: true,
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.AUTH_AUDIENCE,
    allowAuthBypass: process.env.ALLOW_AUTH_BYPASS === 'true',
    jwtSecret: process.env.AUTH_JWT_SECRET,
    secretToken: process.env.SECRET_TOKEN,
  },
  auditTrail: {
    useGenericLogger: process.env.AUDIT_TRAIL_USE_GENERIC_LOGGER === 'true',
    groupName: process.env.AUDIT_TRAIL_GROUP_NAME,
    serviceName: 'judicial-system-api',
    region: process.env.AUDIT_TRAIL_REGION,
  },
  xRoad: {
    basePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV,
    clientId: process.env.XROAD_CLIENT_ID,
    clientCert: process.env.XROAD_CLIENT_CERT,
    clientKey: process.env.XROAD_CLIENT_KEY,
    clientCa: process.env.XROAD_CLIENT_PEM,
  },
  courtClientOptions: {
    apiPath: process.env.XROAD_COURT_API_PATH,
    memberCode: process.env.XROAD_COURT_MEMBER_CODE,
    serviceOptions:
      (JSON.parse(process.env.COURTS_CREDENTIALS || '{}') as CourtClientServiceOptions,
  },
  backend: {
    url: process.env.BACKEND_URL,
  },
  features: {
    hidden: process.env.HIDDEN_FEATURES,
  },
}
