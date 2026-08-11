import { v4 as uuid } from 'uuid'

import { Message, MessageType } from '@island.is/judicial-system/message'
import { User } from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { Case } from '../../../repository'
import { UserInitiatedNotificationType } from '../../dto/notification.dto'
import { SendNotificationResponse } from '../../models/sendNotification.response'

interface Then {
  result: SendNotificationResponse
  error: Error
}

type GivenWhenThen = (caseId: string) => Promise<Then>

describe('NotificationController - Send advocate assigned notification', () => {
  const userId = uuid()
  const user = { id: userId } as User

  let mockQueuedMessages: Message[]
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { queuedMessages, notificationController } =
      await createTestingNotificationModule()

    mockQueuedMessages = queuedMessages

    givenWhenThen = async (caseId) => {
      const then = {} as Then

      await notificationController
        .sendCaseNotification(caseId, user, { id: caseId } as Case, {
          type: UserInitiatedNotificationType.ADVOCATE_ASSIGNED,
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
      then = await givenWhenThen(caseId)
    })

    it('should send advocate assigned message to queue', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: UserInitiatedNotificationType.ADVOCATE_ASSIGNED },
        },
      ])
      expect(then.result).toEqual({ notificationSent: true })
    })
  })
})
