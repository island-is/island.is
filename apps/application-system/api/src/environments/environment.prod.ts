export default {
  production: true,
  environment: process.env.ENVIRONMENT,
  baseApiUrl: process.env.GRAPHQL_API_URL,
  clientLocationOrigin: process.env.CLIENT_LOCATION_ORIGIN,
  identityServer: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '',
    jwksUri: process.env.IDENTITY_SERVER_JWKS_URI,
  },
  redis: {
    urls: [process.env.REDIS_URL_NODE_01],
  },
  emailOptions: {
    useTestAccount: false,
    options: {
      region: process.env.EMAIL_REGION,
    },
  },
  auth: {
    jwtSecret: process.env.AUTH_JWT_SECRET,
  },
  fsS3Bucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
  signingOptions: {
    url: process.env.DOKOBIT_URL,
    accessToken: process.env.DOKOBIT_ACCESS_TOKEN,
  },
}
