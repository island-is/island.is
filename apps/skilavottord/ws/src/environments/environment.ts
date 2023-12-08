const devConfig = {
  production: false,
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    nextAuthCookieName: 'next-auth.session-token',
    audience: '@urvinnslusjodur.is/skilavottord',
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
  backendUrl: 'http://localhost:3339',
}

const prodConfig = {
  production: true,
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '@urvinnslusjodur.is/skilavottord',
    nextAuthCookieName: '__Secure-next-auth.session-token',
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
  backendUrl: process.env.BACKEND_URL,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
