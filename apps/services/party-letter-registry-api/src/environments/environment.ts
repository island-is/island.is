const devConfig = {
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '',
  },
  swagger: {
    authUrl: 'https://identity-server.dev01.devland.is/connect/authorize',
    tokenUrl: 'https://identity-server.dev01.devland.is/connect/token',
  },
  audit: {
    defaultNamespace: '@island.is/services-party-letter-api',
  },
}

const prodConfig = {
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '',
  },
  swagger: {
    authUrl: '',
    tokenUrl: '',
  },
  audit: {
    groupName: process.env.AUDIT_GROUP_NAME, // used in cloudwatch
    serviceName: 'services-party-letter-api', // used in cloudwatch
    defaultNamespace: '@island.is/services-party-letter-api',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
