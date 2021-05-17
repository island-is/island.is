export default {
  production: true,
  auth: {
    jwtSecret: process.env.AUTH_JWT_SECRET,
    secretToken: process.env.SECRET_TOKEN,
  },
  notifications: {
    courtMobileNumbers: process.env.COURT_MOBILE_NUMBERS,
    prisonEmail: process.env.PRISON_EMAIL,
    prisonAdminEmail: process.env.PRISON_ADMIN_EMAIL,
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
  courtService: {
    apiPath: process.env.XROAD_COURT_API_PATH,
    memberCode: process.env.XROAD_COURT_MEMBER_CODE,
    username: process.env.COURT_USERNAME,
    password: process.env.COURT_PASSWORD,
  },
}
