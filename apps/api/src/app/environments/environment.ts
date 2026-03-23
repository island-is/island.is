import {
  ServerSideFeature,
  ServerSideFeatureClient,
} from '@island.is/feature-flags'

const prodConfig = () => ({
  production: true,
  xroad: {
    baseUrl: process.env.XROAD_BASE_PATH,
    clientId: process.env.XROAD_CLIENT_ID,
  },
  applicationSystem: {
    baseApiUrl: process.env.APPLICATION_SYSTEM_API_URL,
  },
  formSystem: {
    baseApiUrl: process.env.FORM_SYSTEM_API_BASE_PATH,
  },
  drivingLicense: {
    secret: process.env.XROAD_DRIVING_LICENSE_SECRET,
    v1: {
      xroadPath: process.env.XROAD_DRIVING_LICENSE_PATH,
    },
    v2: {
      xroadPath: ServerSideFeatureClient.isOn(ServerSideFeature.drivingLicense)
        ? process.env.XROAD_DRIVING_LICENSE_PATH
        : process.env.XROAD_DRIVING_LICENSE_V2_PATH,
    },
  },
  education: {
    xroadLicenseServiceId: process.env.XROAD_MMS_LICENSE_SERVICE_ID,
    xroadGradeServiceId: process.env.XROAD_MMS_GRADE_SERVICE_ID,
    fileDownloadBucket: process.env.FILE_DOWNLOAD_BUCKET,
  },
  fileStorage: {
    uploadBucket: process.env.FILE_STORAGE_UPLOAD_BUCKET,
  },
  healthInsurance: {
    wsdlUrl: process.env.XROAD_HEALTH_INSURANCE_WSDLURL,
    baseUrl: process.env.XROAD_BASE_PATH,
    username: process.env.XROAD_HEALTH_INSURANCE_USERNAME,
    password: process.env.XROAD_HEALTH_INSURANCE_PASSWORD,
    clientID: process.env.XROAD_CLIENT_ID,
    xroadID: process.env.XROAD_HEALTH_INSURANCE_ID,
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
  },
  documentService: {
    basePath: process.env.POSTHOLF_BASE_PATH,
    clientId: process.env.POSTHOLF_CLIENTID ?? '',
    clientSecret: process.env.POSTHOLF_CLIENT_SECRET ?? '',
    tokenUrl: process.env.POSTHOLF_TOKEN_URL ?? '',
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
  icelandicNamesRegistry: {
    backendUrl: process.env.ICELANDIC_NAMES_REGISTRY_BACKEND_URL,
  },
  endorsementSystem: {
    baseApiUrl: process.env.ENDORSEMENT_SYSTEM_BASE_API_URL,
  },
  paymentDomain: {
    xRoadBaseUrl: process.env.XROAD_BASE_PATH,
    xRoadProviderId: process.env.XROAD_PAYMENT_PROVIDER_ID,
    xRoadClientId: process.env.XROAD_CLIENT_ID,
    username: process.env.XROAD_PAYMENT_USER,
    password: process.env.XROAD_PAYMENT_PASSWORD,
    callbackBaseUrl: process.env.XROAD_PAYMENT_BASE_CALLBACK_URL,
    callbackAdditionUrl: process.env.XROAD_PAYMENT_ADDITION_CALLBACK_URL,
    arkBaseUrl: process.env.ARK_BASE_URL,
  },
  audit: {
    defaultNamespace: '@island.is/api',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'api',
  },
})

const devConfig = () => ({
  production: false,
  xroad: {
    baseUrl: 'http://localhost:8081',
    clientId: 'IS-DEV/GOV/10000/island-is-client',
  },
  applicationSystem: {
    baseApiUrl: 'http://localhost:3333',
  },
  formSystem: {
    baseApiUrl: 'http://localhost:3434',
  },
  drivingLicense: {
    secret: process.env.XROAD_DRIVING_LICENSE_SECRET,
    v1: {
      xroadPath:
        process.env.XROAD_DRIVING_LICENSE_PATH ??
        'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1',
    },
    v2: {
      xroadPath:
        process.env.XROAD_DRIVING_LICENSE_V2_PATH ??
        'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v2',
    },
  },
  education: {
    xroadLicenseServiceId: 'IS-DEV/GOV/10066/MMS-Protected/license-api-v1',
    xroadGradeServiceId: 'IS-DEV/GOV/10066/MMS-Protected/grade-api-v1',
    fileDownloadBucket: 'island-is-dev-download-cache-api',
  },
  fileStorage: {
    uploadBucket: process.env.FILE_STORAGE_UPLOAD_BUCKET,
  },
  healthInsurance: {
    wsdlUrl:
      process.env.XROAD_HEALTH_INSURANCE_WSDLURL ??
      'https://test-huld.sjukra.is/islandrg?wsdl',
    baseUrl: process.env.XROAD_BASE_PATH ?? 'http://localhost:8080',
    username: process.env.XROAD_HEALTH_INSURANCE_USERNAME ?? '',
    password: process.env.XROAD_HEALTH_INSURANCE_PASSWORD ?? '',
    clientID: process.env.XROAD_CLIENT_ID ?? '',
    xroadID: process.env.XROAD_HEALTH_INSURANCE_ID ?? '',
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
  },
  documentService: {
    basePath: process.env.POSTHOLF_BASE_PATH,
    clientId: process.env.POSTHOLF_CLIENTID ?? '',
    clientSecret: process.env.POSTHOLF_CLIENT_SECRET ?? '',
    tokenUrl: process.env.POSTHOLF_TOKEN_URL ?? '',
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
    url: process.env.RSK_URL,
    username: process.env.RSK_USERNAME,
    password: process.env.RSK_API_PASSWORD,
  },
  rskCompanyInfo: {
    xRoadBaseUrl: process.env.XROAD_BASE_PATH,
    xRoadProviderId: process.env.COMPANY_REGISTRY_XROAD_PROVIDER_ID,
    xRoadClientId: process.env.XROAD_CLIENT_ID,
    apiPath: process.env.COMPANY_REGISTRY_XROAD_API_PATH,
  },
  icelandicNamesRegistry: {
    backendUrl: 'http://localhost:4239',
  },
  endorsementSystem: {
    baseApiUrl: 'http://localhost:4246',
  },
  paymentDomain: {
    xRoadBaseUrl: process.env.XROAD_BASE_PATH ?? 'http://localhost:8080',
    xRoadProviderId:
      process.env.XROAD_PAYMENT_PROVIDER_ID ?? 'IS-DEV/GOV/10021/FJS-Public',
    xRoadClientId: process.env.XROAD_CLIENT_ID,
    username: process.env.XROAD_PAYMENT_USER,
    password: process.env.XROAD_PAYMENT_PASSWORD,
    callbackBaseUrl: process.env.XROAD_PAYMENT_BASE_CALLBACK_URL,
    callbackAdditionUrl: process.env.XROAD_PAYMENT_ADDITION_CALLBACK_URL,
    arkBaseUrl: process.env.ARK_BASE_URL,
  },
  audit: {
    defaultNamespace: '@island.is/api',
  },
})

export const getConfig =
  process.env.PROD_MODE === 'true' || process.env.NODE_ENV === 'production'
    ? prodConfig()
    : devConfig()
