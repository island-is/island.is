const devConfig = {
  production: false,
  port: 3380,
  auth: {
    // jwtSecret: 'jwt-secret',
    // secretToken: 'secret-backend-api-token',
    audience: ['@island.is'],
    issuer: 'https://identity-server.dev01.devland.is',
  },
  events: {
    url: process.env.EVENT_URL,
    errorUrl: process.env.ERROR_EVENT_URL,
  },
}

//TODO Gunnar skoða, hvað er þetta
// if (process.env.NODE_ENV === 'production') {
//   if (!process.env.AUTH_JWT_SECRET) {
//     throw new Error('Missing AUTH_JWT_SECRET environment.')
//   }
//   if (!process.env.BACKEND_ACCESS_TOKEN) {
//     throw new Error('Missing BACKEND_ACCESS_TOKEN environment.')
//   }
//   if (!process.env.ADMIN_USERS) {
//     throw new Error('Missing ADMIN_USERS environment.')
//   }
//   if (!process.env.S3_TIME_TO_LIVE_POST) {
//     throw new Error('Missing S3_TIME_TO_LIVE_POST environment.')
//   }
//   if (!process.env.S3_TIME_TO_LIVE_GET) {
//     throw new Error('Missing S3_TIME_TO_LIVE_GET environment.')
//   }
// }

const prodConfig = {
  production: true,
  port: 3380,
  auth: {
    // jwtSecret: process.env.AUTH_JWT_SECRET ?? '',
    // secretToken: process.env.BACKEND_ACCESS_TOKEN ?? '',
    audience: process.env.AUTH_AUDIENCE,
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
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
