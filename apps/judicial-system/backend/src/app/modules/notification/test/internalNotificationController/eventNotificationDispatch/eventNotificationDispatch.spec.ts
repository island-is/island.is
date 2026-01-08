import { v4 as uuid } from 'uuid'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CaseNotificationType,
  CaseType,
  EventNotificationType,
  IndictmentCaseNotificationType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingNotificationModule } from '../../createTestingNotificationModule'

import { Case, CaseFile } from '../../../../repository'
import { InternalNotificationController } from '../../../internalNotification.controller'

describe('InternalNotificationController - Dispatch event notifications', () => {
  const caseId = uuid()
  const baseCase = {
    id: caseId,
    caseFiles: [
      {
        category: CaseFileCategory.CRIMINAL_RECORD_UPDATE,
      },
    ] as CaseFile[],
  } as Case
  const setCaseType = (type: CaseType) =>
    ({
      ...baseCase,
      type,
    } as Case)

  const user = { id: uuid(), name: 'Test' } as User

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
      theCase: baseCase,
      notificationType:
        EventNotificationType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
      expectedMessages: [
        {
          type: MessageType.INDICTMENT_CASE_NOTIFICATION,
          caseId,
          body: {
            type: IndictmentCaseNotificationType.INDICTMENT_VERDICT_INFO,
          },
        },
        {
          type: MessageType.INDICTMENT_CASE_NOTIFICATION,
          caseId,
          body: {
            type: IndictmentCaseNotificationType.CRIMINAL_RECORD_FILES_UPLOADED,
          },
        },
      ],
    },
    {
      theCase: baseCase,
      notificationType:
        EventNotificationType.INDICTMENT_CRIMINAL_RECORD_UPDATED_BY_COURT,
      expectedMessages: [
        {
          type: MessageType.INDICTMENT_CASE_NOTIFICATION,
          caseId,
          body: {
            type: IndictmentCaseNotificationType.CRIMINAL_RECORD_FILES_UPLOADED,
          },
        },
      ],
    },
    {
      theCase: setCaseType(CaseType.INDICTMENT),
      notificationType: EventNotificationType.COURT_DATE_SCHEDULED,
      expectedMessages: [
        {
          type: MessageType.INDICTMENT_CASE_NOTIFICATION,
          caseId,
          body: {
            type: IndictmentCaseNotificationType.COURT_DATE,
            userDescriptor: { name: user.name },
          },
        },
      ],
    },
    {
      theCase: baseCase,
      notificationType: EventNotificationType.COURT_DATE_SCHEDULED,
      expectedMessages: [
        {
          type: MessageType.NOTIFICATION,
          caseId,
          body: {
            type: CaseNotificationType.COURT_DATE,
            userDescriptor: { name: user.name },
          },
        },
      ],
    },
  ]

  it.each(
    notificationScenarios.map(
      ({ theCase, notificationType, expectedMessages }) => ({
        theCase,
        notificationType,
        expectedMessages,
        description: `should send messages to queue for notification type ${notificationType} ${
          theCase.type ? `- ${theCase.type}` : ''
        }`,
      }),
    ),
  )('$description', async ({ theCase, notificationType, expectedMessages }) => {
    const result =
      await internalNotificationController.dispatchEventNotification(
        theCase.id,
        theCase,
        { type: notificationType, userDescriptor: { name: user.name } },
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
