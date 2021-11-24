import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'notifications'> =>
  service('notifications')
    .image('services-notifications')
    .namespace('notifications')
    .serviceAccount('notifications')
    .command('node')
    .args('--tls-min-v1.0', 'main.js')
    .secrets({
      XXXX: '/k8s/notifications/XXXX',
    })
    .grantNamespaces('islandis', 'notfications')
    .liveness('/liveness')
    .readiness('/liveness')
