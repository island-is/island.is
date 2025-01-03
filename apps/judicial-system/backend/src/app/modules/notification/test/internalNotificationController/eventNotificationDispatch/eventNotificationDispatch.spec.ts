import { uuid } from 'uuidv4'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  EventNotificationType,
  IndictmentCaseNotificationType,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../../createTestingNotificationModule'

import { Case } from '../../../../case'
import { CaseFile } from '../../../../file'
import { InternalNotificationController } from '../../../internalNotification.controller'

describe('InternalNotificationController - Dispatch event notifications', () => {
  const theCase = {
    id: uuid(),
    caseFiles: [
      {
        category: CaseFileCategory.CRIMINAL_RECORD_UPDATE,
      },
    ] as CaseFile[],
  } as Case

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
      expectedMessages: [
        {
          type: MessageType.INDICTMENT_CASE_NOTIFICATION,
          caseId: theCase.id,
          body: {
            type: IndictmentCaseNotificationType.INDICTMENT_VERDICT_INFO,
          },
        },
        {
          type: MessageType.INDICTMENT_CASE_NOTIFICATION,
          caseId: theCase.id,
          body: {
            type: IndictmentCaseNotificationType.CRIMINAL_RECORD_FILES_UPLOADED,
          },
        },
      ],
    },
  ]

  it.each(
    notificationScenarios.map(({ notificationType, expectedMessages }) => ({
      notificationType,
      expectedMessages,
      description: `should send messages to queue for notification type ${notificationType}`,
    })),
  )('$description', async ({ notificationType, expectedMessages }) => {
    const result =
      await internalNotificationController.dispatchEventNotification(
        theCase.id,
        theCase,
        { type: notificationType },
      )

    expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith(
      expectedMessages,
    )
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
