import assert from 'assert'

const environment = {
  production: true,

  mainQueueName: process.env.MAIN_QUEUE_NAME,
  deadLetterQueueName: process.env.DEAD_LETTER_QUEUE_NAME,

  sqsConfig: {
    credentials: {
      accessKeyId: process.env.SQS_ACCESS_KEY,
      secretAccessKey: process.env.SQS_SECRET_ACCESS_KEY,
    },
  },
}

assert(environment.mainQueueName)
assert(environment.deadLetterQueueName)

// SQS requires AWS_REGION
assert(process.env.AWS_REGION, 'AWS_REGION environment variable is missing')

export { environment }
