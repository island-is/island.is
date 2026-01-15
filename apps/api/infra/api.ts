import { json, ref, service, ServiceBuilder } from '../../../infra/src/dsl/dsl'
import {
  AdrAndMachine,
  AircraftRegistry,
  Base,
  ChargeFjsV2,
  Client,
  CriminalRecord,
  DirectorateOfImmigration,
  Disability,
  DistrictCommissionersLicenses,
  DistrictCommissionersPCard,
  DrivingLicense,
  DrivingLicenseBook,
  Education,
  EnergyFunds,
  Finance,
  Firearm,
  FishingLicense,
  Frigg,
  HealthDirectorateOrganDonation,
  HealthDirectorateVaccination,
  HealthDirectorateHealthService,
  HealthInsurance,
  PoliceCases,
  HousingBenefitCalculator,
  IcelandicGovernmentInstitutionVacancies,
  Inna,
  IntellectualProperties,
  JudicialAdministration,
  JudicialSystemServicePortal,
  Labor,
  MunicipalitiesFinancialAid,
  NationalRegistry,
  NationalRegistryB2C,
  OccupationalLicenses,
  OfficialJournalOfIceland,
  OfficialJournalOfIcelandApplication,
  LegalGazette,
  Passports,
  Payment,
  PaymentSchedule,
  Properties,
  PropertySearch,
  RentalService,
  RskCompanyInfo,
  RskProcuring,
  RskCarRentalRate,
  SeminarsVer,
  ShipRegistry,
  SignatureCollection,
  SocialInsuranceAdministration,
  TransportAuthority,
  UniversityCareers,
  Vehicles,
  NVSPermits,
  VehicleServiceFjsV1,
  VehiclesMileage,
  WorkAccidents,
  WorkMachines,
  SecondarySchool,
  LSH,
  PracticalExams,
  FireCompensation,
  VMSTUnemployment,
  GoProVerdicts,
} from '../../../infra/src/dsl/xroad'

