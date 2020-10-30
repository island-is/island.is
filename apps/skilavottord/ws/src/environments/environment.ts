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
      'https://test-xml.samgongustofa.is/scripts/WebObjects.dll/XML.woa/1/ws/.USXMLWS',
    soapUsername: 'DeloitteTest',
    soapPassword: 'MajoneS55',
    restAuthUrl:
      'https://test-api.samgongustofa.is/vehicle/registrations/authenticate',
    restDeRegUrl: 'https://test-api.samgongustofa.is/vehicle/registrations',
    restUsername: 'deloitte.afskra',
    restPassword: 'SkoppaogSkritla',
    restReportingStation: '1',
  },
  fjarsysla: {
    restUrl: process.env.FJARSYSLA_REST_URL,
    restUsername: process.env.FJARSYSLA_REST_USER,
    restPassword: process.env.FJARSYSLA_REST_PASS,
  },
  backendUrl: 'http://localhost:3333',
}
