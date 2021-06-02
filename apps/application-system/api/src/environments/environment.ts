import { Environment } from './environment.interface'

const devConfig = {
  production: false,
  environment: 'local',
  name: 'local',
  baseApiUrl: 'http://localhost:4444',
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
    baseApiUrl: 'http://localhost:4444',
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
    paymentOptions: {
      url: 'aaaaa',
    },
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

const prodConfig = {
  production: true,
  environment: process.env.ENVIRONMENT,
  name: process.env.name,
  baseApiUrl: process.env.GRAPHQL_API_URL,
  redis: {
    urls: [process.env.REDIS_URL_NODE_01],
  },
  audit: {
    defaultNamespace: '@island.is/applications',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'application-system-api',
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '@island.is',
  },
  templateApi: {
    clientLocationOrigin: process.env.CLIENT_LOCATION_ORIGIN,
    emailOptions: {
      useTestAccount: false,
      options: {
        region: process.env.EMAIL_REGION,
      },
    },
    email: {
      sender: process.env.EMAIL_FROM_NAME,
      address: process.env.EMAIL_FROM,
    },
    jwtSecret: process.env.AUTH_JWT_SECRET,
    xRoadBasePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV ?? '',
    baseApiUrl: process.env.GRAPHQL_API_URL,
    syslumenn: {
      url: process.env.SYSLUMENN_HOST,
      username: process.env.SYSLUMENN_USERNAME,
      password: process.env.SYSLUMENN_PASSWORD,
    },
    smsOptions: {
      url: process.env.NOVA_URL,
      username: process.env.NOVA_USERNAME,
      password: process.env.NOVA_PASSWORD,
    },
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    drivingLicense: {
      secret: process.env.DRIVING_LICENSE_SECRET,
      xroadClientId: process.env.XROAD_CLIENT_ID,
      xroadBaseUrl: process.env.XROAD_BASE_PATH,
    },
    paymentOptions: {
      url: 'aaaaa',
    },
  },
  application: {
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
  },
  fileStorage: {
    uploadBucket: process.env.FILE_STORAGE_UPLOAD_BUCKET,
  },
  signingOptions: {
    url: process.env.DOKOBIT_URL,
    accessToken: process.env.DOKOBIT_ACCESS_TOKEN,
  },
  contentful: {
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  },
} as Environment

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
