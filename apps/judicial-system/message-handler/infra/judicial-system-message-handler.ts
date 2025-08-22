import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  backend: ServiceBuilder<'judicial-system-backend'>
}): ServiceBuilder<'judicial-system-message-handler'> =>
  service('judicial-system-message-handler')
    .namespace('judicial-system')
    .serviceAccount('judicial-system-message-handler')
    .image('judicial-system-message-handler')
    .env({
      SQS_QUEUE_NAME: 'sqs-judicial-system',
      SQS_DEAD_LETTER_QUEUE_NAME: 'sqs-judicial-system-dlq',
      SQS_REGION: 'eu-west-1',
      BACKEND_URL: ref((h) => `http://${h.svc(services.backend)}`),
    })
    .secrets({
      BACKEND_ACCESS_TOKEN: '/k8s/judicial-system/BACKEND_ACCESS_TOKEN',
    })
    .readiness('/liveness')
    .liveness('/liveness')
    .command('node')
    .args('--no-experimental-fetch', 'main.cjs')
