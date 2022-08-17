import { defineConfig } from '@island.is/nest/config'

export const appModuleConfig = defineConfig({
  name: 'AppModule',
  load: (env) => ({
    sqsQueueName: env.required('SQS_QUEUE_NAME', 'message-queue'),
    sqsDeadLetterQueueName: env.required(
      'SQS_DEAD_LETTER_QUEUE_NAME',
      'dead-letter-queue',
    ),
    sqsEndpoint: env.optional('SQS_ENDPOINT', 'http://localhost:4566'),
    sqsRegion: env.optional('SQS_REGION', 'eu-west-1'),
    backendAccessToken: env.required(
      'BACKEND_ACCESS_TOKEN',
      'secret-backend-api-token',
    ),
    backendUrl: env.required('BACKEND_URL', 'http://localhost:3344'),
  }),
})
