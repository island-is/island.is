declare const process: {
  env: {
    [key: string]: string
  }
}

const isProductionEnvironment = process.env.NODE_ENV === 'production'

const devConfig = {
  production: isProductionEnvironment,
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
  exportsBucketName: 'island-is-dev-exports-endorsement-system',
}

const prodConfig = {
  production: isProductionEnvironment,
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
  exportsBucketName: process.env.ENDORSEMENT_SYSTEM_EXPORTS_BUCKET_NAME,
}

export default isProductionEnvironment ? prodConfig : devConfig

// global settings for endorsementsystem
export const ENDORSEMENT_SYSTEM_GENERAL_PETITION_TAGS = ['generalPetition']
