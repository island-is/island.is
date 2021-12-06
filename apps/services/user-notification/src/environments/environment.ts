import assert from 'assert'

let env = process.env

if (!env.NODE_ENV || env.NODE_ENV === 'development') {
  env = {
    MAIN_QUEUE_NAME: 'notifications',
    DEAD_LETTER_QUEUE_NAME: 'notifications-failure',
    SQS_REGION: 'eu-west-1',
    SQS_ENDPOINT: 'http://localhost:4566',
    SQS_ACCESS_KEY: 'testing',
    SQS_SECRET_ACCESS_KEY: 'testing',
    ...env,
  }
}

const environment = {
  mainQueueName: env.MAIN_QUEUE_NAME,
  deadLetterQueueName: env.DEAD_LETTER_QUEUE_NAME,

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

assert(environment.mainQueueName)
assert(environment.deadLetterQueueName)

export { environment }
export type Config = typeof environment
