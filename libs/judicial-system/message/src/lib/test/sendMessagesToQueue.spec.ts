import each from 'jest-each'
import { uuid } from 'uuidv4'
import { SQSClient } from '@aws-sdk/client-sqs'

import { User } from '@island.is/judicial-system/types'

import { CaseMessage, MessageType } from '../message'
import { createTestingMessageModule } from './createTestingMessageModule'

interface Then {
  result: void
  error: Error
}

type GivenWhenThen = (messages: CaseMessage[]) => Promise<Then>

describe('MessageService - Send messages to queue', () => {
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

    givenWhenThen = async (messages: CaseMessage[]) => {
      const then = {} as Then

      try {
        then.result = await messageService.sendMessagesToQueue(messages, true)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  each(Object.values(MessageType)).describe(
    'message posted to queue',
    (type) => {
      const user = { id: uuid() } as User
      const caseId = uuid()
      const message = { type, user, caseId }
      const messageId = uuid()

      beforeEach(async () => {
        setMocks([{ Entries: [{ MessageId: messageId }] }])

        await givenWhenThen([message])
      })

      it(`should post message ${type} to queue`, () => {
        expect(mockSqs.send).toHaveBeenCalledWith({
          QueueUrl: mockQueueUrl,
          Entries: [
            {
              Id: '0',
              MessageBody: JSON.stringify(message),
            },
          ],
        })
      })
    },
  )

  describe('message not posted to queue', () => {
    const message = { caseId: uuid() } as CaseMessage
    let then: Then

    beforeEach(async () => {
      setMocks([])

      then = await givenWhenThen([message])
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toEqual('Some error')
    })
  })
})
