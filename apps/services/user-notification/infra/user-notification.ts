import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

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

export const userNotificationWorkerSetup = (): ServiceBuilder<'user-notification-worker'> =>
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
      SERVICE_USER_PROFILE_BASEPATH: {
        dev: 'https://beta.dev01.devland.is/minarsidur',
        staging: 'https://beta.staging01.devland.is/minarsidur',
        prod: 'https://island.is/minarsidur',
      },
    })
    .secrets({
      GOOGLE_APPLICATION_CREDENTIALS:
        '/k8s/user-notification/firestore-credentials',
      USER_NOTIFICATION_CLIENT_ID:
        '/k8s/user-notification/USER_NOTIFICATION_CLIENT_ID',
      USER_NOTIFICATION_CLIENT_SECRET:
        '/k8s/user-notification/USER_NOTIFICATION_CLIENT_SECRET',
    })
