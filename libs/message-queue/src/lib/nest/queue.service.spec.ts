import { logger } from '@island.is/logging'
import { ClientService } from './client.service'
import { QueueService } from './queue.service'
import { DAY, MINUTE } from './time'
import { clientConfig, deleteQueues, makeQueueConfig } from './testHelpers'

beforeEach(deleteQueues)

describe('QueueService', () => {
  it('creates queues on onApplicationBootstrap', async () => {
    const config = makeQueueConfig()
    const client = new ClientService(clientConfig, logger)
    const queue = new QueueService(client, config)
    await queue.onApplicationBootstrap()

    expect(queue.url).toBeTruthy()
    expect(await client.tryGetQueueUrl(config.queueName)).toBeTruthy()

    const dlQueueName = config.deadLetterQueue?.queueName ?? ''
    expect(await client.tryGetQueueUrl(dlQueueName)).toBeTruthy()
  })

  it('updates queue attributes when queue config changes', async () => {
    const config = makeQueueConfig()
    const client = new ClientService(clientConfig, logger)
    await new QueueService(client, config).onApplicationBootstrap()

    const newConfig = {
      ...config,
      messageRetentionPeriod: DAY,
      visibilityTimeout: MINUTE,
    }

    const queue = new QueueService(client, newConfig)
    await queue.onApplicationBootstrap()

    const attributes = await client.getQueueAttributes(queue.url, [
      'MessageRetentionPeriod',
      'VisibilityTimeout',
    ])

    expect(attributes.MessageRetentionPeriod).toBe(
      newConfig.messageRetentionPeriod.toString(),
    )
    expect(attributes.VisibilityTimeout).toBe(
      newConfig.visibilityTimeout.toString(),
    )
  })
})
