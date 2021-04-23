export const environment = {
  production: true,
  auth: {
    secretToken: process.env.SECRET_TOKEN,
  },
  auditTrail: {
    useGenericLogger: process.env.AUDIT_TRAIL_USE_GENERIC_LOGGER === 'true',
    groupName: process.env.AUDIT_TRAIL_GROUP_NAME,
    serviceName: 'judicial-system-xrd-api',
    region: process.env.AUDIT_TRAIL_REGION,
  },
  backend: {
    url: process.env.BACKEND_URL,
  },
}
