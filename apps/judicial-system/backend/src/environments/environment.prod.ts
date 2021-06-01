import { CourtClientServiceOptions } from '@island.is/judicial-system/court-client'

export default {
  production: true,
  auth: {
    jwtSecret: process.env.AUTH_JWT_SECRET,
    secretToken: process.env.SECRET_TOKEN,
  },
  notifications: {
    prisonEmail: process.env.PRISON_EMAIL,
    prisonAdminEmail: process.env.PRISON_ADMIN_EMAIL,
    courtsMobileNumbers: JSON.parse(process.env.COURTS_MOBILE_NUMBERS) as {
      [key: string]: string
    },
  },
  email: {
    fromEmail: process.env.EMAIL_FROM,
    fromName: process.env.EMAIL_FROM_NAME,
    replyToEmail: process.env.EMAIL_REPLY_TO,
    replyToName: process.env.EMAIL_REPLY_TO_NAME,
  },
  smsOptions: {
    url: process.env.NOVA_URL,
    username: process.env.NOVA_USERNAME,
    password: process.env.NOVA_PASSWORD,
  },
  signingOptions: {
    url: process.env.DOKOBIT_URL,
    accessToken: process.env.DOKOBIT_ACCESS_TOKEN,
  },
  emailOptions: {
    useTestAccount: false,
    options: {
      region: process.env.EMAIL_REGION,
    },
  },
  admin: {
    users: process.env.ADMIN_USERS,
  },
  files: {
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET,
    timeToLivePost: process.env.S3_TIME_TO_LIVE_POST,
    timeToLiveGet: process.env.S3_TIME_TO_LIVE_GET,
  },
  xRoad: {
    basePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV,
    clientId: process.env.XROAD_CLIENT_ID,
    clientCert: process.env.XROAD_CLIENT_CERT,
    clientKey: process.env.XROAD_CLIENT_KEY,
    clientCa: process.env.XROAD_CLIENT_PEM,
  },
  courtClientOptions: {
    apiPath: process.env.XROAD_COURT_API_PATH,
    memberCode: process.env.XROAD_COURT_MEMBER_CODE,
    serviceOptions: JSON.parse(
      process.env.COURTS_CREDENTIALS,
    ) as CourtClientServiceOptions,
  },
}
