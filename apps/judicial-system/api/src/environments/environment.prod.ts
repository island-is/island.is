export default {
  production: true,
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.AUTH_AUDIENCE,
    jwtSecret: process.env.AUTH_JWT_SECRET,
    allowAuthBypass: process.env.ALLOW_AUTH_BYPASS === 'true',
  },
  auditTrail: {
    useGenericLogger: process.env.AUDIT_TRAIL_USE_GENERIC_LOGGER === 'true',
    groupName: process.env.AUDIT_TRAIL_GROUP_NAME,
    streamName: `${process.env.AUDIT_TRAIL_GROUP_NAME}-${process.env.POD_NAME}`,
    region: process.env.AUDIT_TRAIL_REGION,
  },
  backendUrl: process.env.BACKEND_URL,
}
