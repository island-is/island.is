const devConfig = {
  production: false,
  auth: {
    secretToken: 'secret-backend-api-token',
  },
  auditTrail: {
    useGenericLogger: true,
  },
  backend: {
    url: 'http://localhost:3344',
  },
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.BACKEND_ACCESS_TOKEN) {
    throw new Error('Missing BACKEND_ACCESS_TOKEN environment.')
  }
  if (!process.env.AUDIT_TRAIL_GROUP_NAME) {
    throw new Error('Missing AUDIT_TRAIL_GROUP_NAME environment.')
  }
  if (!process.env.AUDIT_TRAIL_REGION) {
    throw new Error('Missing AUDIT_TRAIL_REGION environment.')
  }
  if (!process.env.BACKEND_URL) {
    throw new Error('Missing BACKEND_URL environment.')
  }
}

const prodConfig = {
  production: true,
  auth: {
    secretToken: process.env.BACKEND_ACCESS_TOKEN,
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

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
