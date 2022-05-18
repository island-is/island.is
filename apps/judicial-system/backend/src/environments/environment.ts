const devConfig = {
  production: false,
  auth: {
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-backend-api-token',
  },
  notifications: {
    prisonEmail: process.env.PRISON_EMAIL,
    prisonAdminEmail: process.env.PRISON_ADMIN_EMAIL ?? '',
    courtsMobileNumbers: JSON.parse(
      process.env.COURTS_MOBILE_NUMBERS ?? '{}',
    ) as {
      [key: string]: string
    },
  },
  email: {
    fromEmail: 'ben10@omnitrix.is',
    fromName: 'Réttarvörslugátt',
    replyToEmail: 'ben10@omnitrix.is',
    replyToName: 'Réttarvörslugátt',
  },
  smsOptions: {
    url: 'https://smsapi.devnova.is',
    username: 'IslandIs_User_Development',
    password: process.env.NOVA_PASSWORD ?? '',
  },
  signingOptions: {
    url: 'https://developers.dokobit.com',
    accessToken: process.env.DOKOBIT_ACCESS_TOKEN ?? '',
  },
  emailOptions: {
    useTestAccount: (process.env.EMAIL_USE_TEST_ACCOUNT ?? 'true') === 'true',
    options: {
      region: process.env.EMAIL_REGION ?? '',
    },
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
    basePathWithEnv: process.env.XROAD_TLS_BASE_PATH_WITH_ENV ?? '',
    clientId: process.env.XROAD_CLIENT_ID ?? '',
    clientCert: process.env.XROAD_CLIENT_CERT ?? '',
    clientKey: process.env.XROAD_CLIENT_KEY ?? '',
    clientCa: process.env.XROAD_CLIENT_PEM ?? '',
  },
  policeServiceOptions: {
    apiPath: process.env.XROAD_POLICE_API_PATH ?? '',
    memberCode: process.env.XROAD_POLICE_MEMBER_CODE ?? '',
  },
  events: {
    url: process.env.EVENT_URL,
    errorUrl: process.env.ERROR_EVENT_URL,
  },
  deepLinks: {
    completedCaseOverviewUrl: 'http://localhost:4200/krafa/yfirlit/',
    prosecutorRestrictionCaseOverviewUrl:
      'http://localhost:4200/krafa/stadfesta/',
    prosecutorInvestigationCaseOverviewUrl:
      'http://localhost:4200/krafa/rannsoknarheimild/stadfesta/',
    defenderCompletedCaseOverviewUrl: 'http://localhost:4200/verjandi/',
  },
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.AUTH_JWT_SECRET) {
    throw new Error('Missing AUTH_JWT_SECRET environment.')
  }
  if (!process.env.BACKEND_ACCESS_TOKEN) {
    throw new Error('Missing BACKEND_ACCESS_TOKEN environment.')
  }
  if (!process.env.COURTS_MOBILE_NUMBERS) {
    throw new Error('Missing COURTS_MOBILE_NUMBERS environment.')
  }
  if (!process.env.PRISON_EMAIL) {
    throw new Error('Missing PRISON_EMAIL environment.')
  }
  if (!process.env.PRISON_ADMIN_EMAIL) {
    throw new Error('Missing PRISON_ADMIN_EMAIL environment.')
  }
  if (!process.env.EMAIL_FROM) {
    throw new Error('Missing EMAIL_FROM environment.')
  }
  if (!process.env.EMAIL_FROM_NAME) {
    throw new Error('Missing EMAIL_FROM_NAME environment.')
  }
  if (!process.env.EMAIL_REPLY_TO) {
    throw new Error('Missing EMAIL_REPLY_TO environment.')
  }
  if (!process.env.EMAIL_REPLY_TO_NAME) {
    throw new Error('Missing EMAIL_REPLY_TO_NAME environment.')
  }
  if (!process.env.NOVA_URL) {
    throw new Error('Missing NOVA_URL environment.')
  }
  if (!process.env.NOVA_USERNAME) {
    throw new Error('Missing NOVA_USERNAME environment.')
  }
  if (!process.env.NOVA_PASSWORD) {
    throw new Error('Missing NOVA_PASSWORD environment.')
  }
  if (!process.env.DOKOBIT_URL) {
    throw new Error('Missing DOKOBIT_URL environment.')
  }
  if (!process.env.DOKOBIT_ACCESS_TOKEN) {
    throw new Error('Missing DOKOBIT_ACCESS_TOKEN environment.')
  }
  if (!process.env.EMAIL_REGION) {
    throw new Error('Missing EMAIL_REGION environment.')
  }
  if (!process.env.ADMIN_USERS) {
    throw new Error('Missing ADMIN_USERS environment.')
  }
  if (!process.env.S3_REGION) {
    throw new Error('Missing S3_REGION environment.')
  }
  if (!process.env.S3_BUCKET) {
    throw new Error('Missing S3_BUCKET environment.')
  }
  if (!process.env.S3_TIME_TO_LIVE_POST) {
    throw new Error('Missing S3_TIME_TO_LIVE_POST environment.')
  }
  if (!process.env.S3_TIME_TO_LIVE_GET) {
    throw new Error('Missing S3_TIME_TO_LIVE_GET environment.')
  }
  if (!process.env.XROAD_TLS_BASE_PATH_WITH_ENV) {
    throw new Error('Missing XROAD_TLS_BASE_PATH_WITH_ENV environment.')
  }
  if (!process.env.XROAD_CLIENT_ID) {
    throw new Error('Missing XROAD_CLIENT_ID environment.')
  }
  if (!process.env.XROAD_CLIENT_CERT) {
    throw new Error('Missing XROAD_CLIENT_CERT environment.')
  }
  if (!process.env.XROAD_CLIENT_KEY) {
    throw new Error('Missing XROAD_CLIENT_KEY environment.')
  }
  if (!process.env.XROAD_CLIENT_PEM) {
    throw new Error('Missing XROAD_CLIENT_PEM environment.')
  }
  if (!process.env.XROAD_POLICE_API_PATH) {
    throw new Error('Missing XROAD_POLICE_API_PATH environment.')
  }
  if (!process.env.XROAD_POLICE_MEMBER_CODE) {
    throw new Error('Missing XROAD_POLICE_MEMBER_CODE environment.')
  }
  if (!process.env.COMPLETED_CASE_OVERVIEW_URL) {
    throw new Error('Missing COMPLETED_CASE_OVERVIEW_URL environment.')
  }
  if (!process.env.PROSECUTOR_RESTRICTION_CASE_OVERVIEW_URL) {
    throw new Error(
      'Missing PROSECUTOR_RESTRICTION_CASE_OVERVIEW_URL environment.',
    )
  }
  if (!process.env.PROSECUTOR_INVESTIGATION_CASE_OVERVIEW_URL) {
    throw new Error(
      'Missing PROSECUTOR_INVESTIGATION_CASE_OVERVIEW_URL environment.',
    )
  }
}

