let env = process.env

const isDevelopment = env.NODE_ENV === 'development'

if (!env.NODE_ENV || isDevelopment) {
  env = {
    MAIN_QUEUE_NAME: 'notifications',
    DEAD_LETTER_QUEUE_NAME: 'notifications-failure',
    EMAIL_QUEUE_NAME: 'notifications-email',
    EMAIL_DEAD_LETTER_QUEUE_NAME: 'notifications-email-failure',
    SMS_QUEUE_NAME: 'notifications-sms',
    SMS_DEAD_LETTER_QUEUE_NAME: 'notifications-sms-failure',
    PUSH_QUEUE_NAME: 'notifications-push',
    PUSH_DEAD_LETTER_QUEUE_NAME: 'notifications-push-failure',
    SQS_REGION: 'eu-west-1',
    SQS_ENDPOINT: 'http://localhost:4566',
    SQS_ACCESS_KEY: 'testing',
    SQS_SECRET_ACCESS_KEY: 'testing',
    ...env,
  }
}

const required = (name: string): string => env[name] ?? ''

export const environment = {
  mainQueueName: required('MAIN_QUEUE_NAME'),
  deadLetterQueueName: env.DEAD_LETTER_QUEUE_NAME,
  emailQueueName: required('EMAIL_QUEUE_NAME'),
  emailDeadLetterQueueName: env.EMAIL_DEAD_LETTER_QUEUE_NAME,
  smsQueueName: required('SMS_QUEUE_NAME'),
  smsDeadLetterQueueName: env.SMS_DEAD_LETTER_QUEUE_NAME,
  pushQueueName: required('PUSH_QUEUE_NAME'),
  pushDeadLetterQueueName: env.PUSH_DEAD_LETTER_QUEUE_NAME,
  auth: {
    issuer:
      env.IDENTITY_SERVER_ISSUER_URL ??
      'https://identity-server.dev01.devland.is',
  },

  sqsConfig: {
    endpoint: env.SQS_ENDPOINT,
    region: env.SQS_REGION,
    ...(env.SQS_ACCESS_KEY &&
      env.SQS_SECRET_ACCESS_KEY && {
        credentials: {
          accessKeyId: env.SQS_ACCESS_KEY,
          secretAccessKey: env.SQS_SECRET_ACCESS_KEY,
        },
      }),
  },
}

export type Config = typeof environment
