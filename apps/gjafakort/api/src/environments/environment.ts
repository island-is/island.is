const TEN_MINUTES = 10 * 60

const devConfig = {
  production: false,
  sentry: {
    dsn: '',
  },
  accessGroups: {
    developers: process.env.DEVELOPERS,
    admins: process.env.ADMINS,
    testers: process.env.TESTERS,
  },
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=ferdagjof.local',
    audience: 'localhost:4200',
    jwtSecret: 'securesecret',
  },
  applicationUrl: 'http://localhost:4242',
  ferdalag: {
    url: 'https://island-dev-dot-itb-gagnagrunnur-dev.appspot.com',
    apiKey: process.env.FERDALAG_API_KEY,
    ttl: TEN_MINUTES,
  },
  rsk: {
    url: 'https://thjonusta-s.rsk.is/api',
    username: 'rf_api_island.is',
    password: process.env.RSK_API_PASSWORD,
    ttl: TEN_MINUTES,
  },
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
  yay: {
    url: 'https://dev-serviceapi.yay.is',
    apiKey: process.env.YAY_API_KEY,
    secretKey: process.env.YAY_SECRET_KEY,
  },
  nova: {
    url: 'https://smsapi.devnova.is',
    username: 'IslandIs_User_Development',
    password: process.env.NOVA_PASSWORD,
  },
  configCat: {
    sdkKey: process.env.CONFIGCAT_SDK_KEY,
  },
}

const prodConfig = {
  production: true,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  accessGroups: {
    developers: process.env.DEVELOPERS,
    admins: process.env.ADMINS,
    testers: process.env.TESTERS,
  },
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.AUTH_AUDIENCE,
    jwtSecret: process.env.AUTH_JWT_SECRET,
  },
  applicationUrl: process.env.APPLICATION_URL,
  ferdalag: {
    url: process.env.FERDALAG_URL,
    apiKey: process.env.FERDALAG_API_KEY,
    ttl: process.env.CACHE_TIME_TO_LIVE
      ? parseInt(process.env.CACHE_TIME_TO_LIVE, 10)
      : TEN_MINUTES,
  },
  rsk: {
    url: process.env.RSK_URL,
    username: process.env.RSK_USERNAME,
    password: process.env.RSK_API_PASSWORD,
    ttl: process.env.CACHE_TIME_TO_LIVE
      ? parseInt(process.env.CACHE_TIME_TO_LIVE, 10)
      : TEN_MINUTES,
  },
  redis: {
    urls: [process.env.REDIS_URL_NODE_01],
  },
  yay: {
    url: process.env.YAY_URL,
    apiKey: process.env.YAY_API_KEY,
    secretKey: process.env.YAY_SECRET_KEY,
  },
  nova: {
    url: process.env.NOVA_URL,
    username: process.env.NOVA_USERNAME,
    password: process.env.NOVA_PASSWORD,
  },
  configCat: {
    sdkKey: process.env.CONFIGCAT_SDK_KEY,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
