import { Environment } from './environment.interface'

const baseApiUrl = 'http://localhost:4444'

export default {
  production: false,
  environment: 'local',
  name: 'local',
  baseApiUrl,
  redis: {
    urls: [
      'localhost:7000',
      'localhost:7001',
      'localhost:7002',
      'localhost:7003',
      'localhost:7004',
      'localhost:7005',
    ],
  },
  audit: {
    defaultNamespace: '@island.is/applications',
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@island.is',
    jwksUri:
      'https://identity-server.dev01.devland.is/.well-known/openid-configuration/jwks',
  },
  templateApi: {
    clientLocationOrigin: 'http://localhost:4242',
    emailOptions: {
      useTestAccount: true,
    },
    email: {
      sender: 'Devland.is',
      address: 'development@island.is',
    },
    jwtSecret: 'supersecret',
    xRoadBasePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV ?? '',
    baseApiUrl,
    syslumenn: {
      url: 'https://api.syslumenn.is/dev',
      username: process.env.SYSLUMENN_USERNAME,
      password: process.env.SYSLUMENN_PASSWORD,
    },
    smsOptions: {
      url: 'https://smsapi.devnova.is',
      username: 'IslandIs_User_Development',
      password: process.env.NOVA_PASSWORD,
    },
    drivingLicense: {
      secret: process.env.DRIVING_LICENSE_SECRET,
      xroadClientId: 'IS-DEV/GOV/10000/island-is-client',
      xroadBaseUrl: 'http://localhost:8081',
    },
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
  },
  application: {
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
  },
  fileStorage: {
    uploadBucket: process.env.FILE_STORAGE_UPLOAD_BUCKET,
  },
  signingOptions: {
    url: 'https://developers.dokobit.com',
    accessToken: process.env.DOKOBIT_ACCESS_TOKEN,
  },
  contentful: {
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  },
} as Environment
