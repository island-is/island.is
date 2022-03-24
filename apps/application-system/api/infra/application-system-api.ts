import {
  Base,
  Client,
  DrivingLicense,
  HealthInsurance,
  Labor,
  Payment,
  PaymentSchedule,
  CriminalRecord,
  DataProtectionComplaint,
  NationalRegistry,
} from '../../../../infra/src/dsl/xroad'
import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import { PostgresInfo } from '../../../../infra/src/dsl/types/input-types'

const postgresInfo: PostgresInfo = {
  passwordSecret: '/k8s/application-system/api/DB_PASSWORD',
  name: 'application_system_api',
  username: 'application_system_api',
}

const namespace = 'application-system'
const serviceAccount = 'application-system-api'
export const workerSetup = (): ServiceBuilder<'application-system-api-worker'> =>
  service('application-system-api-worker')
    .namespace(namespace)
    .image('application-system-api')
    .postgres(postgresInfo)
    .serviceAccount('application-system-api-worker')
    .env({
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/application-system',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      REDIS_URL_NODE_01: {
        dev:
          'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
        staging:
          'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
        prod:
          'clustercfg.general-redis-cluster-group.whakos.euw1.cache.amazonaws.com:6379',
      },
    })
    .xroad(Base, Client)
    .secrets({
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/application-system/api/IDENTITY_SERVER_CLIENT_SECRET',
      SYSLUMENN_HOST: '/k8s/application-system-api/SYSLUMENN_HOST',
      SYSLUMENN_USERNAME: '/k8s/application-system/api/SYSLUMENN_USERNAME',
      SYSLUMENN_PASSWORD: '/k8s/application-system/api/SYSLUMENN_PASSWORD',
      DRIVING_LICENSE_BOOK_XROAD_PATH:
        '/k8s/application-system-api/DRIVING_LICENSE_BOOK_XROAD_PATH',
      DRIVING_LICENSE_BOOK_USERNAME:
        '/k8s/application-system-api/DRIVING_LICENSE_BOOK_USERNAME',
      DRIVING_LICENSE_BOOK_PASSWORD:
        '/k8s/application-system-api/DRIVING_LICENSE_BOOK_PASSWORD',
    })
    .args('main.js', '--job', 'worker')
    .command('node')
    .extraAttributes({
      dev: { schedule: '*/30 * * * *' },
      staging: { schedule: '*/30 * * * *' },
      prod: { schedule: '*/30 * * * *' },
    })

export const serviceSetup = (services: {
  documentsService: ServiceBuilder<'services-documents'>
  servicesEndorsementApi: ServiceBuilder<'services-endorsement-api'>
}): ServiceBuilder<'application-system-api'> =>
  service('application-system-api')
    .namespace(namespace)
    .serviceAccount(serviceAccount)
    .env({
      EMAIL_REGION: 'eu-west-1',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
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
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/application-system',
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
      ENDORSEMENTS_API_BASE_PATH: ref(
        (h) => `http://${h.svc(services.servicesEndorsementApi)}`,
      ),
    })
    .xroad(
      Base,
      Client,
      Labor,
      HealthInsurance,
      NationalRegistry,
      Payment,
      DrivingLicense,
      PaymentSchedule,
      CriminalRecord,
      DataProtectionComplaint,
    )
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
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/application-system/api/IDENTITY_SERVER_CLIENT_SECRET',
      DOCUMENT_PROVIDER_ONBOARDING_REVIEWER:
        '/k8s/application-system/api/DOCUMENT_PROVIDER_ONBOARDING_REVIEWER',
      SYSLUMENN_USERNAME: '/k8s/application-system/api/SYSLUMENN_USERNAME',
      SYSLUMENN_PASSWORD: '/k8s/application-system/api/SYSLUMENN_PASSWORD',
      DRIVING_LICENSE_BOOK_XROAD_PATH:
        '/k8s/application-system-api/DRIVING_LICENSE_BOOK_XROAD_PATH',
      DRIVING_LICENSE_BOOK_USERNAME:
        '/k8s/application-system-api/DRIVING_LICENSE_BOOK_USERNAME',
      DRIVING_LICENSE_BOOK_PASSWORD:
        '/k8s/application-system-api/DRIVING_LICENSE_BOOK_PASSWORD',
      NOVA_PASSWORD: '/k8s/application-system/api/NOVA_PASSWORD',
      ARK_BASE_URL: '/k8s/application-system-api/ARK_BASE_URL',
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
        paths: ['/application-payment', '/applications'],
        public: false,
      },
    })
    .grantNamespaces('nginx-ingress-internal', 'islandis')
