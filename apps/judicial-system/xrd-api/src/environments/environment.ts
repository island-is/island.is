const devConfig = {
  production: false,
  auditTrail: {
    useGenericLogger: true,
  },
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.AUDIT_TRAIL_GROUP_NAME) {
    throw new Error('Missing AUDIT_TRAIL_GROUP_NAME environment.')
  }
  if (!process.env.AUDIT_TRAIL_REGION) {
    throw new Error('Missing AUDIT_TRAIL_REGION environment.')
  }
}

const prodConfig = {
  production: true,
  auditTrail: {
    useGenericLogger: process.env.AUDIT_TRAIL_USE_GENERIC_LOGGER === 'true',
    groupName: process.env.AUDIT_TRAIL_GROUP_NAME,
    serviceName: 'judicial-system-xrd-api',
    region: process.env.AUDIT_TRAIL_REGION,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
