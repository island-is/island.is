import { register } from 'tsconfig-paths'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsConfig = require(`../${require('../tsconfig.json').extends}`)
register({ baseUrl: './', paths: tsConfig.compilerOptions.paths })
import { startPostgres, startLocalstack } from '@island.is/testing/containers'
import { CreateQueueCommand, SQSClient } from '@aws-sdk/client-sqs'
import { environment } from './environment'
import { logger } from '@island.is/logging'

const setupSqsQueue = async () => {
  try {
    const client = new SQSClient({
      region: environment.SQS_REGION,
      endpoint: process.env.SQS_ENDPOINT,
      credentials: {
        accessKeyId: environment.SQS_ACCESS_KEY,
        secretAccessKey: environment.SQS_SECRET_ACCESS_KEY,
      },
    })

    logger.debug('Creating main queue...', { client })
    await client.send(
      new CreateQueueCommand({ QueueName: environment.MAIN_QUEUE_NAME }),
    )
    logger.debug('Main queue created.')

    logger.debug('Creating dead letter queue...')
    await client.send(
      new CreateQueueCommand({ QueueName: environment.DEAD_LETTER_QUEUE_NAME }),
    )
    logger.debug('Dead letter queue created.')

    logger.debug('Creating sub-queues and their dead letter queues...')
    await Promise.all([
      client.send(new CreateQueueCommand({ QueueName: environment.EMAIL_QUEUE_NAME })),
      client.send(new CreateQueueCommand({ QueueName: environment.EMAIL_DEAD_LETTER_QUEUE_NAME })),
      client.send(new CreateQueueCommand({ QueueName: environment.SMS_QUEUE_NAME })),
      client.send(new CreateQueueCommand({ QueueName: environment.SMS_DEAD_LETTER_QUEUE_NAME })),
      client.send(new CreateQueueCommand({ QueueName: environment.PUSH_QUEUE_NAME })),
      client.send(new CreateQueueCommand({ QueueName: environment.PUSH_DEAD_LETTER_QUEUE_NAME })),
    ])
    logger.debug('Sub-queues created.')
  } catch (error) {
    console.error('Error setting up SQS queue', error)
    throw error
  }
}

export default async () => {
  await Promise.all([startPostgres(), startLocalstack()])

  // Setting up the SQS queue to prevent concurrent issues between spec files.
  await setupSqsQueue()
}
