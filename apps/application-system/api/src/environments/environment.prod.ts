import { Environment } from './environment.interface'

const baseApiUrl = process.env.GRAPHQL_API_URL

export default {
  production: true,
  environment: process.env.ENVIRONMENT,
  name: process.env.name,
  baseApiUrl,
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
    jwksUri: process.env.IDENTITY_SERVER_JWKS_URI,
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
    baseApiUrl,
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
