import { uuid } from 'uuidv4'
import each from 'jest-each'

import { QueueService } from '@island.is/message-queue'

import { MessageType, Message } from '../message'
import { createTestingMessageModule } from './createTestingMessageModule'

interface Then {
  result: string
  error: Error
}

type GivenWhenThen = (message: Message) => Promise<Then>

describe('MessageService - Post message to queue', () => {
  let mockQueueService: QueueService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { queueService, messageService } = await createTestingMessageModule()

    mockQueueService = queueService

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
        mockQueueService.add = jest.fn().mockResolvedValueOnce(messageId)

        then = await givenWhenThen(message)
      })

      it(`should post message ${type} to queue`, () => {
        expect(mockQueueService.add).toHaveBeenCalledWith(message)
        expect(then.result).toEqual(messageId)
      })
    },
  )
})
