import {
  Base,
  Client,
  HealthInsurance,
  Labor,
  Payment,
} from '../../../../infra/src/dsl/xroad'
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
    .xroad(Base, Client, Labor, HealthInsurance, Payment)
    .secrets({
      NOVA_URL: '/k8s/application-system-api/NOVA_URL',
      DOKOBIT_URL: '/k8s/application-system-api/DOKOBIT_URL',
      SYSLUMENN_HOST: '/k8s/application-system-api/SYSLUMENN_HOST',
      CONTENTFUL_ACCESS_TOKEN: '/k8s/api/CONTENTFUL_ACCESS_TOKEN',
      AUTH_JWT_SECRET: '/k8s/application-system/api/AUTH_JWT_SECRET',
      DOKOBIT_ACCESS_TOKEN: '/k8s/application-system/api/DOKOBIT_ACCESS_TOKEN',
      EMAIL_FROM: '/k8s/application-system/api/EMAIL_FROM',
      EMAIL_FROM_NAME: '/k8s/application-system/api/EMAIL_FROM_NAME',
      EMAIL_REPLY_TO: '/k8s/application-system/api/EMAIL_REPLY_TO',
      EMAIL_REPLY_TO_NAME: '/k8s/application-system/api/EMAIL_REPLY_TO_NAME',
      DOCUMENT_PROVIDER_ONBOARDING_REVIEWER:
        '/k8s/application-system/api/DOCUMENT_PROVIDER_ONBOARDING_REVIEWER',
      SYSLUMENN_USERNAME: '/k8s/application-system/api/SYSLUMENN_USERNAME',
      SYSLUMENN_PASSWORD: '/k8s/application-system/api/SYSLUMENN_PASSWORD',
      NOVA_PASSWORD: '/k8s/application-system/api/NOVA_PASSWORD',
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
