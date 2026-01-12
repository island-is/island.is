import { v4 as uuid } from 'uuid'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import { CaseNotificationType, User } from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { Case } from '../../../repository'
import { SendNotificationResponse } from '../../models/sendNotification.response'

jest.mock('../../../../factories')

interface Then {
  result: SendNotificationResponse
  error: Error
}

type GivenWhenThen = (caseId: string) => Promise<Then>

describe('NotificationController - Send appeal judges assigned notification', () => {
  const userId = uuid()
  const user = { id: userId } as User

  let mockMessageService: MessageService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { messageService, notificationController } =
      await createTestingNotificationModule()

    mockMessageService = messageService

    const mockSendMessagesToQueue =
      messageService.sendMessagesToQueue as jest.Mock
    mockSendMessagesToQueue.mockResolvedValue(undefined)

    givenWhenThen = async (caseId) => {
      const then = {} as Then

      await notificationController
        .sendCaseNotification(caseId, user, { id: caseId } as Case, {
          type: CaseNotificationType.APPEAL_JUDGES_ASSIGNED,
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

    it('should queue message for delivery', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: CaseNotificationType.APPEAL_JUDGES_ASSIGNED },
        },
      ])
      expect(then.result).toEqual({ notificationSent: true })
    })
  })
})
