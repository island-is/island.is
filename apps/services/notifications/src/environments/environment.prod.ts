import assert from 'assert'

const environment = {
  production: true,

  mainQueueName: process.env.MAIN_QUEUE_NAME,
  deadLetterQueueName: process.env.DEAD_LETTER_QUEUE_NAME,

  sqsConfig: {
    region: process.env.SQS_REGION ?? 'eu-west-1',
    credentials: {
      accessKeyId: process.env.SQS_ACCESS_KEY,
      secretAccessKey: process.env.SQS_SECRET_ACCESS_KEY,
    },
  },
}

assert(environment.mainQueueName)
assert(environment.deadLetterQueueName)

export { environment }
