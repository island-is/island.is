import { SQSClient } from '@aws-sdk/client-sqs'
import { uuid } from 'uuidv4'
import each from 'jest-each'

import { MessageType, Message } from '../message'
import { createTestingMessageModule } from './createTestingMessageModule'

interface Then {
  result: string
  error: Error
}

type GivenWhenThen = (message: Message) => Promise<Then>

describe('MessageService - Post message to queue', () => {
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

    givenWhenThen = async (message: Message) => {
      const then = {} as Then

      try {
        then.result = await messageService.postMessageToQueue(message)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  each(Object.values(MessageType)).describe(
    'message posted to queue',
    (type) => {
      const message = { type, caseId: uuid() }
      const messageId = uuid()
      let then: Then

      beforeEach(async () => {
        setMocks([{ MessageId: messageId }])

        then = await givenWhenThen(message)
      })

      it(`should post message ${type} to queue`, () => {
        expect(mockSqs.send).toHaveBeenCalledWith({
          QueueUrl: mockQueueUrl,
          MessageBody: JSON.stringify(message),
        })
        expect(then.result).toEqual(messageId)
      })
    },
  )

  describe('message not posted to queue', () => {
    const message = { caseId: uuid() } as Message
    let then: Then

    beforeEach(async () => {
      setMocks([])

      then = await givenWhenThen(message)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toEqual('Some error')
    })
  })
})
