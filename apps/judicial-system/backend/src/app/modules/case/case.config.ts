import { defineConfig } from '@island.is/nest/config'

export const caseModuleConfig = defineConfig({
  name: 'CaseModule',
  load: (env) => ({
    production: env.optional('NODE_ENV') === 'production',
    email: {
      fromEmail: env.required('EMAIL_FROM', 'ben10@omnitrix.is'),
      fromName: env.required('EMAIL_FROM_NAME', 'Réttarvörslugátt'),
      replyToEmail: env.required('EMAIL_REPLY_TO', 'ben10@omnitrix.is'),
      replyToName: env.required('EMAIL_REPLY_TO_NAME', 'Réttarvörslugátt'),
    },
    dokobitAccessToken: env.optional('DOKOBIT_ACCESS_TOKEN'),
    deepLinks: {
      completedCaseOverviewUrl: env.required(
        'COMPLETED_CASE_OVERVIEW_URL',
        'http://localhost:4200/krafa/yfirlit/',
      ),
      defenderCaseOverviewUrl: env.required(
        'DEFENDER_CASE_OVERVIEW_URL',
        'http://localhost:4200/verjandi/',
      ),
    },
    archiveEncryptionKey: env.required(
      'ARCHIVE_ENCRYPTION_KEY',
      'secret-archive-encryption-key',
    ),
    sqs: {
      queueName: env.required('SQS_QUEUE_NAME', 'message-queue'),
      deadLetterQueueName: env.required(
        'SQS_DEAD_LETTER_QUEUE_NAME',
        'dead-letter-queue',
      ),
      endpoint: env.optional('SQS_ENDPOINT', 'http://localhost:4566'),
      region: env.optional('SQS_REGION', 'eu-west-1'),
    },
  }),
})
