import { v4 as uuid } from 'uuid'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { AppealCase, Case } from '../../../repository'
import { UserInitiatedAppealNotificationType } from '../../dto/appealNotification.dto'
import { SendNotificationResponse } from '../../models/sendNotification.response'

jest.mock('../../../../factories')

interface Then {
  result: SendNotificationResponse
  error: Error
}

type GivenWhenThen = (caseId: string) => Promise<Then>

describe('NotificationController - Send appeal files updated notifications', () => {
  const userId = uuid()
  const user = { id: userId } as User
  const appealCaseId = uuid()

  let mockQueuedMessages: Message[]
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { queuedMessages, notificationController } =
      await createTestingNotificationModule()

    mockQueuedMessages = queuedMessages

    givenWhenThen = async (caseId) => {
      const then = {} as Then

      await notificationController
        .sendAppealNotification(
          caseId,
          user,
          { id: caseId, appealCase: { id: appealCaseId } } as Case,
          { id: appealCaseId } as AppealCase,
          {
            type: UserInitiatedAppealNotificationType.APPEAL_CASE_FILES_UPDATED,
          },
        )
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

    it('should queue message for delivery', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          user,
          caseId,
          elementId: appealCaseId,
          body: { type: AppealCaseNotificationType.APPEAL_CASE_FILES_UPDATED },
        },
      ])
      expect(then.result).toEqual({ notificationSent: true })
    })
  })
})
