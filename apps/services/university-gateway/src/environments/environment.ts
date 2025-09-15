const devConfig = {
  production: false,
  port: 3380,
  auth: {
    audience: '@island.is',
    issuer: 'https://identity-server.dev01.devland.is',
  },
  events: {
    url: process.env.EVENT_URL,
    errorUrl: process.env.ERROR_EVENT_URL,
  },
}

const prodConfig = {
  production: true,
  port: 3380,
  auth: {
    audience: '@island.is',
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL ?? '',
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
