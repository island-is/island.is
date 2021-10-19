import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const postgresInfo = {
  passwordSecret: '/k8s/application-system/api/DB_PASSWORD',
}
export const serviceSetup = (services: {
  documentsService: ServiceBuilder<'services-documents'>
  servicesEndorsementApi: ServiceBuilder<'services-endorsement-api'>
  servicesPartyLetterRegistryApi: ServiceBuilder<'services-party-letter-registry-api'>
}): ServiceBuilder<'application-system-api'> =>
  service('application-system-api')
    .namespace('application-system')
    .serviceAccount('application-system-api')
    .env({
      EMAIL_REGION: 'eu-west-1',
      REDIS_URL_NODE_01: {
        dev:
          'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
        staging:
          'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
        prod:
          'clustercfg.general-redis-cluster-group.whakos.euw1.cache.amazonaws.com:6379',
      },
      CONTENTFUL_HOST: {
        dev: 'preview.contentful.com',
        staging: 'cdn.contentful.com',
        prod: 'cdn.contentful.com',
      },
      CLIENT_LOCATION_ORIGIN: {
        dev: 'https://beta.dev01.devland.is/umsoknir',
        staging: 'https://beta.staging01.devland.is/umsoknir',
        prod: 'https://island.is/umsoknir',
      },
      APPLICATION_ATTACHMENT_BUCKET: {
        dev: 'island-is-dev-storage-application-system',
        staging: 'island-is-staging-storage-application-system',
        prod: 'island-is-prod-storage-application-system',
      },
      FILE_STORAGE_UPLOAD_BUCKET: {
        dev: 'island-is-dev-upload-api',
        staging: 'island-is-staging-upload-api',
        prod: 'island-is-prod-upload-api',
      },
      FILE_SERVICE_PRESIGN_BUCKET: {
        dev: 'island-is-dev-fs-presign-bucket',
        staging: 'island-is-staging-fs-presign-bucket',
        prod: 'island-is-prod-fs-presign-bucket',
      },
      GRAPHQL_API_URL: 'http://web-api.islandis.svc.cluster.local',
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
      INSTITUTION_APPLICATION_RECIPIENT_EMAIL_ADDRESS: {
        dev: 'gunnar.ingi@fjr.is',
        staging: 'gunnar.ingi@fjr.is',
        prod: 'island@island.is',
      },
      INSTITUTION_APPLICATION_RECIPIENT_NAME: {
        dev: 'Gunnar Ingi',
        staging: 'Gunnar Ingi',
        prod: 'Stafrænt Ísland',
      },
      FUNDING_GOVERNMENT_PROJECTS_APPLICATION_RECIPIENT_EMAIL_ADDRESS: {
        dev: 'gunnar.ingi@fjr.is',
        staging: 'gunnar.ingi@fjr.is',
        prod: 'island@island.is',
      },
      FUNDING_GOVERNMENT_PROJECTS_APPLICATION_RECIPIENT_NAME: {
        dev: 'Gunnar Ingi',
        staging: 'Gunnar Ingi',
        prod: 'Stafrænt Ísland',
      },
      LOGIN_SERVICE_APPLICATION_RECIPIENT_EMAIL_ADDRESS: {
        dev: 'gunnar.ingi@fjr.is',
        staging: 'gunnar.ingi@fjr.is',
        prod: 'island@island.is',
      },
      LOGIN_SERVICE_APPLICATION_RECIPIENT_NAME: {
        dev: 'Gunnar Ingi',
        staging: 'Gunnar Ingi',
        prod: 'Stafrænt Ísland',
      },
      NOVA_USERNAME: {
        dev: 'IslandIs_User_Development',
        prod: 'IslandIs_User_Production',
        staging: 'IslandIs_User_Development',
      },
      SERVICE_DOCUMENTS_BASEPATH: ref(
        (h) => `http://${h.svc(services.documentsService)}`,
      ),
      PARTY_LETTER_SUBMISSION_DESTINATION_EMAIL: {
        dev: 'thorhildur@parallelradgjof.is',
        staging: 'thorhildur@parallelradgjof.is',
        prod: 'postur@dmr.is',
      },
      ENDORSEMENTS_API_BASE_PATH: ref(
        (h) => `http://${h.svc(services.servicesEndorsementApi)}`,
      ),
      PARTY_LETTER_REGISTRY_API_BASE_PATH: ref(
        (h) => `http://${h.svc(services.servicesPartyLetterRegistryApi)}`,
      ),
    })
    .secrets({
      NOVA_URL: '/k8s/application-system-api/NOVA_URL',
      HEALTH_INSURANCE_XROAD_WSDLURL:
        '/k8s/application-system-api/HEALTH_INSURANCE_XROAD_WSDLURL',
      XROAD_VMST_API_PATH: '/k8s/application-system-api/XROAD_VMST_API_PATH',
      DOKOBIT_URL: '/k8s/application-system-api/DOKOBIT_URL',
      SYSLUMENN_HOST: '/k8s/application-system-api/SYSLUMENN_HOST',
      CONTENTFUL_ACCESS_TOKEN: '/k8s/api/CONTENTFUL_ACCESS_TOKEN',
      AUTH_JWT_SECRET: '/k8s/application-system/api/AUTH_JWT_SECRET',
      DOKOBIT_ACCESS_TOKEN: '/k8s/application-system/api/DOKOBIT_ACCESS_TOKEN',
      EMAIL_FROM: '/k8s/application-system/api/EMAIL_FROM',
      EMAIL_FROM_NAME: '/k8s/application-system/api/EMAIL_FROM_NAME',
      EMAIL_REPLY_TO: '/k8s/application-system/api/EMAIL_REPLY_TO',
      EMAIL_REPLY_TO_NAME: '/k8s/application-system/api/EMAIL_REPLY_TO_NAME',
      VMST_API_KEY: '/k8s/vmst-client/VMST_API_KEY',
      DOCUMENT_PROVIDER_ONBOARDING_REVIEWER:
        '/k8s/application-system/api/DOCUMENT_PROVIDER_ONBOARDING_REVIEWER',
      HEALTH_INSURANCE_XROAD_USERNAME: '/k8s/health-insurance/XROAD-USER',
      HEALTH_INSURANCE_XROAD_PASSWORD: '/k8s/health-insurance/XROAD-PASSWORD',
      SYSLUMENN_USERNAME: '/k8s/application-system/api/SYSLUMENN_USERNAME',
      SYSLUMENN_PASSWORD: '/k8s/application-system/api/SYSLUMENN_PASSWORD',
      NOVA_PASSWORD: '/k8s/application-system/api/NOVA_PASSWORD',
      PAYMENT_XROAD_PROVIDER_ID:
        '/k8s/application-system-api/PAYMENT_XROAD_PROVIDER_ID',
      PAYMENT_USER: '/k8s/application-system-api/PAYMENT_USER',
      PAYMENT_PASSWORD: '/k8s/application-system-api/PAYMENT_PASSWORD',
      PAYMENT_BASE_CALLBACK_URL:
        '/k8s/application-system-api/PAYMENT_BASE_CALLBACK_URL',
      PAYMENT_ADDITION_CALLBACK_URL:
        '/k8s/application-system-api/PAYMENT_ADDITION_CALLBACK_URL',
      ARK_BASE_URL: '/k8s/application-system-api/ARK_BASE_URL',

      PARTY_APPLICATION_RVK_SOUTH_ASSIGNED_ADMINS:
        '/k8s/application-system/api/PARTY_APPLICATION_RVK_SOUTH_ASSIGNED_ADMINS',
      PARTY_APPLICATION_RVK_NORTH_ASSIGNED_ADMINS:
        '/k8s/application-system/api/PARTY_APPLICATION_RVK_NORTH_ASSIGNED_ADMINS',
      PARTY_APPLICATION_SOUTH_WEST_ASSIGNED_ADMINS:
        '/k8s/application-system/api/PARTY_APPLICATION_SOUTH_WEST_ASSIGNED_ADMINS',
      PARTY_APPLICATION_NORTH_WEST_ASSIGNED_ADMINS:
        '/k8s/application-system/api/PARTY_APPLICATION_NORTH_WEST_ASSIGNED_ADMINS',
      PARTY_APPLICATION_NORTH_ASSIGNED_ADMINS:
        '/k8s/application-system/api/PARTY_APPLICATION_NORTH_ASSIGNED_ADMINS',
      PARTY_APPLICATION_SOUTH_ASSIGNED_ADMINS:
        '/k8s/application-system/api/PARTY_APPLICATION_SOUTH_ASSIGNED_ADMINS',
      PARTY_LETTER_ASSIGNED_ADMINS:
        '/k8s/application-system/api/PARTY_LETTER_ASSIGNED_ADMINS',

      PARTY_APPLICATION_RVK_SOUTH_ADMIN_EMAIL:
        '/k8s/application-system/api/PARTY_APPLICATION_RVK_SOUTH_ADMIN_EMAIL',
      PARTY_APPLICATION_RVK_NORTH_ADMIN_EMAIL:
        '/k8s/application-system/api/PARTY_APPLICATION_RVK_NORTH_ADMIN_EMAIL',
      PARTY_APPLICATION_SOUTH_WEST_ADMIN_EMAIL:
        '/k8s/application-system/api/PARTY_APPLICATION_SOUTH_WEST_ADMIN_EMAIL',
      PARTY_APPLICATION_NORTH_WEST_ADMIN_EMAIL:
        '/k8s/application-system/api/PARTY_APPLICATION_NORTH_WEST_ADMIN_EMAIL',
      PARTY_APPLICATION_NORTH_ADMIN_EMAIL:
        '/k8s/application-system/api/PARTY_APPLICATION_NORTH_ADMIN_EMAIL',
      PARTY_APPLICATION_SOUTH_ADMIN_EMAIL:
        '/k8s/application-system/api/PARTY_APPLICATION_SOUTH_ADMIN_EMAIL',
      DRIVING_LICENSE_SECRET:
        '/k8s/application-system/api/DRIVING_LICENSE_SECRET',
      DRIVING_LICENSE_XROAD_PATH:
        '/k8s/application-system/api/DRIVING_LICENSE_XROAD_PATH',
      DRIVING_LICENSE_XROAD_PATH_V2:
        '/k8s/application-system/api/DRIVING_LICENSE_XROAD_PATH_V2',
    })
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
      postgres: postgresInfo,
    })
    .postgres(postgresInfo)
    .liveness('/liveness')
    .readiness('/liveness')
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '100m', memory: '256Mi' },
    })
    .ingress({
      primary: {
        host: {
          dev: 'application-payment-callback-xrd',
          staging: 'application-payment-callback-xrd',
          prod: 'application-payment-callback-xrd',
        },
        paths: ['/application-payment'],
        public: false,
      },
    })
    .grantNamespaces('nginx-ingress-internal', 'islandis')
