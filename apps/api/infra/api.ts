import { ref, service, ServiceBuilder } from '../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  DrivingLicense,
  Education,
  Finance,
  HealthInsurance,
  Labor,
  NationalRegistry,
  Passports,
  Payment,
  Properties,
  PaymentSchedule,
  CriminalRecord,
  RskCompanyInfo,
  DrivingLicenseBook,
  FishingLicense,
  MunicipalitiesFinancialAid,
  Vehicles,
  AdrAndMachine,
  Firearm,
  DisabilityLicense,
  VehicleServiceFjsV1,
  TransportAuthority,
  ChargeFjsV2,
} from '../../../infra/src/dsl/xroad'
import { settings } from '../../../infra/src/dsl/settings'
import { MissingSetting } from '../../../infra/src/dsl/types/input-types'

export const serviceSetup = (services: {
  appSystemApi: ServiceBuilder<'application-system-api'>
  servicePortalApi: ServiceBuilder<'service-portal-api'>
  icelandicNameRegistryBackend: ServiceBuilder<'icelandic-names-registry-backend'>
  documentsService: ServiceBuilder<'services-documents'>
  servicesEndorsementApi: ServiceBuilder<'services-endorsement-api'>
  airDiscountSchemeBackend: ServiceBuilder<'air-discount-scheme-backend'>
}): ServiceBuilder<'api'> => {
  return service('api')
    .namespace('islandis')
    .serviceAccount()
    .command('node')
    .args('--tls-min-v1.0', '--no-experimental-fetch', 'main.js')

    .env({
      APPLICATION_SYSTEM_API_URL: ref(
        (h) => `http://${h.svc(services.appSystemApi)}`,
      ),
      ICELANDIC_NAMES_REGISTRY_BACKEND_URL: ref(
        (h) => `http://${h.svc(services.icelandicNameRegistryBackend)}`,
      ),
      AIR_DISCOUNT_SCHEME_BACKEND_URL: ref(
        (h) => `http://${h.svc(services.airDiscountSchemeBackend)}`,
      ),
      AIR_DISCOUNT_SCHEME_FRONTEND_HOSTNAME: {
        dev: ref((h) => h.svc('loftbru.dev01.devland.is')),
        staging: ref((h) => h.svc('loftbru.staging01.devland.is')),
        prod: ref((h) => h.svc('loftbru.island.is')),
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
        dev:
          'https://vpc-search-njkekqydiegezhr4vqpkfnw5la.eu-west-1.es.amazonaws.com',
        staging:
          'https://vpc-search-q6hdtjcdlhkffyxvrnmzfwphuq.eu-west-1.es.amazonaws.com/',
        prod:
          'https://vpc-search-mw4w5c2m2g5edjrtvwbpzhkw24.eu-west-1.es.amazonaws.com/',
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
      SERVICE_USER_PROFILE_URL: ref(
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
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/api',
      AIR_DISCOUNT_SCHEME_CLIENT_TIMEOUT: '20000',
      XROAD_NATIONAL_REGISTRY_TIMEOUT: '20000',
      XROAD_PROPERTIES_TIMEOUT: '20000',
      SYSLUMENN_TIMEOUT: '40000',
      XROAD_DRIVING_LICENSE_BOOK_TIMEOUT: '20000',
      XROAD_FINANCES_TIMEOUT: '20000',
      XROAD_CHARGE_FJS_V2_TIMEOUT: '20000',
      AUTH_DELEGATION_API_URL: {
        dev:
          'http://web-services-auth-delegation-api.identity-server-delegation.svc.cluster.local',
        staging:
          'http://web-services-auth-delegation-api.identity-server-delegation.svc.cluster.local',
        prod: 'https://auth-delegation-api.internal.innskra.island.is',
      },
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      MUNICIPALITIES_FINANCIAL_AID_BACKEND_URL: {
        dev: 'http://web-financial-aid-backend',
        staging: 'http://web-financial-aid-backend',
        prod: 'http://web-financial-aid-backend',
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
      ELECTRONIC_REGISTRATION_STATISTICS_API_URL: {
        dev: 'https://api-staging.thinglysing.is/business/tolfraedi',
        staging: 'https://api-staging.thinglysing.is/business/tolfraedi',
        prod: 'https://api.thinglysing.is/business/tolfraedi',
      },
      NO_UPDATE_NOTIFIER: 'true',
      FISKISTOFA_ZENTER_CLIENT_ID: '1114',
      SOFFIA_SOAP_URL: {
        dev: ref((h) => h.svc('https://soffiaprufa.skra.is')),
        staging: ref((h) => h.svc('https://soffiaprufa.skra.is')),
        prod: ref((h) => h.svc('https://soffia2.skra.is')),
        local: ref((h) => h.svc('https://localhost:8443')),
      },
      HSN_WEB_FORM_ID: '1dimJFHLFYtnhoYEA3JxRK',
    })

    .secrets({
      DOCUMENT_PROVIDER_BASE_PATH: '/k8s/api/DOCUMENT_PROVIDER_BASE_PATH',
      DOCUMENT_PROVIDER_TOKEN_URL: '/k8s/api/DOCUMENT_PROVIDER_TOKEN_URL',
      DOCUMENT_PROVIDER_BASE_PATH_TEST:
        '/k8s/api/DOCUMENT_PROVIDER_BASE_PATH_TEST',
      DOCUMENT_PROVIDER_TOKEN_URL_TEST:
        '/k8s/api/DOCUMENT_PROVIDER_TOKEN_URL_TEST',
      SYSLUMENN_HOST: '/k8s/api/SYSLUMENN_HOST',
      REGULATIONS_API_URL: '/k8s/api/REGULATIONS_API_URL',
      SOFFIA_HOST_URL: '/k8s/api/SOFFIA_HOST_URL',
      CONTENTFUL_ACCESS_TOKEN: '/k8s/api/CONTENTFUL_ACCESS_TOKEN',
      ZENDESK_CONTACT_FORM_EMAIL: '/k8s/api/ZENDESK_CONTACT_FORM_EMAIL',
      ZENDESK_CONTACT_FORM_TOKEN: '/k8s/api/ZENDESK_CONTACT_FORM_TOKEN',
      SOFFIA_USER: settings.SOFFIA_USER,
      SOFFIA_PASS: settings.SOFFIA_PASS,
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
      SYSLUMENN_USERNAME: '/k8s/api/SYSLUMENN_USERNAME',
      SYSLUMENN_PASSWORD: '/k8s/api/SYSLUMENN_PASSWORD',
      DOCUMENT_PROVIDER_ADMINS:
        '/k8s/documentprovider/DOCUMENT_PROVIDER_ADMINS',
      PKPASS_API_KEY: '/k8s/api/PKPASS_API_KEY',
      PKPASS_API_URL: '/k8s/api/PKPASS_API_URL',
      PKPASS_AUTH_RETRIES: '/k8s/api/PKPASS_AUTH_RETRIES',
      PKPASS_CACHE_KEY: '/k8s/api/PKPASS_CACHE_KEY',
      PKPASS_CACHE_TOKEN_EXPIRY_DELTA:
        '/k8s/api/PKPASS_CACHE_TOKEN_EXPIRY_DELTA',
      PKPASS_SECRET_KEY: '/k8s/api/PKPASS_SECRET_KEY',
      VE_PKPASS_API_KEY: '/k8s/api/VE_PKPASS_API_KEY',
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
      ISLYKILL_SERVICE_PASSPHRASE: '/k8s/api/ISLYKILL_SERVICE_PASSPHRASE',
      ISLYKILL_SERVICE_BASEPATH: '/k8s/api/ISLYKILL_SERVICE_BASEPATH',
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
      HSN_WEB_FORM_RESPONSE_URL: '/k8s/api/HSN_WEB_FORM_RESPONSE_URL',
      HSN_WEB_FORM_RESPONSE_SECRET: '/k8s/api/HSN_WEB_FORM_RESPONSE_SECRET',
    })
    .xroad(
      AdrAndMachine,
      Firearm,
      DisabilityLicense,
      Base,
      Client,
      HealthInsurance,
      Labor,
      DrivingLicense,
      Payment,
      Finance,
      Education,
      NationalRegistry,
      Properties,
      PaymentSchedule,
      CriminalRecord,
      RskCompanyInfo,
      DrivingLicenseBook,
      FishingLicense,
      MunicipalitiesFinancialAid,
      Vehicles,
      Passports,
      VehicleServiceFjsV1,
      TransportAuthority,
      ChargeFjsV2,
    )
    .files({ filename: 'islyklar.p12', env: 'ISLYKILL_CERT' })
    .ingress({
      primary: {
        host: {
          dev: ['beta', 'api-catalogue'],
          staging: ['beta'],
          prod: ['', 'www.island.is'],
        },
        paths: ['/api'],
        extraAnnotations: {
          dev: {},
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: {},
        },
        public: true,
      },
    })
    .readiness('/health')
    .liveness('/liveness')
    .resources({
      limits: { cpu: '800m', memory: '2048Mi' },
      requests: { cpu: '200m', memory: '1024Mi' },
    })
    .replicaCount({
      default: 10,
      max: 50,
      min: 10,
    })
    .grantNamespaces(
      'nginx-ingress-external',
      'api-catalogue',
      'application-system',
    )
}
