import { defineConfig } from '@island.is/nest/config'

export const messageModuleConfig = defineConfig({
  name: 'MessageModule',
  load: (env) => ({
    production: env.optional('NODE_ENV') === 'production',
    queueName: env.required('SQS_QUEUE_NAME', 'message-queue'),
    endpoint: env.optional('SQS_ENDPOINT', 'http://localhost:4566'),
    region: env.optional('SQS_REGION', 'eu-west-1'),
    maxNumberOfMessages: env.optionalJSON('SQS_MAX_NUMBER_OF_MESSAGES') ?? 1,
    waitTimeSeconds: env.optionalJSON('SQS_WAIT_TIME_SECONDS') ?? 10,
  }),
})
