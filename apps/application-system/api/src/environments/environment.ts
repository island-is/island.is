import { Environment } from './environment.interface'

const devConfig = {
  production: false,
  environment: 'local',
  name: 'local',
  baseApiUrl: 'http://localhost:4444',
  audit: {
    defaultNamespace: '@island.is/applications',
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: ['@island.is', '@admin.island.is'],
    allowClientNationalId: true,
  },
  templateApi: {
    clientLocationOrigin: `http://localhost:${
      process.env.WEB_FRONTEND_PORT ?? '4242'
    }/umsoknir`,
    email: {
      sender: 'Devland.is',
      address: 'development@island.is',
    },
    jwtSecret: 'supersecret',
    xRoadBasePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV ?? '',
    baseApiUrl: 'http://localhost:4444',
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    generalPetition: {
      endorsementsApiBasePath: 'http://localhost:4246',
    },
    userProfile: {
      serviceBasePath: 'http://localhost:3366',
    },
  },
  contentful: {
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  },
} as Environment

const prodConfig = {
  production: true,
  environment: process.env.ENVIRONMENT,
  name: process.env.name,
  baseApiUrl: process.env.GRAPHQL_API_URL,
  audit: {
    defaultNamespace: '@island.is/applications',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'application-system-api',
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: ['@island.is', '@admin.island.is'],
    allowClientNationalId: true,
  },
  templateApi: {
    clientLocationOrigin: process.env.CLIENT_LOCATION_ORIGIN,
    email: {
      sender: process.env.EMAIL_FROM_NAME,
      address: process.env.EMAIL_FROM,
    },
    jwtSecret: process.env.AUTH_JWT_SECRET,
    xRoadBasePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV ?? '',
    baseApiUrl: process.env.GRAPHQL_API_URL,
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    generalPetition: {
      endorsementsApiBasePath: process.env.ENDORSEMENTS_API_BASE_PATH,
    },
    userProfile: {
      serviceBasePath: process.env.SERVICE_USER_PROFILE_URL,
    },
  },
  contentful: {
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  },
} as Environment

export default process.env.PROD_MODE === 'true' ||
process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig
