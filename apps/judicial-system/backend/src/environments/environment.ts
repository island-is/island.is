import { CourtClientServiceOptions } from '@island.is/judicial-system/court-client'

export default {
  production: false,
  auth: {
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-token',
  },
  notifications: {
    prisonEmail: process.env.PRISON_EMAIL,
    prisonAdminEmail: process.env.PRISON_ADMIN_EMAIL,
    courtsMobileNumbers: JSON.parse(
      process.env.COURTS_MOBILE_NUMBERS || '{}',
    ) as {
      [key: string]: string
    },
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
  courtClientOptions: {
    apiPath: process.env.XROAD_COURT_API_PATH || '',
    memberCode: process.env.XROAD_COURT_MEMBER_CODE || '',
    serviceOptions: JSON.parse(
      process.env.COURTS_CREDENTIALS || '{}',
    ) as CourtClientServiceOptions,
  },
}
