import { ref, service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  worker: ServiceBuilder<'university-gateway-worker'>
}): ServiceBuilder<'services-university-gateway-scheduler'> =>
  service('services-university-gateway-scheduler')
    .namespace('university-gateway')
    .image('services-university-gateway-scheduler')
    .env({
      BACKEND_URL: ref((h) => `http://${h.svc(services.worker)}`),
      TIME_TO_LIVE_MINUTES: '30',
    })
    .secrets({
      BACKEND_ACCESS_TOKEN: '/k8s/university-gateway/WORKER_ACCESS_TOKEN',
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
