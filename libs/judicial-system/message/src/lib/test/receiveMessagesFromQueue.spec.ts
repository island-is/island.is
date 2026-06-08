import { v4 as uuid } from 'uuid'
import { SQSClient } from '@aws-sdk/client-sqs'

import { Message } from '../message'
import { messageModuleConfig } from '../message.config'
import { SuspensionDecision } from '../suspension'
import { createTestingMessageModule } from './createTestingMessageModule'

const config = messageModuleConfig()
interface Then {
  result: void
  error: Error
}

type GivenWhenThen = (
  callback: (message: Message) => Promise<boolean>,
  shouldSuspend?: (message: Message) => SuspensionDecision,
) => Promise<Then>

describe('MessageService - Receive messages from queue', () => {
  let setMocks: (mocks: unknown[]) => void
  let mockQueueUrl: string
  let mockSqs: SQSClient
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { setSendMocks, queueUrl, sqs, messageService } =
      await createTestingMessageModule()
    setMocks = setSendMocks

    mockQueueUrl = queueUrl
    mockSqs = sqs

    givenWhenThen = async (
      callback: (message: Message) => Promise<boolean>,
      shouldSuspend?: (message: Message) => SuspensionDecision,
    ) => {
      const then = {} as Then

      try {
        then.result = await messageService.receiveMessagesFromQueue(
          callback,
          shouldSuspend,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('message received from queue', () => {
    const message = { caseId: uuid() } as Message
    const receiptHandle = uuid()
    const callback = jest.fn().mockResolvedValueOnce(true)

    beforeEach(async () => {
      setMocks([
        {
          Messages: [
            { ReceiptHandle: receiptHandle, Body: JSON.stringify(message) },
          ],
        },
      ])

      await givenWhenThen(callback)
    })

    it('should handle message', async () => {
      expect(mockSqs.send).toHaveBeenNthCalledWith(2, {
        QueueUrl: mockQueueUrl,
        MaxNumberOfMessages: config.maxNumberOfMessages,
        WaitTimeSeconds: config.waitTimeSeconds,
      })
      expect(callback).toHaveBeenCalledWith(message)
      expect(mockSqs.send).toHaveBeenNthCalledWith(3, {
        QueueUrl: mockQueueUrl,
        ReceiptHandle: receiptHandle,
      })
    })
  })

  describe('message received from queue but not handled by callback', () => {
    const message = { caseId: uuid() } as Message
    const receiptHandle = uuid()
    const callback = jest.fn().mockResolvedValueOnce(false)
    const now = Date.now()

    beforeEach(async () => {
      setMocks([
        {
          Messages: [
            { ReceiptHandle: receiptHandle, Body: JSON.stringify(message) },
          ],
        },
        { MessageId: uuid() },
      ])
      Date.now = jest.fn().mockReturnValueOnce(now)

      await givenWhenThen(callback)
    })

    it('should retry message', async () => {
      expect(mockSqs.send).toHaveBeenNthCalledWith(2, {
        QueueUrl: mockQueueUrl,
        MaxNumberOfMessages: config.maxNumberOfMessages,
        WaitTimeSeconds: config.waitTimeSeconds,
      })
      expect(callback).toHaveBeenCalledWith(message)
      expect(mockSqs.send).toHaveBeenNthCalledWith(3, {
        QueueUrl: mockQueueUrl,
        DelaySeconds: config.minRetryIntervalSeconds,
        MessageBody: JSON.stringify({
          ...message,
          numberOfRetries: 1,
          nextRetry: now + config.minRetryIntervalSeconds * 1000,
        }),
      })
      expect(mockSqs.send).toHaveBeenNthCalledWith(4, {
        QueueUrl: mockQueueUrl,
        ReceiptHandle: receiptHandle,
      })
    })
  })

  describe('message received too early from queue', () => {
    const now = Date.now()
    const message = {
      caseId: uuid(),
      numberOfRetries: 1,
      nextRetry: now + 1000,
    } as Message
    const receiptHandle = uuid()
    const callback = jest.fn()

    beforeEach(async () => {
      setMocks([
        {
          Messages: [
            { ReceiptHandle: receiptHandle, Body: JSON.stringify(message) },
          ],
        },
        { MessageId: uuid() },
      ])
      Date.now = jest.fn().mockReturnValueOnce(now)

      await givenWhenThen(callback)
    })

    it('should not handle message', async () => {
      expect(mockSqs.send).toHaveBeenNthCalledWith(2, {
        QueueUrl: mockQueueUrl,
        MaxNumberOfMessages: config.maxNumberOfMessages,
        WaitTimeSeconds: config.waitTimeSeconds,
      })
      expect(callback).not.toHaveBeenCalledWith(message)
      expect(mockSqs.send).toHaveBeenNthCalledWith(3, {
        QueueUrl: mockQueueUrl,
        DelaySeconds: 1,
        MessageBody: JSON.stringify(message),
      })
      expect(mockSqs.send).toHaveBeenCalledWith({
        QueueUrl: mockQueueUrl,
        ReceiptHandle: receiptHandle,
      })
    })
  })

  describe('message received from queue while its category is suspended', () => {
    const message = {
      caseId: uuid(),
      numberOfRetries: 2,
    } as Message
    const receiptHandle = uuid()
    const callback = jest.fn()
    const shouldSuspend = jest
      .fn()
      .mockReturnValueOnce({ suspend: true, delaySeconds: 600 })

    beforeEach(async () => {
      setMocks([
        {
          Messages: [
            { ReceiptHandle: receiptHandle, Body: JSON.stringify(message) },
          ],
        },
        { MessageId: uuid() },
      ])

      await givenWhenThen(callback, shouldSuspend)
    })

    it('should re-queue the message without handling it or consuming a retry', () => {
      expect(callback).not.toHaveBeenCalled()
      // Re-queued with the configured delay and the body unchanged, so
      // numberOfRetries is preserved
      expect(mockSqs.send).toHaveBeenNthCalledWith(3, {
        QueueUrl: mockQueueUrl,
        DelaySeconds: 600,
        MessageBody: JSON.stringify(message),
      })
      expect(mockSqs.send).toHaveBeenNthCalledWith(4, {
        QueueUrl: mockQueueUrl,
        ReceiptHandle: receiptHandle,
      })
    })
  })

  describe('message suspended with a delay longer than the maximum', () => {
    const message = { caseId: uuid() } as Message
    const receiptHandle = uuid()
    const callback = jest.fn()
    const shouldSuspend = jest
      .fn()
      .mockReturnValueOnce({ suspend: true, delaySeconds: 1200 })

    beforeEach(async () => {
      setMocks([
        {
          Messages: [
            { ReceiptHandle: receiptHandle, Body: JSON.stringify(message) },
          ],
        },
        { MessageId: uuid() },
      ])

      await givenWhenThen(callback, shouldSuspend)
    })

    it('should clamp the re-queue delay to 900 seconds', () => {
      expect(callback).not.toHaveBeenCalled()
      expect(mockSqs.send).toHaveBeenNthCalledWith(3, {
        QueueUrl: mockQueueUrl,
        DelaySeconds: 900,
        MessageBody: JSON.stringify(message),
      })
    })
  })

  describe('message received from queue while not suspended', () => {
    const message = { caseId: uuid() } as Message
    const receiptHandle = uuid()
    const callback = jest.fn().mockResolvedValueOnce(true)
    const shouldSuspend = jest
      .fn()
      .mockReturnValueOnce({ suspend: false, delaySeconds: 0 })

    beforeEach(async () => {
      setMocks([
        {
          Messages: [
            { ReceiptHandle: receiptHandle, Body: JSON.stringify(message) },
          ],
        },
      ])

      await givenWhenThen(callback, shouldSuspend)
    })

    it('should handle the message normally', () => {
      expect(callback).toHaveBeenCalledWith(message)
      expect(mockSqs.send).toHaveBeenNthCalledWith(3, {
        QueueUrl: mockQueueUrl,
        ReceiptHandle: receiptHandle,
      })
    })
  })

  describe('message received from queue but not handled by callback during last retry', () => {
    const message = {
      caseId: uuid(),
      numberOfRetries: config.maxNumberOfRetries,
    } as Message
    const receiptHandle = uuid()
    const callback = jest.fn().mockResolvedValueOnce(false)

    beforeEach(async () => {
      setMocks([
        {
          Messages: [
            { ReceiptHandle: receiptHandle, Body: JSON.stringify(message) },
          ],
        },
      ])

      await givenWhenThen(callback)
    })

    it('should not retry message', async () => {
      expect(mockSqs.send).toHaveBeenNthCalledWith(2, {
        QueueUrl: mockQueueUrl,
        MaxNumberOfMessages: config.maxNumberOfMessages,
        WaitTimeSeconds: config.waitTimeSeconds,
      })
      expect(callback).toHaveBeenCalledWith(message)
      expect(mockSqs.send).toHaveBeenNthCalledWith(3, {
        QueueUrl: mockQueueUrl,
        ReceiptHandle: receiptHandle,
      })
    })
  })

  describe('message not received from queue', () => {
    const callback = jest.fn()

    beforeEach(async () => {
      setMocks([
        {
          Messages: [],
        },
      ])

      await givenWhenThen(callback)
    })

    it('should not receive a message', async () => {
      expect(mockSqs.send).toHaveBeenNthCalledWith(2, {
        QueueUrl: mockQueueUrl,
        MaxNumberOfMessages: config.maxNumberOfMessages,
        WaitTimeSeconds: config.waitTimeSeconds,
      })
      expect(callback).not.toHaveBeenCalled()
    })
  })
})
