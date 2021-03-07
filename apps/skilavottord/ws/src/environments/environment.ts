export default {
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
      'https://test-xml.samgongustofa.is/scripts/WebObjects.dll/XML.woa/1/ws/.USXMLWS',
    soapUsername: process.env.SAMGONGUSTOFA_SOAP_USER ?? 'DeloitteTest',
    soapPassword: process.env.SAMGONGUSTOFA_SOAP_PASS ?? 'MajoneS55',
    restAuthUrl:
      process.env.SAMGONGUSTOFA_REST_AUTH_URL ??
      'https://test-api.samgongustofa.is/vehicle/registrations/authenticate',
    restDeRegUrl:
      process.env.SAMGONGUSTOFA_REST_DEREG_URL ??
      'https://test-api.samgongustofa.is/vehicle/registrations/deregistration',
    restUsername: process.env.SAMGONGUSTOFA_REST_USER ?? 'DELOITTE.AFSKRA',
    restPassword: process.env.SAMGONGUSTOFA_REST_PASS ?? 'FlugaaFramrudu',
    restReportingStation:
      process.env.SAMGONGUSTOFA_REST_REPORTING_STATION ?? '',
  },
  fjarsysla: {
    restUrl:
      process.env.FJARSYSLA_REST_URL ??
      'https://tbrws-s.hysing.is/restv2/LeggjaASkilagjald',
    restUsername: process.env.FJARSYSLA_REST_USER ?? 'fjs-samgong-p',
    restPassword: process.env.FJARSYSLA_REST_PASS ?? 'katla.123',
  },
  skilavottord: {
    userList:
      process.env.SKILAVOTTORD_USER_LIST ??
      '[{"nationalId":"0301665909","name":"Sigurgeir Guðmundsson","role":"developer","partnerId":""},{"nationalId":"2811638099","name":"Tómas Árni Jónsson","role":"developer","partnerId":""}]',
  },
  backendUrl: 'http://localhost:3333',
 }
