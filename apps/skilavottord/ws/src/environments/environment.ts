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
    restPassword: process.env.FJARSYSLA_REST_PASS
  },
  backendUrl: 'http://localhost:3333',
}
