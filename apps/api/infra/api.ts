import { ref, service, ServiceBuilder } from '../../../infra/src/dsl/dsl'
import { settings } from '../../../infra/src/dsl/settings'

export const serviceSetup = (services: {
  appSystemApi: ServiceBuilder<'application-system-api'>
  servicePortalApi: ServiceBuilder<'service-portal-api'>
  icelandicNameRegistryBackend: ServiceBuilder<'icelandic-names-registry-backend'>
  documentsService: ServiceBuilder<'services-documents'>
  servicesEndorsementApi: ServiceBuilder<'services-endorsement-api'>
  servicesTemporaryVoterRegistryApi: ServiceBuilder<'services-temporary-voter-registry-api'>
  servicesPartyLetterRegistryApi: ServiceBuilder<'services-party-letter-registry-api'>
}): ServiceBuilder<'api'> => {
  return service('api')
    .namespace('islandis')
    .serviceAccount()
    .command('node')
    .args('--tls-min-v1.0', 'main.js')

    .env({
      APPLICATION_SYSTEM_API_URL: ref(
        (h) => `http://${h.svc(services.appSystemApi)}`,
      ),
      ICELANDIC_NAMES_REGISTRY_BACKEND_URL: ref(
        (h) => `http://${h.svc(services.icelandicNameRegistryBackend)}`,
      ),
      FILE_STORAGE_UPLOAD_BUCKET: {
        dev: 'island-is-dev-upload-api',
        staging: 'island-is-staging-upload-api',
        prod: 'island-is-prod-upload-api',
      },
      AUTH_PUBLIC_API_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
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
      XROAD_BASE_PATH_WITH_ENV: {
        dev: 'http://securityserver.dev01.devland.is/r1/IS-DEV',
        staging: 'http://securityserver.staging01.devland.is/r1/IS-TEST',
        prod: 'http://securityserver.island.is/r1/IS',
      },
      XROAD_BASE_PATH: {
        dev: 'http://securityserver.dev01.devland.is',
        staging: 'http://securityserver.staging01.devland.is',
        prod: 'http://securityserver.island.is',
      },
      XROAD_VMST_MEMBER_CODE: {
        dev: '10003',
        staging: '7005942039',
        prod: '7005942039',
      },
      XROAD_CLIENT_ID: {
        dev: 'IS-DEV/GOV/10000/island-is-client',
        staging: 'IS-TEST/GOV/5501692829/island-is-client',
        prod: 'IS/GOV/5501692829/island-is-client',
      },
      XROAD_HEALTH_INSURANCE_ID: {
        dev: 'IS-DEV/GOV/10007/SJUKRA-Protected',
        staging: 'IS-TEST/GOV/4804080550/SJUKRA-Protected',
        prod: 'IS/GOV/4804080550/SJUKRA-Protected',
      },
      XROAD_MMS_LICENSE_SERVICE_ID: {
        dev: 'IS-DEV/EDU/10020/MMS-Protected/license-api-v1',
        staging: 'IS-TEST/EDU/5708150320/MMS-Protected/license-api-v1',
        prod: 'IS/EDU/5708150320/MMS-Protected/license-api-v1',
      },
      XROAD_MMS_GRADE_SERVICE_ID: {
        dev: 'IS-DEV/EDU/10020/MMS-Protected/grade-api-v1',
        staging: 'IS-TEST/EDU/5708150320/MMS-Protected/grade-api-v1',
        prod: 'IS/EDU/5708150320/MMS-Protected/grade-api-v1',
      },
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
      XROAD_TJODSKRA_MEMBER_CODE: {
        prod: '6503760649',
        dev: '10001',
        staging: '6503760649',
      },
      ENDORSEMENT_SYSTEM_BASE_API_URL: ref(
        (h) => `http://${h.svc(services.servicesEndorsementApi)}`,
      ),
      TEMPORARY_VOTER_REGISTRY_BASE_API_URL: ref(
        (h) => `http://${h.svc(services.servicesTemporaryVoterRegistryApi)}`,
      ),
      PARTY_LETTER_REGISTRY_BASE_API_URL: ref(
        (h) => `http://${h.svc(services.servicesPartyLetterRegistryApi)}`,
      ),
    })

    .secrets({
      SOFFIA_SOAP_URL: '/k8s/api/SOFFIA_SOAP_URL',
      DOCUMENT_PROVIDER_BASE_PATH: '/k8s/api/DOCUMENT_PROVIDER_BASE_PATH',
      DOCUMENT_PROVIDER_TOKEN_URL: '/k8s/api/DOCUMENT_PROVIDER_TOKEN_URL',
      DOCUMENT_PROVIDER_BASE_PATH_TEST:
        '/k8s/api/DOCUMENT_PROVIDER_BASE_PATH_TEST',
      DOCUMENT_PROVIDER_TOKEN_URL_TEST:
        '/k8s/api/DOCUMENT_PROVIDER_TOKEN_URL_TEST',
      DRIVING_LICENSE_XROAD_PATH: '/k8s/api/DRIVING_LICENSE_XROAD_PATH',
      DRIVING_LICENSE_SECRET: '/k8s/api/DRIVING_LICENSE_SECRET',
      HEALTH_INSURANCE_XROAD_WSDLURL: '/k8s/api/HEALTH_INSURANCE_XROAD_WSDLURL',
      SYSLUMENN_HOST: '/k8s/api/SYSLUMENN_HOST',
      REGULATIONS_API_URL: '/k8s/api/REGULATIONS_API_URL',
      SOFFIA_HOST_URL: '/k8s/api/SOFFIA_HOST_URL',
      XROAD_VMST_API_PATH: '/k8s/api/XROAD_VMST_API_PATH',
      XROAD_TJODSKRA_API_PATH: '/k8s/api/XROAD_TJODSKRA_API_PATH',
      CONTENTFUL_ACCESS_TOKEN: '/k8s/api/CONTENTFUL_ACCESS_TOKEN',
      ZENDESK_CONTACT_FORM_EMAIL: '/k8s/api/ZENDESK_CONTACT_FORM_EMAIL',
      ZENDESK_CONTACT_FORM_TOKEN: '/k8s/api/ZENDESK_CONTACT_FORM_TOKEN',
      SOFFIA_USER: settings.SOFFIA_USER,
      SOFFIA_PASS: settings.SOFFIA_PASS,
      HEALTH_INSURANCE_XROAD_USERNAME: '/k8s/health-insurance/XROAD-USER',
      HEALTH_INSURANCE_XROAD_PASSWORD: '/k8s/health-insurance/XROAD-PASSWORD',
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
      VMST_API_KEY: '/k8s/vmst-client/VMST_API_KEY',
      SYSLUMENN_USERNAME: '/k8s/api/SYSLUMENN_USERNAME',
      SYSLUMENN_PASSWORD: '/k8s/api/SYSLUMENN_PASSWORD',
      DOCUMENT_PROVIDER_ADMINS:
        '/k8s/documentprovider/DOCUMENT_PROVIDER_ADMINS',
      XROAD_FINANCES_PATH: '/k8s/service-portal/XROAD_FINANCES_PATH',
      PKPASS_API_KEY: '/k8s/api/PKPASS_API_KEY',
      PKPASS_API_URL: '/k8s/api/PKPASS_API_URL',
      PKPASS_AUTH_RETRIES: '/k8s/api/PKPASS_AUTH_RETRIES',
      PKPASS_CACHE_KEY: '/k8s/api/PKPASS_CACHE_KEY',
      PKPASS_CACHE_TOKEN_EXPIRY_DELTA: '/k8s/api/PKPASS_CACHE_TOKEN_EXPIRY_DELTA',
      PKPASS_SECRET_KEY: '/k8s/api/PKPASS_SECRET_KEY',
      PAYMENT_XROAD_PROVIDER_ID:
        '/k8s/application-system-api/PAYMENT_XROAD_PROVIDER_ID',
      PAYMENT_USER: '/k8s/application-system-api/PAYMENT_USER',
      PAYMENT_PASSWORD: '/k8s/application-system-api/PAYMENT_PASSWORD',
      RSK_API_USERNAME: '/k8s/shared/api/RSK_API_USERNAME',
      RSK_API_PASSWORD: '/k8s/shared/api/RSK_API_PASSWORD',
      RSK_API_URL: '/k8s/shared/api/RSK_API_URL',
      PAYMENT_SCHEDULE_USER: '/k8s/api/PAYMENT_SCHEDULE_USER',
      PAYMENT_SCHEDULE_PASSWORD: '/k8s/api/PAYMENT_SCHEDULE_PASSWORD',
      PAYMENT_SCHEDULE_XROAD_PROVIDER_ID:
        '/k8s/api/PAYMENT_SCHEDULE_XROAD_PROVIDER_ID',
    })

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
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '100m', memory: '256Mi' },
    })
    .grantNamespaces(
      'nginx-ingress-external',
      'api-catalogue',
      'application-system',
    )
}
