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
    defaultNamespace: '@island.is/services-temporary-voter-registry-api',
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
    serviceName: 'services-temporary-voter-registry-api', // used in cloudwatch
    defaultNamespace: '@island.is/services-temporary-voter-registry-api',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
