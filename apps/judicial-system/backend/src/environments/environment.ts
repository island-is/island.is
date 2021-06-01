const devConfig = {
  production: false,
  auth: {
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-token',
  },
  notifications: {
    courtMobileNumbers: process.env.COURT_MOBILE_NUMBERS,
    prisonEmail: process.env.PRISON_EMAIL,
    prisonAdminEmail: process.env.PRISON_ADMIN_EMAIL,
  },
  email: {
    fromEmail: 'ben10@omnitrix.is',
    fromName: 'Guðjón Guðjónsson',
    replyToEmail: 'ben10@omnitrix.is',
    replyToName: 'Guðjón Guðjónsson',
  },
  smsOptions: {
    url: 'https://smsapi.devnova.is',
    username: 'IslandIs_User_Development',
    password: process.env.NOVA_PASSWORD,
  },
  signingOptions: {
    url: 'https://developers.dokobit.com',
    accessToken: process.env.DOKOBIT_ACCESS_TOKEN,
  },
  emailOptions: {
    useTestAccount: true,
  },
  admin: {
    users:
      '[{"id":"8f8f6522-95c8-46dd-98ef-cbc198544871","nationalId":"3333333333","name":"Addi Admin"},{"id":"66430be4-a662-442b-bf97-1858a64ab685","nationalId":"4444444444","name":"Solla Sýsla"}]',
  },
  files: {
    region: 'eu-west-1',
    bucket: 'island-is-dev-upload-judicial-system',
    timeToLivePost: '15',
    timeToLiveGet: '5',
  },
  xRoad: {
    basePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV || '',
    clientId: process.env.XROAD_CLIENT_ID || '',
    clientCert: process.env.XROAD_CLIENT_CERT || '',
    clientKey: process.env.XROAD_CLIENT_KEY || '',
    clientCa: process.env.XROAD_CLIENT_PEM || '',
  },
  courtService: {
    apiPath: process.env.XROAD_COURT_API_PATH || '',
    memberCode: process.env.XROAD_COURT_MEMBER_CODE || '',
    username: process.env.COURT_USERNAME || '',
    password: process.env.COURT_PASSWORD || '',
  },
}

const prodConfig = {
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

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
