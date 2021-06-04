const devConfig = {
  metadataProviser: {
    nationalRegistry: {
      baseSoapUrl: 'https://localhost:8443',
      user: process.env.SOFFIA_USER ?? '',
      password: process.env.SOFFIA_PASS ?? '',
      host: 'soffiaprufa.skra.is',
    },
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '',
  },
  swagger: {
    authUrl: 'https://identity-server.dev01.devland.is/connect/authorize',
    tokenUrl: 'https://identity-server.dev01.devland.is/connect/token',
  },
  apiMock: process.env.API_MOCKS === 'true',
  audit: {
    defaultNamespace: '@island.is/services-endorsements-api',
  },
}

const prodConfig = {
  metadataProviser: {
    nationalRegistry: {
      baseSoapUrl: process.env.SOFFIA_SOAP_URL,
      user: process.env.SOFFIA_USER,
      password: process.env.SOFFIA_PASS,
      host: process.env.SOFFIA_HOST_URL,
    },
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '',
  },
  swagger: {
    authUrl: '',
    tokenUrl: '',
  },
  apiMock: false,
  audit: {
    groupName: process.env.AUDIT_GROUP_NAME, // used in cloudwatch
    serviceName: 'services-endorsements-api', // used in cloudwatch
    defaultNamespace: '@island.is/services-endorsements-api',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
