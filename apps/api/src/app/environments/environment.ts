export default {
  production: false,
  xroad: {
    baseUrl: 'http://localhost:8081',
    clientId: 'IS-DEV/GOV/10000/island-is-client',
  },
  applicationSystem: {
    baseApiUrl: 'http://localhost:3333',
  },
  drivingLicense: {
    secret: process.env.DRIVING_LICENSE_SECRET,
  },
  education: {
    xroadLicenseServiceId: 'IS-DEV/EDU/10020/MMS-Protected/license-api-v1',
    xroadGradeServiceId: 'IS-DEV/EDU/10020/MMS-Protected/grade-api-v1',
    fileDownloadBucket: 'island-is-dev-download-cache-api',
  },
  fileStorage: {
    uploadBucket: process.env.FILE_STORAGE_UPLOAD_BUCKET,
  },
  nationalRegistry: {
    baseSoapUrl: 'https://localhost:8443',
    user: process.env.SOFFIA_USER ?? '',
    password: process.env.SOFFIA_PASS ?? '',
    host: 'soffiaprufa.skra.is',
  },
  healthInsurance: {
    wsdlUrl:
      process.env.HEALTH_INSURANCE_XROAD_WSDLURL ??
      'https://test-huld.sjukra.is/islandrg?wsdl',
    baseUrl: process.env.XROAD_BASE_PATH ?? 'http://localhost:8080',
    username: process.env.HEALTH_INSURANCE_XROAD_USERNAME ?? '',
    password: process.env.HEALTH_INSURANCE_XROAD_PASSWORD ?? '',
    clientID: process.env.XROAD_CLIENT_ID ?? '',
    xroadID: process.env.XROAD_HEALTH_INSURANCE_ID ?? '',
  },
  userProfile: {
    userProfileServiceBasePath: 'http://localhost:3366',
  },
  identityServer: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '',
    jwksUri:
      'https://identity-server.dev01.devland.is/.well-known/openid-configuration/jwks',
  },
  documentService: {
    basePath: process.env.POSTHOLF_BASE_PATH,
    clientId: process.env.POSTHOLF_CLIENTID ?? '',
    clientSecret: process.env.POSTHOLF_CLIENT_SECRET ?? '',
    tokenUrl: process.env.POSTHOLF_TOKEN_URL ?? '',
  },
  downloadService: {
    baseUrl: 'http://localhost:3377',
  },
  documentProviderService: {
    documentsServiceBasePath: 'http://localhost:3369',
    documentProviderAdmins: process.env.DOCUMENT_PROVIDER_ADMINS ?? '',
    test: {
      basePath:
        'https://test-documentprovidermanagement-island-is.azurewebsites.net',
      clientId: process.env.DOCUMENT_PROVIDER_CLIENTID_TEST ?? '',
      clientSecret: process.env.DOCUMENT_PROVIDER_CLIENT_SECRET_TEST ?? '',
      tokenUrl: process.env.DOCUMENT_PROVIDER_TOKEN_URL_TEST ?? '',
    },
    prod: {
      basePath:
        'https://test-documentprovidermanagement-island-is.azurewebsites.net',
      clientId: process.env.DOCUMENT_PROVIDER_CLIENTID ?? '',
      clientSecret: process.env.DOCUMENT_PROVIDER_CLIENT_SECRET ?? '',
      tokenUrl: process.env.DOCUMENT_PROVIDER_TOKEN_URL ?? '',
    },
  },
  syslumennService: {
    url: process.env.SYSLUMENN_HOST ?? '',
    username: process.env.SYSLUMENN_USERNAME ?? '',
    password: process.env.SYSLUMENN_PASSWORD ?? '',
  },
  rskDomain: {
    username: 'rf_api_island.is',
    url: 'https://thjonusta-s.rsk.is/api',
    password: process.env.RSK_API_PASSWORD,
  },
  icelandicNamesRegistry: {
    backendUrl: 'http://localhost:4239',
  },
  regulationsDomain: {
    url:
      process.env.REGULATIONS_API_URL ??
      'https://reglugerdir-api.herokuapp.com/api/v1',
  },
  endorsementSystem: {
    baseApiUrl: 'http://localhost:4246',
  },
  nationalRegistryXRoad: {
    url: process.env.XROAD_BASE_PATH ?? 'http://localhost:8080/r1/IS-DEV',
    memberCode: process.env.XROAD_TJODSKRA_MEMBER_CODE ?? '10001',
    apiPath:
      process.env.XROAD_TJODSKRA_API_PATH ?? '/SKRA-Protected/Einstaklingar-v1',
    clientId: process.env.XROAD_CLIENT_ID ?? 'DEV/GOV/10000/island-is-client',
  },
  paymentDomain: {
    username: 'isl_aranja_p',
    password: 'vogur.123',
    url: 'https://tbrws-s.hysing.is',
  },
}
