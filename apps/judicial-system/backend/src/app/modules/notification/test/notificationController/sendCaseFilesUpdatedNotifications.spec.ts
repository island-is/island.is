import { v4 as uuid } from 'uuid'

import { Message, MessageType } from '@island.is/judicial-system/message'
import { CaseNotificationType, User } from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { Case } from '../../../repository'
import { SendNotificationResponse } from '../../models/sendNotification.response'

interface Then {
  result: SendNotificationResponse
  error: Error
}

type GivenWhenThen = (caseId: string) => Promise<Then>

describe('NotificationController - Send case files updated notification', () => {
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
          type: CaseNotificationType.CASE_FILES_UPDATED,
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

    it('should send message to queue', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: CaseNotificationType.CASE_FILES_UPDATED },
        },
      ])
      expect(then.result).toEqual({ notificationSent: true })
    })
  })
})
