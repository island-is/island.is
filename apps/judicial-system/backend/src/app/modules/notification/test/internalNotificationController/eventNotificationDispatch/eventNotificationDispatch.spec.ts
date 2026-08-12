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

import { Case, CaseFile, Defendant } from '../../../../repository'
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
  const setSuspendedDefendant = (
    indictmentRulingDecision: CaseIndictmentRulingDecision,
    serviceRequirement?: ServiceRequirement,
  ) =>
    ({
      ...baseCase,
      indictmentRulingDecision,
      defendants: [
        {
          isDrivingLicenseSuspended: true,
          verdicts: serviceRequirement ? [{ serviceRequirement }] : [],
        },
      ] as Defendant[],
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
      theCase: setSuspendedDefendant(
        CaseIndictmentRulingDecision.RULING,
        ServiceRequirement.NOT_REQUIRED,
      ),
      scenarioDescription:
        'driving license suspension with service not required',
      notificationType:
        EventNotificationType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
      expectedMessages: [
        {
          type: MessageType.INDICTMENT_CASE_NOTIFICATION,
          caseId,
          body: {
            type: IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
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
      theCase: setSuspendedDefendant(
        CaseIndictmentRulingDecision.RULING,
        ServiceRequirement.NOT_APPLICABLE,
      ),
      scenarioDescription:
        'driving license suspension with service not applicable',
      notificationType:
        EventNotificationType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
      expectedMessages: [
        {
          type: MessageType.INDICTMENT_CASE_NOTIFICATION,
          caseId,
          body: {
            type: IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
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
      theCase: setSuspendedDefendant(CaseIndictmentRulingDecision.FINE),
      scenarioDescription: 'driving license suspension with fine',
      notificationType:
        EventNotificationType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
      expectedMessages: [
        {
          type: MessageType.INDICTMENT_CASE_NOTIFICATION,
          caseId,
          body: {
            type: IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
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
      theCase: setSuspendedDefendant(
        CaseIndictmentRulingDecision.RULING,
        ServiceRequirement.REQUIRED,
      ),
      scenarioDescription: 'driving license suspension with service required',
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
    notificationScenarios.map((scenario) => ({
      ...scenario,
      description: `should send messages to queue for notification type ${
        scenario.notificationType
      }${scenario.theCase.type ? ` - ${scenario.theCase.type}` : ''}${
        'scenarioDescription' in scenario
          ? ` - ${scenario.scenarioDescription}`
          : ''
      }`,
    })),
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
})
