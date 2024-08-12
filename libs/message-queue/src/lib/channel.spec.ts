import { logger } from '@island.is/logging'
import Channel from './channel'

const asyncMockFn = <T>(returnObject: T) =>
  jest.fn(async (inputArguments: unknown): Promise<T> => {
    logger.debug('Mock-replying', { inputArguments, returnObject })
    return returnObject
  })

const mockSend = <T>(sendMapping: { [key: string]: T }) =>
  jest.fn(async (args): Promise<T> => {
    const name = args.constructor.name
    const returnObject = sendMapping[name]
    logger.debug('Mock-sending', { args, name, returnObject })
    // Call if returnObject is a function
    if (typeof returnObject === 'function') {
      return returnObject(args)
    }
    return returnObject
  })

describe('Channel', () => {
  describe('#declareExchange', () => {
    it('should call aws sdk and return topic arn', async () => {
      const topicArn = 'arn:123123123:exchange'
      const channel = new Channel(false)
      channel.sns.send = asyncMockFn({ TopicArn: topicArn })

      const result = await channel.declareExchange({
        name: 'test-application-updates',
      })

      expect(result).toBe(topicArn)
    })
  })

  describe('#declareQueue', () => {
    it('should check if queue exists', async () => {
      const queueUrl = 'http://queue-url'
      const channel = new Channel(false)
      const mockedSend = mockSend({
        // Throw to be sure we're not creating the queue
        CreateQueueCommand: jest.fn(async () => {
          throw new Error('queue not found')
        }),
        GetQueueUrlCommand: { QueueUrl: queueUrl },
      })
      channel.sqs.send = mockedSend

      const result = await channel.declareQueue({ name: 'my-queue' })

      expect(channel.sqs.send).toHaveBeenCalledTimes(1)
      expect(result).toBe(queueUrl)
    })

    it('should create queue if it does not exists', async () => {
      const queueUrl = 'http://queue-url'
      const channel = new Channel(false)
      const mockedSend = mockSend({
        CreateQueueCommand: { QueueUrl: queueUrl },
        // Throw to be sure we're not fetching the newly created queue
        GetQueueUrlCommand: jest.fn(async () => {
          throw new Error('queue not found')
        }),
      })
      channel.sqs.send = mockedSend

      const result = await channel.declareQueue({ name: 'my-queue' })

      expect(channel.sqs.send).toHaveBeenCalled()
      expect(result).toBe(queueUrl)
    })
  })
})
