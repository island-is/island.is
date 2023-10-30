const devConfig = {
  production: false,
  port: 3380,
  auth: {
    audience: ['@island.is'],
    issuer: 'https://identity-server.dev01.devland.is',
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-backend-api-token',
  },
  events: {
    url: process.env.EVENT_URL,
    errorUrl: process.env.ERROR_EVENT_URL,
  },
  audit: {
    defaultNamespace: '@island.is/university-gateway-backend',
  },
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.AUTH_JWT_SECRET) {
    throw new Error('Missing AUTH_JWT_SECRET environment.')
  }
  if (!process.env.BACKEND_ACCESS_TOKEN) {
    throw new Error('Missing BACKEND_ACCESS_TOKEN environment.')
  }
}

const prodConfig = {
  production: true,
  port: 3380,
  auth: {
    audience: process.env.AUTH_AUDIENCE,
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    jwtSecret: process.env.AUTH_JWT_SECRET ?? '',
    secretToken: process.env.BACKEND_ACCESS_TOKEN ?? '',
  },
  admin: {
    users: process.env.ADMIN_USERS ?? '',
  },
  events: {
    url: process.env.EVENT_URL,
    errorUrl: process.env.ERROR_EVENT_URL,
  },
  audit: {
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-university-gateway-backend',
    defaultNamespace: '@island.is/university-gateway-backend',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
