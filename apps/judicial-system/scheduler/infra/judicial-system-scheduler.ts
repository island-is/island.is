import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  backend: ServiceBuilder<'judicial-system-backend'>
}): ServiceBuilder<'scheduler'> =>
  service('scheduler')
    .namespace('judicial-system')
    .image('judicial-system-scheduler')
    .env({
      BACKEND_URL: ref((h) => `http://${h.svc(services.backend)}`),
    })
    .secrets({
      SECRET_TOKEN: '/k8s/judicial-system/SECRET_TOKEN',
    })
    .command('node')
    .args('main.js')
    .extraAttributes({
      // Schedule to run daily at two in the morning.
      dev: { schedule: '0 2 * * *' },
      staging: { schedule: '0 2 * * *' },
      prod: { schedule: '0 2 * * *' },
    })
