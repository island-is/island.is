import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  backend: ServiceBuilder<'judicial-system-backend'>
}): ServiceBuilder<'judicial-system-scheduler'> =>
  service('judicial-system-scheduler')
    .namespace('judicial-system')
    .image('judicial-system-scheduler')
    .env({
      BACKEND_URL: ref((h) => `http://${h.svc(services.backend)}`),
      TIME_TO_LIVE_MINUTES: '30',
    })
    .secrets({
      BACKEND_AUTH_TOKEN: '/k8s/judicial-system/BACKEND_AUTH_TOKEN',
    })
    .replicaCount({ min: 1, max: 1, default: 1 })
    .command('node')
    .args('main.js')
    .extraAttributes({
      // Schedule to run daily at two in the morning.
      dev: { schedule: '0 2 * * *' },
      staging: { schedule: '0 2 * * *' },
      prod: { schedule: '0 2 * * *' },
    })
