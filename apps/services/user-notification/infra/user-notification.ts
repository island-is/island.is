import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const serviceName = 'user-notification'
const serviceWorkerName = `${serviceName}-worker`
const dbName = `services_${serviceName.replace('-', '_')}`
const MAIN_QUEUE_NAME = serviceName
const DEAD_LETTER_QUEUE_NAME = `${serviceName}-failure`

const postgresInfo = {
  username: dbName,
  name: dbName,
  passwordSecret: `/k8s/${serviceName}/DB_PASSWORD`,
}

export const userNotificationServiceSetup = (): ServiceBuilder<
  typeof serviceName
> =>
  service(serviceName)
    .image(serviceName)
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
    })
    .secrets({
      FIREBASE_CREDENTIALS: `/k8s/${serviceName}/firestore-credentials`,
      CONTENTFUL_ACCESS_TOKEN: `/k8s/${serviceName}/CONTENTFUL_ACCESS_TOKEN`,
    })
    .liveness('/liveness')
    .readiness('/liveness') // change to readiness - when ready ;)
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
        cpu: '200m',
        memory: '384Mi',
      },
      requests: {
        cpu: '15m',
        memory: '256Mi',
      },
    })
    .grantNamespaces('nginx-ingress-internal')

export const userNotificationWorkerSetup = (services: {
  userProfileApi: ServiceBuilder<typeof serviceWorkerName>
}): ServiceBuilder<typeof serviceWorkerName> =>
  service(serviceWorkerName)
    .image(serviceName)
    .namespace(serviceName)
    .serviceAccount(serviceWorkerName)
    .command('node')
    .args('--no-experimental-fetch', 'main.js', '--job=worker')
    .extraAttributes({
      dev: { schedule: '30 03 * * *' },
      staging: { schedule: '30 03 * * *' },
      prod: { schedule: '30 03 * * *' },
    })
    .postgres(postgresInfo)
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
      postgres: postgresInfo,
    })
    .env({
      MAIN_QUEUE_NAME,
      DEAD_LETTER_QUEUE_NAME,
      IDENTITY_SERVER_PATH: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      SERVICE_USER_PROFILE_BASEPATH: ref(
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
    .secrets({
      FIREBASE_CREDENTIALS: `/k8s/${serviceName}/firestore-credentials`,
      USER_NOTIFICATION_CLIENT_ID: `/k8s/${serviceName}/USER_NOTIFICATION_CLIENT_ID`,
      USER_NOTIFICATION_CLIENT_SECRET: `/k8s/${serviceName}/USER_NOTIFICATION_CLIENT_SECRET`,
      CONTENTFUL_ACCESS_TOKEN: `/k8s/${serviceName}/CONTENTFUL_ACCESS_TOKEN`,
    })
    .liveness('/liveness')
    .readiness('/liveness') // change to readiness - when ready ;)