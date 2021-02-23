import { Environment } from './environment.interface'

export default {
  production: false,
  environment: 'local',
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
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: 'api_resource.scope', // TODO update scope when a new one has been created, uses same scope as graphql api atm
    jwksUri:
      'https://identity-server.dev01.devland.is/.well-known/openid-configuration/jwks',
  },
  templateApi: {
    clientLocationOrigin: 'http://localhost:4200',
    emailOptions: {
      useTestAccount: true,
    },
    jwtSecret: 'supersecret',
    xRoadBasePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV ?? '',
  },
  application: {
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
  },
  fileStorage: {
    uploadBucket: process.env.FILE_STORAGE_UPLOAD_BUCKET,
  },
} as Environment
