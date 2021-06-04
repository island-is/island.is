const devConfig = {
  production: false,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=sv_citizen.local',
    samlEntryPoint2: 'https://innskraning.island.is/?id=sv_company.local',
    audience: 'localhost:4200',
    jwtSecret: 'securesecret',
  },
  samgongustofa: {
    soapUrl:
      process.env.SAMGONGUSTOFA_SOAP_URL ??
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    soapUsername: process.env.SAMGONGUSTOFA_SOAP_USER ?? 'xxxxxxxxxxxx',
    soapPassword: process.env.SAMGONGUSTOFA_SOAP_PASS ?? 'xxxxxxxxx',
    restAuthUrl:
      process.env.SAMGONGUSTOFA_REST_AUTH_URL ??
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    restDeRegUrl:
      process.env.SAMGONGUSTOFA_REST_DEREG_URL ??
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    restUsername: process.env.SAMGONGUSTOFA_REST_USER ?? 'xxxxxxxxxxxxxxx',
    restPassword: process.env.SAMGONGUSTOFA_REST_PASS ?? 'xxxxxxxxxxxxxx',
    restReportingStation:
      process.env.SAMGONGUSTOFA_REST_REPORTING_STATION ?? '',
  },
  fjarsysla: {
    restUrl:
      process.env.FJARSYSLA_REST_URL ??
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    restUsername: process.env.FJARSYSLA_REST_USER ?? 'xxxxxxxxxxxxx',
    restPassword: process.env.FJARSYSLA_REST_PASS ?? 'xxxxxxxxx',
  },
  skilavottord: {
    userList:
      process.env.SKILAVOTTORD_USER_LIST ??
      `[{"nationalId":"1111111111","name":"xxxxxxxxxxxxxxxxxxxxx","role":"developer","partnerId":""},
        {"nationalId":"2222222222","name":"xxxxxxxx","role":"recyclingFund","partnerId":""},
        {"nationalId":"3333333333","name":"xxxxxxxxxxxxxxxxxx","role":"recyclingCompany","partnerId":""}]`,
  },
  backendUrl: 'http://localhost:3333',
}

const prodConfig = {
  production: true,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    samlEntryPoint2: process.env.SAML_ENTRY_POINT2,
    audience: process.env.AUTH_AUDIENCE,
    jwtSecret: process.env.AUTH_JWT_SECRET,
  },
  samgongustofa: {
    soapUrl: process.env.SAMGONGUSTOFA_SOAP_URL,
    soapUsername: process.env.SAMGONGUSTOFA_SOAP_USER,
    soapPassword: process.env.SAMGONGUSTOFA_SOAP_PASS,
    restAuthUrl: process.env.SAMGONGUSTOFA_REST_AUTH_URL,
    restDeRegUrl: process.env.SAMGONGUSTOFA_REST_DEREG_URL,
    restUsername: process.env.SAMGONGUSTOFA_REST_USER,
    restPassword: process.env.SAMGONGUSTOFA_REST_PASS,
    restReportingStation: process.env.SAMGONGUSTOFA_REST_REPORTING_STATION,
  },
  fjarsysla: {
    restUrl: process.env.FJARSYSLA_REST_URL,
    restUsername: process.env.FJARSYSLA_REST_USER,
    restPassword: process.env.FJARSYSLA_REST_PASS,
  },
  skilavottord: {
    userList: process.env.SKILAVOTTORD_USER_LIST ?? '[]',
  },
  backendUrl: process.env.BACKEND_URL,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
