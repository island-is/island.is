import { v4 as uuid } from 'uuid'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import { CaseNotificationType, User } from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../createTestingNotificationModule'

import { Case } from '../../../repository'
import { SendNotificationResponse } from '../../models/sendNotification.response'

interface Then {
  result: SendNotificationResponse
  error: Error
}

type GivenWhenThen = (caseId: string, eventOnly?: boolean) => Promise<Then>

describe('NotificationController - Send court date notification', () => {
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

    givenWhenThen = async (caseId, eventOnly) => {
      const then = {} as Then

      await notificationController
        .sendCaseNotification(caseId, user, { id: caseId } as Case, {
          type: CaseNotificationType.COURT_DATE,
          eventOnly,
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
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: CaseNotificationType.COURT_DATE },
        },
      ])
      expect(then.result).toEqual({ notificationSent: true })
    })
  })

  describe('message with event only queued', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, true)
    })

    it('should send defender assigned message to queue', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: CaseNotificationType.ADVOCATE_ASSIGNED },
        },
      ])
      expect(then.result).toEqual({ notificationSent: true })
    })
  })
})
