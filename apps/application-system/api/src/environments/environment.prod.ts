import { Environment } from './environment.interface'

const baseApiUrl = process.env.GRAPHQL_API_URL

export default {
  production: true,
  environment: process.env.ENVIRONMENT,
  baseApiUrl,
  redis: {
    urls: [process.env.REDIS_URL_NODE_01],
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '',
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
    jwtSecret: process.env.AUTH_JWT_SECRET,
    xRoadBasePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV ?? '',
    baseApiUrl,
  },
  application: {
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
  },
  fileStorage: {
    uploadBucket: process.env.FILE_STORAGE_UPLOAD_BUCKET,
  },
} as Environment
