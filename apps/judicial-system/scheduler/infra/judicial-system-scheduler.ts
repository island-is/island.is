import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  backend: ServiceBuilder<'judicial-system-backend'>
}): ServiceBuilder<'judicial-system-scheduler'> =>
  service('judicial-system-scheduler')
    .namespace('judicial-system')
    .env({
      BACKEND_URL: ref((h) => `http://${h.svc(services.backend)}`),
      TIME_TO_LIVE_MINUTES: '30',
    })
    .secrets({
      BACKEND_ACCESS_TOKEN: '/k8s/judicial-system/BACKEND_ACCESS_TOKEN',
    })
    .replicaCount({ min: 1, max: 1, default: 1 })
    .command('node')
    .args('--no-experimental-fetch', 'main.js')
    .extraAttributes({
      // Schedule to run daily at two in the morning.
      dev: { schedule: '0 2 * * *' },
      staging: { schedule: '0 2 * * *' },
      prod: { schedule: '0 2 * * *' },
    })
