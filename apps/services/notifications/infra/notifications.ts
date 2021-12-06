import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const MAIN_QUEUE_NAME = 'notifications'
const DEAD_LETTER_QUEUE_NAME = 'notifications-failure'

export const userNotificationServiceSetup = (): ServiceBuilder<'user-notifications'> =>
  service('user-notifications')
    .image('user-notifications')
    .namespace('user-notifications')
    .serviceAccount('user-notifications')
    .command('node')
    .args('main.js')
    .env({
      MAIN_QUEUE_NAME,
      DEAD_LETTER_QUEUE_NAME,
    })
    .liveness('/liveness')
    .readiness('/liveness')

export const userNotificationsWorkerSetup = (): ServiceBuilder<'user-notifications'> =>
  service('user-notifications-worker')
    .image('user-notifications-worker')
    .namespace('user-notifications')
    .serviceAccount('user-notifications-worker')
    .command('node')
    .args('main.js', '--job')
    .env({
      MAIN_QUEUE_NAME,
      DEAD_LETTER_QUEUE_NAME,
    })
    .liveness('/liveness')
    .readiness('/liveness')
