import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'notifications'> =>
  service('notifications')
    .image('services-notifications')
    .namespace('notifications')
    .serviceAccount('notifications')
    .command('node')
    .args('--tls-min-v1.0', 'main.js')
    .env({
      MAIN_QUEUE_NAME: 'notifications',
      DEAD_LETTER_QUEUE_NAME: 'notifications-failure',
      AWS_REGION: 'eu-west-1',
    })
    .grantNamespaces('islandis', 'notfications')
    .liveness('/liveness')
    .readiness('/liveness')
