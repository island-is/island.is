export default {
  production: true,
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.AUTH_AUDIENCE,
    allowAuthBypass: process.env.ALLOW_AUTH_BYPASS === 'true',
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
  },
  courtService: {
    apiPath: process.env.XROAD_COURT_API_PATH,
    memberCode: process.env.XROAD_COURT_MEMBER_CODE,
    username: process.env.COURT_USERNAME,
    password: process.env.COURT_PASSWORD,
  },
  backendUrl: process.env.BACKEND_URL,
}