const prodConfig = {
  production: true,
  auth: {
    jwtSecret: process.env.AUTH_JWT_SECRET ?? '',
    secretToken: process.env.BACKEND_ACCESS_TOKEN ?? '',
  },
  notifications: {
    courtsMobileNumbers: JSON.parse(
      process.env.COURTS_MOBILE_NUMBERS ?? '{}',
    ) as {
      [key: string]: string
    },
    prisonEmail: process.env.PRISON_EMAIL,
    prisonAdminEmail: process.env.PRISON_ADMIN_EMAIL ?? '',
  },
  email: {
    fromEmail: process.env.EMAIL_FROM ?? '',
    fromName: process.env.EMAIL_FROM_NAME ?? '',
    replyToEmail: process.env.EMAIL_REPLY_TO ?? '',
    replyToName: process.env.EMAIL_REPLY_TO_NAME ?? '',
  },
  smsOptions: {
    url: process.env.NOVA_URL ?? '',
    username: process.env.NOVA_USERNAME ?? '',
    password: process.env.NOVA_PASSWORD ?? '',
  },
  signingOptions: {
    url: process.env.DOKOBIT_URL ?? '',
    accessToken: process.env.DOKOBIT_ACCESS_TOKEN ?? '',
  },
  emailOptions: {
    useTestAccount: false,
    options: {
      region: process.env.EMAIL_REGION ?? '',
    },
  },
  admin: {
    users: process.env.ADMIN_USERS ?? '',
  },
  files: {
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET ?? '',
    timeToLivePost: process.env.S3_TIME_TO_LIVE_POST ?? '',
    timeToLiveGet: process.env.S3_TIME_TO_LIVE_GET ?? '',
  },
  xRoad: {
    basePathWithEnv: process.env.XROAD_TLS_BASE_PATH_WITH_ENV ?? '',
    clientId: process.env.XROAD_CLIENT_ID ?? '',
    clientCert: process.env.XROAD_CLIENT_CERT ?? '',
    clientKey: process.env.XROAD_CLIENT_KEY ?? '',
    clientCa: process.env.XROAD_CLIENT_PEM ?? '',
  },
  policeServiceOptions: {
    apiPath: process.env.XROAD_POLICE_API_PATH ?? '',
    memberCode: process.env.XROAD_POLICE_MEMBER_CODE ?? '',
  },
  events: {
    url: process.env.EVENT_URL,
    errorUrl: process.env.ERROR_EVENT_URL,
  },
  deepLinks: {
    completedCaseOverviewUrl: process.env.COMPLETED_CASE_OVERVIEW_URL,
    prosecutorRestrictionCaseOverviewUrl:
      process.env.PROSECUTOR_RESTRICTION_CASE_OVERVIEW_URL,
    prosecutorInvestigationCaseOverviewUrl:
      process.env.PROSECUTOR_INVESTIGATION_CASE_OVERVIEW_URL,
    defenderCompletedCaseOverviewUrl:
      process.env.DEFENDER_COMPLETED_CASE_OVERVIEW_URL,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
