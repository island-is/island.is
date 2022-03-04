import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const MAIN_QUEUE_NAME = 'user-notification'
const DEAD_LETTER_QUEUE_NAME = 'user-notification-failure'

export const userNotificationServiceSetup = (): ServiceBuilder<'user-notification'> =>
  service('user-notification')
    .image('services-user-notification')
    .namespace('user-notification')
    .serviceAccount('user-notification')
    .command('node')
    .args('main.js')
    .env({
      MAIN_QUEUE_NAME,
      DEAD_LETTER_QUEUE_NAME,
    })
    .secrets({
      FIREBASE_CREDENTIALS: '/k8s/user-notification/firestore-credentials',
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .ingress({
      primary: {
        host: {
          dev: 'user-notification-xrd',
          staging: 'user-notification-xrd',
          prod: 'user-notification-xrd',
        },
        paths: ['/'],
        public: false,
      },
    })
    .grantNamespaces('nginx-ingress-internal')

export const userNotificationWorkerSetup = (services: {
  userProfileApi: ServiceBuilder<'service-portal-api'>
}): ServiceBuilder<'user-notification-worker'> =>
  service('user-notification-worker')
    .image('services-user-notification')
    .namespace('user-notification')
    .serviceAccount('user-notification-worker')
    .command('node')
    .args('main.js', '--job=worker')
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
        staging: 'is.island.app.staging',
        prod: 'is.island.app',
      },
      CONTENTFUL_HOST: {
        dev: 'preview.contentful.com',
        staging: 'cdn.contentful.com',
        prod: 'cdn.contentful.com',
      },
    })
    .secrets({
      FIREBASE_CREDENTIALS: '/k8s/user-notification/firestore-credentials',
      USER_NOTIFICATION_CLIENT_ID:
        '/k8s/user-notification/USER_NOTIFICATION_CLIENT_ID',
      USER_NOTIFICATION_CLIENT_SECRET:
        '/k8s/user-notification/USER_NOTIFICATION_CLIENT_SECRET',
      CONTENTFUL_ACCESS_TOKEN: '/k8s/user-notification/CONTENTFUL_ACCESS_TOKEN',
    })
    .liveness('/liveness')
    .readiness('/liveness')
