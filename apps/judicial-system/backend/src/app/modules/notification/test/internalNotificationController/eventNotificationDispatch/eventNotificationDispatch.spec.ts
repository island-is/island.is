import { v4 as uuid } from 'uuid'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CaseType,
  EventNotificationType,
  IndictmentCaseNotificationType,
  RequestCaseNotificationType,
  ServiceRequirement,
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

  let mockQueuedMessages: Message[]
  let internalNotificationController: InternalNotificationController

  beforeEach(async () => {
    const { queuedMessages, internalNotificationController: controller } =
      await createTestingNotificationModule()

    mockQueuedMessages = queuedMessages
    internalNotificationController = controller
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
      theCase: setCaseType(CaseType.CUSTODY),
      notificationType: EventNotificationType.COURT_DATE_SCHEDULED,
      expectedMessages: [
        {
          type: MessageType.NOTIFICATION,
          caseId,
          body: {
            type: RequestCaseNotificationType.COURT_DATE,
            userDescriptor: { name: user.name },
          },
        },
      ],
    },
    {
      theCase: setCaseType(CaseType.PHONE_TAPPING),
      notificationType: EventNotificationType.COURT_DATE_SCHEDULED,
      expectedMessages: [
        {
          type: MessageType.NOTIFICATION,
          caseId,
          body: {
            type: RequestCaseNotificationType.COURT_DATE,
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

    expect(mockQueuedMessages).toEqual(expectedMessages)
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

  describe('driving license suspension when indictment is sent to public prosecutor', () => {
    const suspensionMessage = {
      type: MessageType.INDICTMENT_CASE_NOTIFICATION,
      caseId,
      body: {
        type: IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
      },
    }
    const criminalRecordMessage = {
      type: MessageType.INDICTMENT_CASE_NOTIFICATION,
      caseId,
      body: {
        type: IndictmentCaseNotificationType.CRIMINAL_RECORD_FILES_UPLOADED,
      },
    }

    const suspensionScenarios = [
      {
        description:
          'should not send when suspended defendant still requires service but another defendant was present',
        theCase: {
          ...baseCase,
          defendants: [
            {
              id: uuid(),
              isDrivingLicenseSuspended: true,
              verdicts: [{ serviceRequirement: ServiceRequirement.REQUIRED }],
            },
            {
              id: uuid(),
              isDrivingLicenseSuspended: false,
              verdicts: [
                {
                  serviceRequirement: ServiceRequirement.NOT_APPLICABLE,
                },
              ],
            },
          ],
        } as Case,
        expectedMessages: [criminalRecordMessage],
      },
      {
        description:
          'should send once for a suspended defendant who was present at ruling',
        theCase: {
          ...baseCase,
          defendants: [
            {
              id: uuid(),
              isDrivingLicenseSuspended: true,
              verdicts: [
                {
                  serviceRequirement: ServiceRequirement.NOT_APPLICABLE,
                },
              ],
            },
            {
              id: uuid(),
              isDrivingLicenseSuspended: false,
              verdicts: [{ serviceRequirement: ServiceRequirement.REQUIRED }],
            },
          ],
        } as Case,
        expectedMessages: [suspensionMessage, criminalRecordMessage],
      },
      {
        description: 'should send once for each ready suspended defendant',
        theCase: {
          ...baseCase,
          defendants: [
            {
              id: uuid(),
              isDrivingLicenseSuspended: true,
              verdicts: [
                {
                  serviceRequirement: ServiceRequirement.NOT_APPLICABLE,
                },
              ],
            },
            {
              id: uuid(),
              isDrivingLicenseSuspended: true,
              verdicts: [
                {
                  serviceRequirement: ServiceRequirement.NOT_REQUIRED,
                },
              ],
            },
            {
              id: uuid(),
              isDrivingLicenseSuspended: true,
              verdicts: [{ serviceRequirement: ServiceRequirement.REQUIRED }],
            },
          ],
        } as Case,
        expectedMessages: [
          suspensionMessage,
          suspensionMessage,
          criminalRecordMessage,
        ],
      },
      {
        description:
          'should send once for each suspended defendant when ruling is a fine',
        theCase: {
          ...baseCase,
          indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
          defendants: [
            {
              id: uuid(),
              isDrivingLicenseSuspended: true,
              verdicts: [{ serviceRequirement: ServiceRequirement.REQUIRED }],
            },
            {
              id: uuid(),
              isDrivingLicenseSuspended: true,
              verdicts: [{ serviceRequirement: ServiceRequirement.REQUIRED }],
            },
          ],
        } as Case,
        expectedMessages: [
          suspensionMessage,
          suspensionMessage,
          criminalRecordMessage,
        ],
      },
    ]

    it.each(suspensionScenarios)(
      '$description',
      async ({ theCase, expectedMessages }) => {
        const result =
          await internalNotificationController.dispatchEventNotification(
            theCase.id,
            theCase,
            {
              type: EventNotificationType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
            },
          )

        expect(mockQueuedMessages).toEqual(expectedMessages)
        expect(result).toEqual({ delivered: true })
      },
    )
  })
})
