import {
  Base,
  Client,
  NationalRegistry,
  NationalRegistryB2C,
} from '../../../../infra/src/dsl/xroad'
import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const serviceName = 'user-notification'
const serviceWorkerName = `${serviceName}-worker`
const dbName = `${serviceName.replace('-', '_')}`
const imageName = `services-${serviceName}`
const MAIN_QUEUE_NAME = serviceName
const DEAD_LETTER_QUEUE_NAME = `${serviceName}-failure`

const postgresInfo = {
  username: dbName,
  name: dbName,
  passwordSecret: `/k8s/${serviceName}/DB_PASSWORD`,
}

export const userNotificationServiceSetup = (services: {
  userProfileApi: ServiceBuilder<typeof serviceWorkerName>
}): ServiceBuilder<typeof serviceName> =>
  service(serviceName)
    .image(imageName)
    .namespace(serviceName)
    .serviceAccount(serviceName)
    .postgres(postgresInfo)
    .command('node')
    .args('--no-experimental-fetch', 'main.js')
    .env({
      MAIN_QUEUE_NAME,
      DEAD_LETTER_QUEUE_NAME,
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      USER_PROFILE_CLIENT_URL: ref(
        (ctx) => `http://${ctx.svc(services.userProfileApi)}`,
      ),
    })
    .secrets({
      FIREBASE_CREDENTIALS: `/k8s/${serviceName}/firestore-credentials`,
      CONTENTFUL_ACCESS_TOKEN: `/k8s/${serviceName}/CONTENTFUL_ACCESS_TOKEN`,
      IDENTITY_SERVER_CLIENT_ID: `/k8s/${serviceName}/USER_NOTIFICATION_CLIENT_ID`,
      IDENTITY_SERVER_CLIENT_SECRET: `/k8s/${serviceName}/USER_NOTIFICATION_CLIENT_SECRET`,
      NATIONAL_REGISTRY_B2C_CLIENT_SECRET:
        '/k8s/api/NATIONAL_REGISTRY_B2C_CLIENT_SECRET',
    })
    .xroad(Base, Client, NationalRegistryB2C)
    .liveness('/liveness')
    .readiness('/readiness')
    .ingress({
      primary: {
        host: {
          dev: `${serviceName}-xrd`,
          staging: `${serviceName}-xrd`,
          prod: `${serviceName}-xrd`,
        },
        paths: ['/'],
        public: false,
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          staging: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
        },
      },
    })
    .resources({
      limits: {
        cpu: '400m',
        memory: '384Mi',
      },
      requests: {
        cpu: '150m',
        memory: '256Mi',
      },
    })
    .grantNamespaces('nginx-ingress-internal')

export const userNotificationWorkerSetup = (services: {
  userProfileApi: ServiceBuilder<typeof serviceWorkerName>
}): ServiceBuilder<typeof serviceWorkerName> =>
  service(serviceWorkerName)
    .replicaCount({default: 0, min: 0, max: 0})
    .image(imageName)
    .namespace(serviceName)
    .serviceAccount(serviceWorkerName)
    .command('node')
    .args('--no-experimental-fetch', 'main.js', '--job=worker')
    .postgres(postgresInfo)
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
      postgres: postgresInfo,
    })
    .env({
      MAIN_QUEUE_NAME,
      DEAD_LETTER_QUEUE_NAME,
      EMAIL_REGION: 'eu-west-1',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      USER_PROFILE_CLIENT_URL: ref(
        (ctx) => `http://${ctx.svc(services.userProfileApi)}`,
      ),
      USER_NOTIFICATION_APP_PROTOCOL: {
        dev: 'is.island.app.dev',
        staging: 'is.island.app.dev', // intentionally set to dev - see firebase setup
        prod: 'is.island.app',
      },
      CONTENTFUL_HOST: {
        dev: 'preview.contentful.com',
        staging: 'cdn.contentful.com',
        prod: 'cdn.contentful.com',
      },
    })
    .resources({
      limits: {
        cpu: '400m',
        memory: '384Mi',
      },
      requests: {
        cpu: '150m',
        memory: '256Mi',
      },
    })
    .secrets({
      FIREBASE_CREDENTIALS: `/k8s/${serviceName}/firestore-credentials`,
      IDENTITY_SERVER_CLIENT_ID: `/k8s/${serviceName}/USER_NOTIFICATION_CLIENT_ID`,
      IDENTITY_SERVER_CLIENT_SECRET: `/k8s/${serviceName}/USER_NOTIFICATION_CLIENT_SECRET`,
      CONTENTFUL_ACCESS_TOKEN: `/k8s/${serviceName}/CONTENTFUL_ACCESS_TOKEN`,
      NATIONAL_REGISTRY_B2C_CLIENT_SECRET:
        '/k8s/api/NATIONAL_REGISTRY_B2C_CLIENT_SECRET',
    })
    .xroad(Base, Client, NationalRegistryB2C)
    .liveness('/liveness')
    .readiness('/readiness')
