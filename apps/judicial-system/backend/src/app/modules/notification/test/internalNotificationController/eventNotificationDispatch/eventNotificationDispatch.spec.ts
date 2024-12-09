import { uuid } from 'uuidv4'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  EventNotificationType,
  IndictmentCaseNotificationType,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../../createTestingNotificationModule'

import { Case } from '../../../../case'
import { InternalNotificationController } from '../../../internalNotification.controller'

describe('InternalNotificationController - Dispatch event notifications', () => {
  const theCase = { id: uuid() } as Case
  let mockMessageService: MessageService
  let internalNotificationController: InternalNotificationController

  beforeEach(async () => {
    const { messageService, internalNotificationController: controller } =
      await createTestingNotificationModule()

    mockMessageService = messageService
    internalNotificationController = controller

    const mockSendMessagesToQueue =
      messageService.sendMessagesToQueue as jest.Mock
    mockSendMessagesToQueue.mockResolvedValueOnce(undefined)
  })

  const notificationScenarios = [
    {
      notificationType:
        EventNotificationType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
      expectedMessage: {
        type: MessageType.INDICTMENT_CASE_NOTIFICATION,
        caseId: theCase.id,
        body: {
          type: IndictmentCaseNotificationType.INDICTMENT_VERDICT_INFO,
        },
      },
    },
  ]

  it.each(
    notificationScenarios.map(({ notificationType, expectedMessage }) => ({
      notificationType,
      expectedMessage,
      description: `should send message to queue for notification type ${notificationType}`,
    })),
  )('$description', async ({ notificationType, expectedMessage }) => {
    const result =
      await internalNotificationController.dispatchEventNotification(
        theCase.id,
        theCase,
        { type: notificationType },
      )

    expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
      expectedMessage,
    ])
    expect(result).toEqual({ delivered: true })
  })

  it('will fail if a new EventNotificationType is missing from the tests', () => {
    const allNotificationTypes = Object.values(EventNotificationType)
    const testedNotificationTypes = notificationScenarios.map(
      (scenario) => scenario.notificationType,
    )

    const missingNotificationTypes = allNotificationTypes.filter(
      (type) => !testedNotificationTypes.includes(type),
    )

    expect(missingNotificationTypes).toEqual([])
  })
})
