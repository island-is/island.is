import Channel from './channel'

const mockReturn = (fn: Function) => jest.fn().mockReturnValue({ promise: fn })

const mockReturnPromise = (obj: object) =>
  mockReturn(() => Promise.resolve(obj))

describe('Channel', () => {
  describe('#declareExchange', () => {
    it('should call aws sdk and return topic arn', async () => {
      const topicArn = 'arn:123123123:exchange'
      const mock = mockReturnPromise({ TopicArn: topicArn })
      const channel = new Channel(false)
      channel.sns.createTopic = mock

      const result = await channel.declareExchange({
        name: 'test-application-updates',
      })

      expect(result).toBe(topicArn)
    })
  })

  describe('#declareQueue', () => {
    it('should check if queue exists', async () => {
      const queueUrl = 'http://queue-url'
      const getQueueUrlMock = mockReturnPromise({ QueueUrl: queueUrl })
      const createQueueMock = jest.fn()
      const channel = new Channel(false)
      channel.sqs.getQueueUrl = getQueueUrlMock
      channel.sqs.createQueue = createQueueMock

      const result = await channel.declareQueue({ name: 'queue-name' })

      expect(channel.sqs.getQueueUrl).toHaveBeenCalled()
      expect(channel.sqs.createQueue).not.toHaveBeenCalled()
      expect(result).toBe(queueUrl)
    })

    it('should create queue if it does not exists', async () => {
      const queueUrl = 'http://queue-url'
      const getQueueUrlMock = mockReturn(() => {
        throw new Error('queue not found')
      })
      const createQueueMock = mockReturnPromise({ QueueUrl: queueUrl })
      const channel = new Channel(false)
      channel.sqs.getQueueUrl = getQueueUrlMock
      channel.sqs.createQueue = createQueueMock

      const result = await channel.declareQueue({ name: 'queue-name' })

      expect(channel.sqs.getQueueUrl).toHaveBeenCalled()
      expect(channel.sqs.createQueue).toHaveBeenCalled()
      expect(result).toBe(queueUrl)
    })
  })
})
