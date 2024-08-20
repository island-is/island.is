import { Queue } from './types'
import { DAY, MINUTE } from './time'
import {
  DeleteQueueCommand,
  ListQueuesCommand,
  SQSClient,
} from '@aws-sdk/client-sqs'
import { logger } from '@island.is/logging'

if (!process.env.SQS_ENDPOINT) {
  throw new Error('sqs endpoint not set')
}

export const clientConfig = {
  region: 'eu-west-1',
  endpoint: process.env.SQS_ENDPOINT,
  credentials: {
    accessKeyId: 'testing',
    secretAccessKey: 'testing',
  },
}

export const testQueuePrefix = 'testing-islandis-messagequeue-'

export const makeQueueConfig = (config: Partial<Queue> = {}): Queue => ({
  name: 'test',
  queueName: testQueuePrefix + 'main',
  messageRetentionPeriod: DAY * 14,
  visibilityTimeout: MINUTE * 5,
  ...config,
  deadLetterQueue: {
    queueName: testQueuePrefix + 'failure',
    ...config.deadLetterQueue,
  },
})

export const deleteQueues = async (): Promise<void> => {
  logger.info(`Deleting queues with prefix ${testQueuePrefix}`)
  logger.debug('Getting SQS client with config', {
    ...clientConfig,
    credentials: undefined,
  })
  const client = new SQSClient(clientConfig)
  logger.debug('Getting list of queues', { client })
  const { QueueUrls: urls = [] } = await client.send(
    new ListQueuesCommand({ QueueNamePrefix: testQueuePrefix }),
  )
  if (!urls.length) {
    logger.info('No queues to delete')
    return
  }

  logger.debug('Deleting queues', { urls })
  await Promise.all(
    urls.map(async (url) => {
      logger.debug('Deleting queue', { url })
      await client.send(new DeleteQueueCommand({ QueueUrl: url }))
    }),
  )
  logger.info('Done deleting queues')
}
