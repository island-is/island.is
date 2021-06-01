const devConfig = {
  production: false,
  xroad: {
    baseUrl: 'http://localhost:8081',
    clientId: 'IS-DEV/GOV/10000/island-is-client',
  },
  applicationSystem: {
    baseApiUrl: 'http://localhost:3333',
  },
  authPublicApi: {
    baseApiUrl: 'http://localhost:3370',
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
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '',
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
    url:
      process.env.XROAD_BASE_PATH_WITH_ENV ?? 'http://localhost:8081/r1/IS-DEV',
    memberCode: process.env.XROAD_TJODSKRA_MEMBER_CODE ?? '10001',
    apiPath:
      process.env.XROAD_TJODSKRA_API_PATH ?? '/SKRA-Protected/Einstaklingar-v1',
    clientId: process.env.XROAD_CLIENT_ID ?? 'DEV/GOV/10000/island-is-client',
  },
}

const prodConfig = {
  production: true,
  xroad: {
    baseUrl: process.env.XROAD_BASE_PATH,
    clientId: process.env.XROAD_CLIENT_ID,
  },
  applicationSystem: {
    baseApiUrl: process.env.APPLICATION_SYSTEM_API_URL,
  },
  authPublicApi: {
    baseApiUrl: process.env.AUTH_PUBLIC_API_URL,
  },
  drivingLicense: {
    secret: process.env.DRIVING_LICENSE_SECRET,
  },
  education: {
    xroadLicenseServiceId: process.env.XROAD_MMS_LICENSE_SERVICE_ID,
    xroadGradeServiceId: process.env.XROAD_MMS_GRADE_SERVICE_ID,
    fileDownloadBucket: process.env.FILE_DOWNLOAD_BUCKET,
  },
  fileStorage: {
    uploadBucket: process.env.FILE_STORAGE_UPLOAD_BUCKET,
  },
  nationalRegistry: {
    baseSoapUrl: process.env.SOFFIA_SOAP_URL,
    user: process.env.SOFFIA_USER,
    password: process.env.SOFFIA_PASS,
    host: process.env.SOFFIA_HOST_URL,
  },
  healthInsurance: {
    wsdlUrl: process.env.HEALTH_INSURANCE_XROAD_WSDLURL,
    baseUrl: process.env.XROAD_BASE_PATH,
    username: process.env.HEALTH_INSURANCE_XROAD_USERNAME,
    password: process.env.HEALTH_INSURANCE_XROAD_PASSWORD,
    clientID: process.env.XROAD_CLIENT_ID,
    xroadID: process.env.XROAD_HEALTH_INSURANCE_ID,
  },
  userProfile: {
    userProfileServiceBasePath: process.env.SERVICE_USER_PROFILE_URL,
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '',
  },
  documentService: {
    basePath: process.env.POSTHOLF_BASE_PATH,
    clientId: process.env.POSTHOLF_CLIENTID ?? '',
    clientSecret: process.env.POSTHOLF_CLIENT_SECRET ?? '',
    tokenUrl: process.env.POSTHOLF_TOKEN_URL ?? '',
  },
  downloadService: {
    baseUrl: process.env.DOWNLOAD_SERVICE_BASE_PATH,
  },
  documentProviderService: {
    test: {
      basePath: process.env.DOCUMENT_PROVIDER_BASE_PATH_TEST,
      clientId: process.env.DOCUMENT_PROVIDER_CLIENTID_TEST ?? '',
      clientSecret: process.env.DOCUMENT_PROVIDER_CLIENT_SECRET_TEST ?? '',
      tokenUrl: process.env.DOCUMENT_PROVIDER_TOKEN_URL_TEST ?? '',
    },
    prod: {
      basePath: process.env.DOCUMENT_PROVIDER_BASE_PATH,
      clientId: process.env.DOCUMENT_PROVIDER_CLIENTID ?? '',
      clientSecret: process.env.DOCUMENT_PROVIDER_CLIENT_SECRET ?? '',
      tokenUrl: process.env.DOCUMENT_PROVIDER_TOKEN_URL ?? '',
    },
    documentsServiceBasePath: process.env.SERVICE_DOCUMENTS_BASEPATH,
    documentProviderAdmins: process.env.DOCUMENT_PROVIDER_ADMINS,
  },
  syslumennService: {
    url: process.env.SYSLUMENN_HOST,
    username: process.env.SYSLUMENN_USERNAME,
    password: process.env.SYSLUMENN_PASSWORD,
  },
  rskDomain: {
    username: process.env.RSK_API_USERNAME,
    password: process.env.RSK_API_PASSWORD,
    url: process.env.RSK_API_URL,
  },
  icelandicNamesRegistry: {
    backendUrl: process.env.ICELANDIC_NAMES_REGISTRY_BACKEND_URL,
  },
  regulationsDomain: {
    url: process.env.REGULATIONS_API_URL,
  },
  endorsementSystem: {
    baseApiUrl: process.env.ENDORSEMENT_SYSTEM_BASE_API_URL,
  },
  nationalRegistryXRoad: {
    url: process.env.XROAD_BASE_PATH_WITH_ENV,
    memberCode: process.env.XROAD_TJODSKRA_MEMBER_CODE,
    apiPath: process.env.XROAD_TJODSKRA_API_PATH,
    clientId: process.env.ROAD_CLIENT_ID,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
