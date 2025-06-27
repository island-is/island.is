import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  backend: ServiceBuilder<'judicial-system-backend'>
}): ServiceBuilder<'judicial-system-scheduler'> =>
  service('judicial-system-scheduler')
    .namespace('judicial-system')
    .image('judicial-system-scheduler')
    .env({
      SQS_QUEUE_NAME: 'sqs-judicial-system',
      SQS_DEAD_LETTER_QUEUE_NAME: 'sqs-judicial-system-dlq',
      SQS_REGION: 'eu-west-1',
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
      // Schedule to run daily at 2:00 AM and 9:00 AM
      dev: { schedule: '0 2,9 * * *' },
      staging: { schedule: '0 2,9 * * *' },
      prod: { schedule: '0 2,9 * * *' },
    })
    .serviceAccount('judicial-system-scheduler')
