export default {
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
  backendUrl: process.env.BACKEND_URL,
}
