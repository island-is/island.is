import { Queue } from './types'
import { DAY, MINUTE } from './time'
import {
  DeleteQueueCommand,
  ListQueuesCommand,
  SQSClient,
} from '@aws-sdk/client-sqs'

export const clientConfig = {
  region: 'eu-west-1',
  endpoint: 'http://localhost:4566',
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
  const client = new SQSClient(clientConfig)
  const { QueueUrls: urls = [] } = await client.send(
    new ListQueuesCommand({ QueueNamePrefix: testQueuePrefix }),
  )

  await Promise.all(
    urls.map(async (url) => {
      await client.send(new DeleteQueueCommand({ QueueUrl: url }))
    }),
  )
}
