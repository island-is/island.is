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
  audit: {
    defaultNamespace: '@island.is/university-gateway',
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
  audit: {
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-university-gateway',
    defaultNamespace: '@island.is/university-gateway',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
