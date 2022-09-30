import { defineConfig } from '@island.is/nest/config'

export const messageModuleConfig = defineConfig({
  name: 'MessageModule',
  load: (env) => ({
    queueName: env.required('SQS_QUEUE_NAME', 'message-queue'),
    deadLetterQueueName: env.required(
      'SQS_DEAD_LETTER_QUEUE_NAME',
      'dead-letter-queue',
    ),
    endpoint: env.optional('SQS_ENDPOINT', 'http://localhost:4566'),
    region: env.optional('SQS_REGION', 'eu-west-1'),
  }),
})
