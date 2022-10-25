import { SQSClient } from '@aws-sdk/client-sqs'
import { uuid } from 'uuidv4'

import { Message } from '../message'
import { createTestingMessageModule } from './createTestingMessageModule'

interface Then {
  result: void
  error: Error
}

type GivenWhenThen = (
  callback: (message: Message) => Promise<boolean>,
) => Promise<Then>

describe('MessageService - Receive message from queue', () => {
  let setMocks: (mocks: unknown[]) => void
  let mockQueueUrl: string
  let mockSqs: SQSClient
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      setSendMocks,
      queueUrl,
      sqs,
      messageService,
    } = await createTestingMessageModule()
    setMocks = setSendMocks

    mockQueueUrl = queueUrl
    mockSqs = sqs

    givenWhenThen = async (
      callback: (message: Message) => Promise<boolean>,
    ) => {
      const then = {} as Then

      try {
        then.result = await messageService.receiveMessageFromQueue(callback)
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
      expect(mockSqs.send).toHaveBeenCalledWith({
        QueueUrl: mockQueueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 10,
      })
      expect(callback).toHaveBeenCalledWith(message)
      expect(mockSqs.send).toHaveBeenCalledWith({
        QueueUrl: mockQueueUrl,
        ReceiptHandle: receiptHandle,
      })
    })
  })

  describe('message received from queue but not handled by callback', () => {
    const message = { caseId: uuid() } as Message
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

    it('should not handle message', async () => {
      expect(mockSqs.send).toHaveBeenCalledWith({
        QueueUrl: mockQueueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 10,
      })
      expect(callback).toHaveBeenCalledWith(message)
      expect(mockSqs.send).not.toHaveBeenCalledWith({
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
      expect(mockSqs.send).toHaveBeenCalledWith({
        QueueUrl: mockQueueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 10,
      })
      expect(callback).not.toHaveBeenCalled()
    })
  })
})
