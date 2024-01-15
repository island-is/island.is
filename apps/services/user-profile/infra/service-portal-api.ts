import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import {
  PostgresInfo,
  EnvironmentVariables,
  Secrets,
} from '../../../../infra/src/dsl/types/input-types'

// We basically don't want it to run in a cron job
// but manually, so set it to run once a year on dec 31st
const schedule = '0 0 31 12 *'

const namespace = 'service-portal'
const serviceId = `${namespace}-api`
const workerId = `${serviceId}-worker`
const imageId = 'services-user-profile'

const postgresInfo: PostgresInfo = {
  passwordSecret: '/k8s/service-portal/api/DB_PASSWORD',
  name: 'service_portal_api',
  username: 'service_portal_api',
}

const envVariables: EnvironmentVariables = {
  SERVICE_PORTAL_BASE_URL: {
    dev: 'https://beta.dev01.devland.is/minarsidur',
    staging: 'https://beta.staging01.devland.is/minarsidur',
    prod: 'https://island.is/minarsidur',
    local: 'http://localhost:4200/minarsidur',
  },
  EMAIL_REGION: 'eu-west-1',
  IDENTITY_SERVER_ISSUER_URL: {
    dev: 'https://identity-server.dev01.devland.is',
    staging: 'https://identity-server.staging01.devland.is',
    prod: 'https://innskra.island.is',
  },
  NOVA_ACCEPT_UNAUTHORIZED: {
    dev: 'true',
    staging: 'false',
    prod: 'false',
  },
  USER_PROFILE_WORKER_PAGE_SIZE: {
    dev: '3000',
    staging: '3000',
    prod: '3000',
  },
}

const secrets: Secrets = {
  NOVA_URL: '/k8s/service-portal-api/NOVA_URL',
  NOVA_PASSWORD: '/k8s/gjafakort/NOVA_PASSWORD',
  NOVA_USERNAME: '/k8s/gjafakort/NOVA_USERNAME',
  EMAIL_FROM: '/k8s/service-portal/api/EMAIL_FROM',
  EMAIL_FROM_NAME: '/k8s/service-portal/api/EMAIL_FROM_NAME',
  EMAIL_REPLY_TO: '/k8s/service-portal/api/EMAIL_REPLY_TO',
  EMAIL_REPLY_TO_NAME: '/k8s/service-portal/api/EMAIL_REPLY_TO_NAME',
  ISLYKILL_SERVICE_PASSPHRASE: '/k8s/api/ISLYKILL_SERVICE_PASSPHRASE',
  ISLYKILL_SERVICE_BASEPATH: '/k8s/api/ISLYKILL_SERVICE_BASEPATH',
}

export const workerSetup = (): ServiceBuilder<typeof workerId> =>
  service(workerId)
    .namespace(namespace)
    .image(imageId)
    .env(envVariables)
    .secrets(secrets)
    .files({ filename: 'islyklar.p12', env: 'ISLYKILL_CERT' })
    .resources({
      limits: { cpu: '800m', memory: '1024Mi' },
      requests: { cpu: '400m', memory: '512Mi' },
    })
    .postgres(postgresInfo)
    .extraAttributes({
      dev: {
        schedule,
      },
      staging: {
        schedule,
      },
      prod: {
        schedule,
      },
    })

export const serviceSetup = (): ServiceBuilder<typeof serviceId> =>
  service(serviceId)
    .namespace(namespace)
    .image(imageId)
    .serviceAccount(serviceId)
    .env(envVariables)
    .secrets(secrets)
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
      postgres: { passwordSecret: '/k8s/service-portal/api/DB_PASSWORD' },
    })
    .liveness('/liveness')
    .readiness('/readiness')
    .replicaCount({
      default: 2,
      max: 30,
      min: 2,
    })
    .files({ filename: 'islyklar.p12', env: 'ISLYKILL_CERT' })
    .ingress({
      internal: {
        host: {
          dev: 'service-portal-api',
          staging: 'service-portal-api',
          prod: 'service-portal-api',
        },
        paths: ['/'],
        public: false,
      },
    })
    .resources({
      limits: { cpu: '800m', memory: '1024Mi' },
      requests: { cpu: '400m', memory: '512Mi' },
    })
    .postgres(postgresInfo)
    .grantNamespaces(
      'nginx-ingress-internal',
      'islandis',
      'user-notification',
      'identity-server',
    )
