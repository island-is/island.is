const isProductionEnvironment = process.env.NODE_ENV === 'production'
const devConfig = {
  production: isProductionEnvironment,
  metadataProvider: {
    nationalRegistry: {
      baseSoapUrl: 'https://localhost:8443',
      user: process.env.SOFFIA_USER ?? '',
      password: process.env.SOFFIA_PASS ?? '',
      host: 'soffiaprufa.skra.is',
    },
    temporaryVoterRegistry: {
      baseApiUrl: 'http://localhost:4248',
    },
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@island.is',
  },
  apiMock: process.env.API_MOCKS === 'true',
  audit: {
    defaultNamespace: '@island.is/services-endorsements-api',
  },
  accessGroups: {
    DMR: process.env.ACCESS_GROUP_DMR ?? '',
    Admin: process.env.ACCESS_GROUP_ADMIN ?? '',
  },
}

const prodConfig = {
  production: isProductionEnvironment,
  metadataProvider: {
    nationalRegistry: {
      baseSoapUrl: process.env.SOFFIA_SOAP_URL,
      user: process.env.SOFFIA_USER,
      password: process.env.SOFFIA_PASS,
      host: process.env.SOFFIA_HOST_URL,
    },
    temporaryVoterRegistry: {
      baseApiUrl: process.env.TEMPORARY_VOTER_REGISTRY_API_URL,
    },
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '@island.is',
  },
  apiMock: false,
  audit: {
    groupName: process.env.AUDIT_GROUP_NAME, // used in cloudwatch
    serviceName: 'services-endorsements-api', // used in cloudwatch
    defaultNamespace: '@island.is/services-endorsements-api',
  },
  accessGroups: {
    DMR: process.env.ACCESS_GROUP_DMR ?? '',
    Admin: process.env.ACCESS_GROUP_ADMIN ?? '',
  },
}

export default isProductionEnvironment ? prodConfig : devConfig