export const serviceSetup = (services: {
  appSystemApi: ServiceBuilder<'application-system-api'>
  servicePortalApi: ServiceBuilder<'service-portal-api'>
  icelandicNameRegistryBackend: ServiceBuilder<'icelandic-names-registry-backend'>
  documentsService: ServiceBuilder<'services-documents'>
  servicesEndorsementApi: ServiceBuilder<'services-endorsement-api'>
  regulationsAdminBackend: ServiceBuilder<'regulations-admin-backend'>
  airDiscountSchemeBackend: ServiceBuilder<'air-discount-scheme-backend'>
  sessionsApi: ServiceBuilder<'services-sessions'>
  authAdminApi: ServiceBuilder<'services-auth-admin-api'>
  universityGatewayApi: ServiceBuilder<'services-university-gateway'>
  userNotificationService: ServiceBuilder<'services-user-notification'>
  paymentsApi: ServiceBuilder<'services-payments'>
  formSystemService: ServiceBuilder<'services-form-system-api'>
  paymentFlowUpdateHandlerService: ServiceBuilder<'services-payment-flow-update-handler'>
}): ServiceBuilder<'api'> => {
  return service('api')
    .namespace('islandis')
    .serviceAccount()
    .command('node')
    .args('--tls-min-v1.0', '--no-experimental-fetch', 'main.cjs')
    .env({
      APPLICATION_SYSTEM_API_URL: ref(
        (h) => `http://${h.svc(services.appSystemApi)}`,
      ),
      USER_NOTIFICATION_API_URL: ref(
        (h) => `http://${h.svc(services.userNotificationService)}`,
      ),
      ICELANDIC_NAMES_REGISTRY_BACKEND_URL: ref(
        (h) => `http://${h.svc(services.icelandicNameRegistryBackend)}`,
      ),
      AIR_DISCOUNT_SCHEME_BACKEND_URL: ref(
        (h) => `http://${h.svc(services.airDiscountSchemeBackend)}`,
      ),
      AIR_DISCOUNT_SCHEME_FRONTEND_HOSTNAME: {
        dev: 'loftbru.dev01.devland.is',
        staging: 'loftbru.staging01.devland.is',
        prod: 'loftbru.island.is',
      },
      FILE_STORAGE_UPLOAD_BUCKET: {
        dev: 'island-is-dev-upload-api',
        staging: 'island-is-staging-upload-api',
        prod: 'island-is-prod-upload-api',
      },
      AUTH_PUBLIC_API_URL: {
        dev: 'https://identity-server.dev01.devland.is/api',
        staging: 'https://identity-server.staging01.devland.is/api',
        prod: 'https://innskra.island.is/api',
      },
      ELASTIC_NODE: {
        dev: 'https://vpc-search-njkekqydiegezhr4vqpkfnw5la.eu-west-1.es.amazonaws.com',
        staging:
          'https://vpc-search-q6hdtjcdlhkffyxvrnmzfwphuq.eu-west-1.es.amazonaws.com/',
        prod: 'https://vpc-search-mw4w5c2m2g5edjrtvwbpzhkw24.eu-west-1.es.amazonaws.com/',
      },
      CONTENTFUL_HOST: {
        dev: 'preview.contentful.com',
        staging: 'cdn.contentful.com',
        prod: 'cdn.contentful.com',
      },
      CONTACT_US_EMAIL: {
        prod: 'island@island.is',
        staging: 'island@island.is',
        dev: 's@kogk.is',
      },
      ZENDESK_CONTACT_FORM_SUBDOMAIN: {
        prod: 'digitaliceland',
        staging: 'digitaliceland',
        dev: 'stjanilofts',
      },
      TELL_US_A_STORY_EMAIL: {
        dev: 's@kogk.is',
        staging: 'sogur@island.is',
        prod: 'sogur@island.is',
      },
      SEND_FROM_EMAIL: {
        dev: 'development@island.is',
        staging: 'development@island.is',
        prod: 'island@island.is',
      },
      USER_PROFILE_CLIENT_URL: ref(
        (h) => `http://${h.svc(services.servicePortalApi)}`,
      ),
      FILE_DOWNLOAD_BUCKET: {
        dev: 'island-is-dev-download-cache-api',
        staging: 'island-is-staging-download-cache-api',
        prod: 'island-is-prod-download-cache-api',
      },
      SERVICE_DOCUMENTS_BASEPATH: ref(
        (h) => `http://${h.svc(services.documentsService)}`,
      ),
      DOWNLOAD_SERVICE_BASE_PATH: {
        prod: 'https://api.island.is',
        dev: 'https://api.dev01.devland.is',
        staging: 'https://api.staging01.devland.is',
      },
      ENDORSEMENT_SYSTEM_BASE_API_URL: ref(
        (h) => `http://${h.svc(services.servicesEndorsementApi)}`,
      ),
      REGULATIONS_ADMIN_URL: ref(
        (h) => `http://${h.svc(services.regulationsAdminBackend)}`,
      ),
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/api',
      AIR_DISCOUNT_SCHEME_CLIENT_TIMEOUT: '20000',
      XROAD_NATIONAL_REGISTRY_TIMEOUT: '20000',
      XROAD_PROPERTIES_TIMEOUT: '35000',
      SYSLUMENN_TIMEOUT: '40000',
      XROAD_DRIVING_LICENSE_BOOK_TIMEOUT: '20000',
      XROAD_FINANCES_TIMEOUT: '20000',
      XROAD_CHARGE_FJS_V2_TIMEOUT: '20000',
      AUTH_DELEGATION_API_URL: {
        dev: 'https://auth-delegation-api.internal.identity-server.dev01.devland.is',
        staging:
          'http://services-auth-delegation-api.identity-server-delegation.svc.cluster.local',
        prod: 'https://auth-delegation-api.internal.innskra.island.is',
      },
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      MUNICIPALITIES_FINANCIAL_AID_BACKEND_URL: {
        dev: 'http://financial-aid-backend',
        staging: 'http://financial-aid-backend',
        prod: 'http://financial-aid-backend',
      },
      FINANCIAL_STATEMENTS_INAO_BASE_PATH: {
        dev: 'https://dev-re.crm4.dynamics.com/api/data/v9.1',
        staging: 'https://dev-re.crm4.dynamics.com/api/data/v9.1',
        prod: 'https://star-re.crm4.dynamics.com/api/data/v9.1',
      },
      FINANCIAL_STATEMENTS_INAO_ISSUER:
        'https://login.microsoftonline.com/05a20268-aaea-4bb5-bb78-960b0462185e/v2.0',
      FINANCIAL_STATEMENTS_INAO_SCOPE: {
        dev: 'https://dev-re.crm4.dynamics.com/.default',
        staging: 'https://dev-re.crm4.dynamics.com/.default',
        prod: 'https://star-re.crm4.dynamics.com/.default',
      },
      FINANCIAL_STATEMENTS_INAO_TOKEN_ENDPOINT:
        'https://login.microsoftonline.com/05a20268-aaea-4bb5-bb78-960b0462185e/oauth2/v2.0/token',
      FORM_SYSTEM_API_BASE_PATH: ref(
        (h) => `http://${h.svc(services.formSystemService)}`,
      ),
      CONSULTATION_PORTAL_CLIENT_BASE_PATH: {
        dev: 'https://samradapi-test.devland.is',
        staging: 'https://samradapi-test.devland.is',
        prod: 'https://samradapi.island.is',
      },
      FISKISTOFA_ZENTER_CLIENT_ID: '1114',
      HSN_WEB_FORM_ID: '1dimJFHLFYtnhoYEA3JxRK',
      SESSIONS_API_URL: ref((h) => `http://${h.svc(services.sessionsApi)}`),
      AUTH_ADMIN_API_PATH: {
        dev: 'https://identity-server.dev01.devland.is/backend',
        staging: 'https://identity-server.staging01.devland.is/backend',
        prod: 'https://innskra.island.is/backend',
      },
      AUTH_ADMIN_API_PATHS: {
        dev: json({
          development: 'https://identity-server.dev01.devland.is/backend',
        }),
        staging: json({
          development: 'https://identity-server.dev01.devland.is/backend',
          staging: 'https://identity-server.staging01.devland.is/backend',
        }),
        prod: json({
          development: 'https://identity-server.dev01.devland.is/backend',
          staging: 'https://identity-server.staging01.devland.is/backend',
          production: 'https://innskra.island.is/backend',
        }),
      },
      AUTH_IDS_API_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      HUNTING_LICENSE_PASS_TEMPLATE_ID: {
        dev: '1da72d52-a93a-4d0f-8463-1933a2bd210b',
        staging: '1da72d52-a93a-4d0f-8463-1933a2bd210b',
        prod: '5f42f942-d8d6-40bf-a186-5a9e12619d9f',
      },
      XROAD_RSK_PROCURING_REDIS_NODES: {
        dev: json([
          'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
        ]),
        staging: json([
          'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
        ]),
        prod: json([
          'clustercfg.general-redis-cluster-group.whakos.euw1.cache.amazonaws.com:6379',
        ]),
      },
      APOLLO_CACHE_REDIS_NODES: {
        dev: json([
          'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
        ]),
        staging: json([
          'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
        ]),
        prod: json([
          'clustercfg.general-redis-cluster-group.whakos.euw1.cache.amazonaws.com:6379',
        ]),
      },
      LICENSE_SERVICE_REDIS_NODES: {
        dev: json([
          'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
        ]),
        staging: json([
          'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
        ]),
        prod: json([
          'clustercfg.general-redis-cluster-group.whakos.euw1.cache.amazonaws.com:6379',
        ]),
      },
      XROAD_RSK_PROCURING_SCOPE: json([
        '@rsk.is/prokura',
        '@rsk.is/prokura:admin',
      ]),
      XROAD_FJS_BANKINFO_PATH: {
        dev: 'IS-DEV/GOV/10021/FJS-Public/TBRBankMgrService_v1',
        staging: 'IS-TEST/GOV/10021/FJS-Public/TBRBankMgrService_v1',
        prod: 'IS/GOV/5402697509/FJS-Public/TBRBankMgrService_v1',
      },
      UNIVERSITY_GATEWAY_API_URL: ref(
        (h) => `http://${h.svc(services.universityGatewayApi)}`,
      ),
      PAYMENTS_API_URL: ref((h) => `http://${h.svc(services.paymentsApi)}`),
      WATSON_ASSISTANT_CHAT_FEEDBACK_DB_NAME: {
        dev: 'island-is-assistant-feedback',
        staging: 'island-is-assistant-feedback',
        prod: 'island-is-assistant-feedback',
      },
      RANNIS_GRANTS_URL: {
        dev: 'https://sjodir.rannis.is/statistics/fund_schedule.php',
        staging: 'https://sjodir.rannis.is/statistics/fund_schedule.php',
        prod: 'https://sjodir.rannis.is/statistics/fund_schedule.php',
      },
      HMS_CONTRACTS_AUTH_TOKEN_ENDPOINT: {
        dev: 'https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token',
        staging:
          'https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token',
        prod: 'https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token',
      },
      HMS_CONTRACTS_AUTH_TENANT_ID: {
        dev: 'c7256472-2622-417e-8955-a54eeb0a110e',
        staging: 'c7256472-2622-417e-8955-a54eeb0a110e',
        prod: 'c7256472-2622-417e-8955-a54eeb0a110e',
      },
      HMS_CONTRACTS_AUTH_CLIENT_ID: {
        dev: 'e2411f5c-436a-4c17-aa14-eab9c225bc06',
        staging: 'e2411f5c-436a-4c17-aa14-eab9c225bc06',
        prod: '44055958-a462-4ba8-bbd2-5bfedbbd18c0',
      },
      LANDSPITALI_PAYMENT_FLOW_EVENT_CALLBACK_URL: ref(
        (h) => `http://${h.svc(services.paymentFlowUpdateHandlerService)}`,
      ),
      WEB_DOMAIN: {
        dev: 'beta.dev01.devland.is',
        staging: 'beta.staging01.devland.is',
        prod: 'island.is',
      },
      ENVIRONMENT: ref((h) => h.env.type),
    })
    .secrets({
      APOLLO_BYPASS_CACHE_SECRET: '/k8s/api/APOLLO_BYPASS_CACHE_SECRET',
      DOCUMENT_PROVIDER_BASE_PATH: '/k8s/api/DOCUMENT_PROVIDER_BASE_PATH',
      DOCUMENT_PROVIDER_TOKEN_URL: '/k8s/api/DOCUMENT_PROVIDER_TOKEN_URL',
      DOCUMENT_PROVIDER_BASE_PATH_TEST:
        '/k8s/api/DOCUMENT_PROVIDER_BASE_PATH_TEST',
      DOCUMENT_PROVIDER_TOKEN_URL_TEST:
        '/k8s/api/DOCUMENT_PROVIDER_TOKEN_URL_TEST',
      SYSLUMENN_HOST: '/k8s/api/SYSLUMENN_HOST',
      REGULATIONS_API_URL: '/k8s/api/REGULATIONS_API_URL',
      REGULATIONS_FILE_UPLOAD_KEY_DRAFT:
        '/k8s/api/REGULATIONS_FILE_UPLOAD_KEY_DRAFT',
      REGULATIONS_FILE_UPLOAD_KEY_PUBLISH:
        '/k8s/api/REGULATIONS_FILE_UPLOAD_KEY_PUBLISH',
      REGULATIONS_FILE_UPLOAD_KEY_PRESIGNED:
        '/k8s/api/REGULATIONS_FILE_UPLOAD_KEY_PRESIGNED',
      CONTENTFUL_ACCESS_TOKEN: '/k8s/api/CONTENTFUL_ACCESS_TOKEN',
      ZENDESK_CONTACT_FORM_EMAIL: '/k8s/api/ZENDESK_CONTACT_FORM_EMAIL',
      ZENDESK_CONTACT_FORM_TOKEN: '/k8s/api/ZENDESK_CONTACT_FORM_TOKEN',
      POSTHOLF_CLIENTID: '/k8s/documents/POSTHOLF_CLIENTID',
      POSTHOLF_CLIENT_SECRET: '/k8s/documents/POSTHOLF_CLIENT_SECRET',
      POSTHOLF_TOKEN_URL: '/k8s/documents/POSTHOLF_TOKEN_URL',
      POSTHOLF_BASE_PATH: '/k8s/documents/POSTHOLF_BASE_PATH',
      DOCUMENT_PROVIDER_CLIENTID:
        '/k8s/documentprovider/DOCUMENT_PROVIDER_CLIENTID',
      DOCUMENT_PROVIDER_CLIENT_SECRET:
        '/k8s/documentprovider/DOCUMENT_PROVIDER_CLIENT_SECRET',
      DOCUMENT_PROVIDER_CLIENTID_TEST:
        '/k8s/documentprovider/DOCUMENT_PROVIDER_CLIENTID_TEST',
      DOCUMENT_PROVIDER_CLIENT_SECRET_TEST:
        '/k8s/documentprovider/DOCUMENT_PROVIDER_CLIENT_SECRET_TEST',
      ELFUR_CLIENT_SECRET: '/k8s/api/ELFUR_CLIENT_SECRET',
      ELFUR_USERNAME_KEY: '/k8s/api/ELFUR_API_USERNAME_KEY',
      DOCUMENT_PROVIDER_DASHBOARD_CLIENT_SECRET:
        '/k8s/documentprovider/DOCUMENT_PROVIDER_DASHBOARD_CLIENT_SECRET',
      DOCUMENT_PROVIDER_DASHBOARD_CLIENTID:
        '/k8s/documentprovider/DOCUMENT_PROVIDER_DASHBOARD_CLIENTID',
      DOCUMENT_PROVIDER_DASHBOARD_TOKEN_URL:
        '/k8s/documentprovider/DOCUMENT_PROVIDER_DASHBOARD_TOKEN_URL',
      DOCUMENT_PROVIDER_DASHBOARD_BASE_PATH:
        '/k8s/documentprovider/DOCUMENT_PROVIDER_DASHBOARD_BASE_PATH',
      DOCUMENT_PROVIDER_DASHBOARD_SCOPE:
        '/k8s/documentprovider/DOCUMENT_PROVIDER_DASHBOARD_SCOPE',
      SYSLUMENN_USERNAME: '/k8s/api/SYSLUMENN_USERNAME',
      SYSLUMENN_PASSWORD: '/k8s/api/SYSLUMENN_PASSWORD',
      PKPASS_API_KEY: '/k8s/api/PKPASS_API_KEY',
      PKPASS_API_URL: '/k8s/api/PKPASS_API_URL',
      PKPASS_AUTH_RETRIES: '/k8s/api/PKPASS_AUTH_RETRIES',
      PKPASS_CACHE_KEY: '/k8s/api/PKPASS_CACHE_KEY',
      PKPASS_CACHE_TOKEN_EXPIRY_DELTA:
        '/k8s/api/PKPASS_CACHE_TOKEN_EXPIRY_DELTA',
      PKPASS_SECRET_KEY: '/k8s/api/PKPASS_SECRET_KEY',
      VE_PKPASS_API_KEY: '/k8s/api/VE_PKPASS_API_KEY',
      UST_PKPASS_API_KEY: '/k8s/api/UST_PKPASS_API_KEY',
      RLS_PKPASS_API_KEY: '/k8s/api/RLS_PKPASS_API_KEY',
      TR_PKPASS_API_KEY: '/k8s/api/TR_PKPASS_API_KEY',
      SMART_SOLUTIONS_API_URL: '/k8s/api/SMART_SOLUTIONS_API_URL',
      FIREARM_LICENSE_PASS_TEMPLATE_ID:
        '/k8s/api/FIREARM_LICENSE_PASS_TEMPLATE_ID',
      DISABILITY_LICENSE_PASS_TEMPLATE_ID:
        '/k8s/DISABILITY_LICENSE_PASS_TEMPLATE_ID',
      MACHINE_LICENSE_PASS_TEMPLATE_ID:
        '/k8s/api/MACHINE_LICENSE_PASS_TEMPLATE_ID',
      ADR_LICENSE_PASS_TEMPLATE_ID: '/k8s/api/ADR_LICENSE_PASS_TEMPLATE_ID',
      DRIVING_LICENSE_PASS_TEMPLATE_ID:
        '/k8s/api/DRIVING_LICENSE_PASS_TEMPLATE_ID',
      ADR_LICENSE_FETCH_TIMEOUT: '/k8s/api/ADR_LICENSE_FETCH_TIMEOUT',
      DRIVING_LICENSE_FETCH_TIMEOUT: '/k8s/api/DRIVING_LICENSE_FETCH_TIMEOUT',
      FIREARM_LICENSE_FETCH_TIMEOUT: '/k8s/api/FIREARM_LICENSE_FETCH_TIMEOUT',
      DISABILITY_LICENSE_FETCH_TIMEOUT:
        '/k8s/api/DISABILITY_LICENSE_FETCH_TIMEOUT',
      RLS_CASES_API_KEY: '/k8s/api/RLS_CASES_API_KEY',
      INTELLECTUAL_PROPERTY_API_KEY: '/k8s/api/IP_API_KEY',
      VEHICLES_ALLOW_CO_OWNERS: '/k8s/api/VEHICLES_ALLOW_CO_OWNERS',
      IDENTITY_SERVER_CLIENT_SECRET: '/k8s/api/IDENTITY_SERVER_CLIENT_SECRET',
      FINANCIAL_STATEMENTS_INAO_CLIENT_ID:
        '/k8s/api/FINANCIAL_STATEMENTS_INAO_CLIENT_ID',
      FINANCIAL_STATEMENTS_INAO_CLIENT_SECRET:
        '/k8s/api/FINANCIAL_STATEMENTS_INAO_CLIENT_SECRET',
      FISKISTOFA_ZENTER_EMAIL: '/k8s/api/FISKISTOFA_ZENTER_EMAIL',
      FISKISTOFA_ZENTER_PASSWORD: '/k8s/api/FISKISTOFA_ZENTER_PASSWORD',
      FISKISTOFA_ZENTER_CLIENT_PASSWORD:
        '/k8s/api/FISKISTOFA_ZENTER_CLIENT_PASSWORD',
      FISKISTOFA_API_URL: '/k8s/api/FISKISTOFA_API_URL',
      FISKISTOFA_API_ACCESS_TOKEN_SERVICE_CLIENT_SECRET:
        '/k8s/api/FISKISTOFA_API_ACCESS_TOKEN_SERVICE_CLIENT_SECRET',
      FISKISTOFA_API_ACCESS_TOKEN_SERVICE_URL:
        '/k8s/api/FISKISTOFA_API_ACCESS_TOKEN_SERVICE_URL',
      FISKISTOFA_API_ACCESS_TOKEN_SERVICE_CLIENT_ID:
        '/k8s/api/FISKISTOFA_API_ACCESS_TOKEN_SERVICE_CLIENT_ID',
      FISKISTOFA_API_ACCESS_TOKEN_SERVICE_AUDIENCE:
        '/k8s/api/FISKISTOFA_API_ACCESS_TOKEN_SERVICE_AUDIENCE',
      FISKISTOFA_POWERBI_CLIENT_ID: '/k8s/api/FISKISTOFA_POWERBI_CLIENT_ID',
      FISKISTOFA_POWERBI_CLIENT_SECRET:
        '/k8s/api/FISKISTOFA_POWERBI_CLIENT_SECRET',
      FISKISTOFA_POWERBI_TENANT_ID: '/k8s/api/FISKISTOFA_POWERBI_TENANT_ID',
      FORM_SYSTEM_GOOGLE_TRANSLATE_API_KEY:
        '/k8s/form-system/FORM_SYSTEM_GOOGLE_TRANSLATE_API_KEY',
      NATIONAL_REGISTRY_B2C_CLIENT_SECRET:
        '/k8s/api/NATIONAL_REGISTRY_B2C_CLIENT_SECRET',
      HSN_WEB_FORM_RESPONSE_URL: '/k8s/api/HSN_WEB_FORM_RESPONSE_URL',
      HSN_WEB_FORM_RESPONSE_SECRET: '/k8s/api/HSN_WEB_FORM_RESPONSE_SECRET',
      DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_PUBLIC_RSA_KEY:
        '/k8s/api/DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_PUBLIC_RSA_KEY',
      DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_PRIVATE_RSA_KEY:
        '/k8s/api/DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_PRIVATE_RSA_KEY',
      DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_PUBLIC_IBM_KEY:
        '/k8s/api/DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_PUBLIC_IBM_KEY',
      CHART_STATISTIC_SOURCE_DATA_PATHS:
        '/k8s/api/CHART_STATISTIC_SOURCE_DATA_PATHS',
      CHART_STATISTIC_CACHE_TTL: '/k8s/api/CHART_STATISTIC_CACHE_TTL',
      WATSON_ASSISTANT_CHAT_FEEDBACK_URL:
        '/k8s/api/WATSON_ASSISTANT_CHAT_FEEDBACK_URL',
      WATSON_ASSISTANT_CHAT_FEEDBACK_API_KEY:
        '/k8s/api/WATSON_ASSISTANT_CHAT_FEEDBACK_API_KEY',
      LICENSE_SERVICE_BARCODE_SECRET_KEY:
        '/k8s/api/LICENSE_SERVICE_BARCODE_SECRET_KEY',
      ULTRAVIOLET_RADIATION_API_KEY: '/k8s/api/ULTRAVIOLET_RADIATION_API_KEY',
      UMBODSMADUR_SKULDARA_COST_OF_LIVING_CALCULATOR_API_URL:
        '/k8s/api/UMBODSMADUR_SKULDARA_COST_OF_LIVING_CALCULATOR_API_URL',
      VINNUEFTIRLITID_CAMPAIGN_MONITOR_API_KEY:
        '/k8s/api/VINNUEFTIRLITID_CAMPAIGN_MONITOR_API_KEY',
      PAYMENTS_VERIFICATION_CALLBACK_SIGNING_SECRET:
        '/k8s/payments/PAYMENTS_VERIFICATION_CALLBACK_SIGNING_SECRET',
      VERDICTS_GOPRO_USERNAME: '/k8s/api/VERDICTS_GOPRO_USERNAME',
      VERDICTS_GOPRO_PASSWORD: '/k8s/api/VERDICTS_GOPRO_PASSWORD',
      HMS_CONTRACTS_AUTH_CLIENT_SECRET:
        '/k8s/application-system-api/HMS_CONTRACTS_AUTH_CLIENT_SECRET',
      LANDSPITALI_PAYMENT_NATIONAL_ID_FALLBACK:
        '/k8s/api/LANDSPITALI_PAYMENT_NATIONAL_ID_FALLBACK',
      LANDSPITALI_PAYMENT_ORGANISATION_ID:
        '/k8s/api/LANDSPITALI_PAYMENT_ORGANISATION_ID',
      VERDICTS_SUPREME_COURT_BEARER_TOKEN:
        '/k8s/api/VERDICTS_SUPREME_COURT_BEARER_TOKEN',
      FINANCIAL_MANAGEMENT_AUTHORITY_BASE_PATH:
        '/k8s/api/FINANCIAL_MANAGEMENT_AUTHORITY_BASE_PATH',
      FINANCIAL_MANAGEMENT_AUTHORITY_CLIENT_ID:
        '/k8s/api/FINANCIAL_MANAGEMENT_AUTHORITY_CLIENT_ID',
      FINANCIAL_MANAGEMENT_AUTHORITY_CLIENT_SECRET:
        '/k8s/api/FINANCIAL_MANAGEMENT_AUTHORITY_CLIENT_SECRET',
      FINANCIAL_MANAGEMENT_AUTHORITY_SCOPE:
        '/k8s/api/FINANCIAL_MANAGEMENT_AUTHORITY_SCOPE',
      FINANCIAL_MANAGEMENT_AUTHORITY_AUTHENTICATION_SERVER:
        '/k8s/api/FINANCIAL_MANAGEMENT_AUTHORITY_AUTHENTICATION_SERVER',
    })
    .xroad(
      AdrAndMachine,
      JudicialAdministration,
      PoliceCases,
      Firearm,
      Disability,
      Base,
      Client,
      OccupationalLicenses,
      HealthInsurance,
      IntellectualProperties,
      Inna,
      Labor,
      DrivingLicense,
      Payment,
      NVSPermits,
      DistrictCommissionersPCard,
      DistrictCommissionersLicenses,
      Finance,
      FireCompensation,
      Education,
      NationalRegistry,
      Properties,
      PropertySearch,
      RentalService,
      PaymentSchedule,
      CriminalRecord,
      RskCompanyInfo,
      DrivingLicenseBook,
      FishingLicense,
      MunicipalitiesFinancialAid,
      Vehicles,
      VehiclesMileage,
      Passports,
      VehicleServiceFjsV1,
      TransportAuthority,
      ChargeFjsV2,
      EnergyFunds,
      UniversityCareers,
      WorkMachines,
      IcelandicGovernmentInstitutionVacancies,
      RskProcuring,
      RskCarRentalRate,
      NationalRegistryB2C,
      AircraftRegistry,
      HousingBenefitCalculator,
      ShipRegistry,
      DirectorateOfImmigration,
      SignatureCollection,
      SocialInsuranceAdministration,
      OfficialJournalOfIceland,
      JudicialSystemServicePortal,
      OfficialJournalOfIcelandApplication,
      LegalGazette,
      Frigg,
      HealthDirectorateOrganDonation,
      HealthDirectorateVaccination,
      HealthDirectorateHealthService,
      WorkAccidents,
      SeminarsVer,
      SecondarySchool,
      LSH,
      PracticalExams,
      VMSTUnemployment,
      GoProVerdicts,
    )
    .ingress({
      primary: {
        host: {
          dev: ['beta', 'api-catalogue'],
          staging: ['beta'],
          prod: ['', 'www.island.is'],
        },
        paths: ['/api'],
        public: true,
      },
    })
    .readiness('/health')
    .liveness({
      path: '/liveness',
      initialDelaySeconds: 10,
      timeoutSeconds: 5,
    })
    .resources({
      limits: { cpu: '1200m', memory: '2500Mi' },
      requests: { cpu: '900m', memory: '2000Mi' },
    })
    .replicaCount({
      default: 3,
      max: 50,
      min: 3,
      cpuAverageUtilization: 70,
    })
    .grantNamespaces(
      'nginx-ingress-external',
      'api-catalogue',
      'application-system',
      'consultation-portal',
      'portals-admin',
      'service-portal',
      'portals-my-pages',
      'services-payments',
      'payments',
    )
}
