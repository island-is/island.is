declare const process: {
  env: {
    [key: string]: string
  }
}

const isProductionEnvironment = process.env.NODE_ENV === 'production'

const devConfig = {
  production: isProductionEnvironment,
  nationalRegistry: {
    baseSoapUrl: 'https://localhost:8443',
    user: process.env.SOFFIA_USER ?? '',
    password: process.env.SOFFIA_PASS ?? '',
    host: 'soffiaprufa.skra.is',
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: ['@island.is', '@admin.island.is'],
  },
  apiMock: process.env.API_MOCKS === 'true',
  audit: {
    defaultNamespace: '@island.is/services-endorsements-api',
  },
  email: {
    sender: 'devland.is',
    address: 'development@island.is',
  },
  emailOptions: {
    useTestAccount: false,
    useNodemailerApp: process.env.USE_NODEMAILER_APP === 'true' ?? false,
    options: {
      region: 'eu-west-1',
    },
  },
}

const prodConfig = {
  production: isProductionEnvironment,
  nationalRegistry: {
    baseSoapUrl: process.env.SOFFIA_SOAP_URL ?? '',
    user: process.env.SOFFIA_USER ?? '',
    password: process.env.SOFFIA_PASS ?? '',
    host: process.env.SOFFIA_HOST_URL ?? '',
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: ['@island.is', '@admin.island.is'],
  },
  apiMock: false,
  audit: {
    groupName: process.env.AUDIT_GROUP_NAME, // used in cloudwatch
    serviceName: 'services-endorsements-api', // used in cloudwatch
    defaultNamespace: '@island.is/services-endorsements-api',
  },
  email: {
    sender: process.env.EMAIL_FROM_NAME ?? '',
    address: process.env.EMAIL_FROM_ADDRESS ?? '',
  },
  emailOptions: {
    useTestAccount: false,
    useNodemailerApp: false,
    options: {
      region: 'eu-west-1',
    },
  },
}

export default isProductionEnvironment ? prodConfig : devConfig

// global settings for endorsementsystem
export const ENDORSEMENT_SYSTEM_GENERAL_PETITION_TAGS = ['generalPetition']
