import { SQS } from 'aws-sdk'
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
  let mockQueueUrl: string
  let mockSqs: SQS
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { queueUrl, sqs, messageService } = await createTestingMessageModule()

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
      const mockReceiveMessage = mockSqs.receiveMessage as jest.Mock
      mockReceiveMessage.mockReturnValueOnce({
        promise: () =>
          Promise.resolve({
            Messages: [
              { ReceiptHandle: receiptHandle, Body: JSON.stringify(message) },
            ],
          }),
      })

      await givenWhenThen(callback)
    })

    it('should handle message', async () => {
      expect(mockSqs.receiveMessage).toHaveBeenCalledWith({
        QueueUrl: mockQueueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 10,
      })
      expect(callback).toHaveBeenCalledWith(message)
      expect(mockSqs.deleteMessage).toHaveBeenCalledWith({
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
      const mockReceiveMessage = mockSqs.receiveMessage as jest.Mock
      mockReceiveMessage.mockReturnValueOnce({
        promise: () =>
          Promise.resolve({
            Messages: [
              { ReceiptHandle: receiptHandle, Body: JSON.stringify(message) },
            ],
          }),
      })

      await givenWhenThen(callback)
    })

    it('should not handle message', async () => {
      expect(mockSqs.receiveMessage).toHaveBeenCalledWith({
        QueueUrl: mockQueueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 10,
      })
      expect(callback).toHaveBeenCalledWith(message)
      expect(mockSqs.deleteMessage).not.toHaveBeenCalled()
    })
  })

  describe('message not received from queue', () => {
    const callback = jest.fn()

    beforeEach(async () => {
      const mockReceiveMessage = mockSqs.receiveMessage as jest.Mock
      mockReceiveMessage.mockReturnValueOnce({
        promise: () =>
          Promise.resolve({
            Messages: [],
          }),
      })

      await givenWhenThen(callback)
    })

    it('should not receive a message', async () => {
      expect(mockSqs.receiveMessage).toHaveBeenCalledWith({
        QueueUrl: mockQueueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 10,
      })
      expect(callback).not.toHaveBeenCalledWith()
      expect(mockSqs.deleteMessage).not.toHaveBeenCalled()
    })
  })
})
