import { v4 as uuid } from 'uuid'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  CaseNotificationType,
  CaseState,
  User,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { Case } from '../../../repository'
import { SendNotificationResponse } from '../../models/sendNotification.response'

interface Then {
  result: SendNotificationResponse
  error: Error
}

type GivenWhenThen = (theCase: Case) => Promise<Then>

describe('NotificationController - Send ready for court notification', () => {
  const userId = uuid()
  const user = { id: userId } as User

  let mockQueuedMessages: Message[]
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { queuedMessages, notificationController } =
      await createTestingNotificationModule()

    mockQueuedMessages = queuedMessages

    givenWhenThen = async (theCase) => {
      const then = {} as Then

      await notificationController
        .sendCaseNotification(theCase.id, user, theCase, {
          type: CaseNotificationType.READY_FOR_COURT,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('message queued', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({ id: caseId } as Case)
    })

    it('should send message to queue', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: CaseNotificationType.READY_FOR_COURT },
        },
      ])
      expect(then.result).toEqual({ notificationSent: true })
    })
  })

  describe('messages queued for received case', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        id: caseId,
        state: CaseState.RECEIVED,
      } as Case)
    })

    it('should send messages to queue', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: CaseNotificationType.READY_FOR_COURT },
        },
        { type: MessageType.DELIVERY_TO_COURT_REQUEST, user, caseId },
      ])
      expect(then.result).toEqual({ notificationSent: true })
    })
  })
})
