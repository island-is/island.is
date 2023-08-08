const devConfig = {
  production: false,
  auth: {
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-backend-api-token',
  },
  events: {
    url: process.env.EVENT_URL,
    errorUrl: process.env.ERROR_EVENT_URL,
  },
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.AUTH_JWT_SECRET) {
    throw new Error('Missing AUTH_JWT_SECRET environment.')
  }
  if (!process.env.BACKEND_ACCESS_TOKEN) {
    throw new Error('Missing BACKEND_ACCESS_TOKEN environment.')
  }
  if (!process.env.ADMIN_USERS) {
    throw new Error('Missing ADMIN_USERS environment.')
  }
  if (!process.env.S3_TIME_TO_LIVE_POST) {
    throw new Error('Missing S3_TIME_TO_LIVE_POST environment.')
  }
  if (!process.env.S3_TIME_TO_LIVE_GET) {
    throw new Error('Missing S3_TIME_TO_LIVE_GET environment.')
  }
}

const prodConfig = {
  production: true,
  auth: {
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
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
