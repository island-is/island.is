import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CaseNotificationType,
  EventNotificationType,
  IndictmentCaseNotificationType,
  InstitutionNotificationType,
  InstitutionType,
  isIndictmentCase,
  NotificationDispatchType,
  prosecutorsOfficeTypes,
  ServiceRequirement,
  UserDescriptor,
} from '@island.is/judicial-system/types'

import { InstitutionService } from '../institution'
import { Case, Institution } from '../repository'
import { DeliverResponse } from './models/deliver.response'

@Injectable()
export class NotificationDispatchService {
  constructor(
    private readonly institutionService: InstitutionService,
    private readonly messageService: MessageService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async dispatchIndictmentsWaitingForConfirmationNotification(): Promise<void> {
    const prosecutorsOffices = await this.institutionService.getAll(
      prosecutorsOfficeTypes,
    )

    const messages = prosecutorsOffices.map(
      (prosecutorsOffice: Institution) => ({
        type: MessageType.INSTITUTION_NOTIFICATION,
        body: {
          type: InstitutionNotificationType.INDICTMENTS_WAITING_FOR_CONFIRMATION,
          prosecutorsOfficeId: prosecutorsOffice.id,
        },
      }),
    )

    return this.messageService.sendMessagesToQueue(messages)
  }

  private async dispatchPublicProsecutorVerdictAppealDeadlineReminderNotification(): Promise<void> {
    const publicProsecutorOffices = await this.institutionService.getAll([
      InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
    ])

    const messages = publicProsecutorOffices.map(
      (prosecutorsOffice: Institution) => ({
        type: MessageType.INSTITUTION_NOTIFICATION,
        body: {
          type: InstitutionNotificationType.PUBLIC_PROSECUTOR_VERDICT_APPEAL_DEADLINE_REMINDER,
          prosecutorsOfficeId: prosecutorsOffice.id,
        },
      }),
    )

    return this.messageService.sendMessagesToQueue(messages)
  }

  async dispatchNotification(
    type: NotificationDispatchType,
  ): Promise<DeliverResponse> {
    try {
      switch (type) {
        case NotificationDispatchType.INDICTMENTS_WAITING_FOR_CONFIRMATION:
          await this.dispatchIndictmentsWaitingForConfirmationNotification()
          break
        case NotificationDispatchType.PUBLIC_PROSECUTOR_VERDICT_APPEAL_DEADLINE_REMINDER:
          await this.dispatchPublicProsecutorVerdictAppealDeadlineReminderNotification()
          break
        default:
          throw new InternalServerErrorException(
            `Invalid notification type ${type}`,
          )
      }
    } catch (error) {
      this.logger.error('Failed to dispatch notification', error)

      return { delivered: false }
    }

    return { delivered: true }
  }

  private criminalRecordFileUpdateMessages(theCase: Case) {
    const hasCriminalRecordFiles = theCase.caseFiles?.some(
      (file) => file.category === CaseFileCategory.CRIMINAL_RECORD_UPDATE,
    )
    if (hasCriminalRecordFiles) {
      return [
        {
          type: MessageType.INDICTMENT_CASE_NOTIFICATION,
          caseId: theCase.id,
          body: {
            type: IndictmentCaseNotificationType.CRIMINAL_RECORD_FILES_UPLOADED,
          },
        },
      ]
    }
    return []
  }

  private async dispatchIndictmentCriminalRecordFileUpdate(
    theCase: Case,
  ): Promise<void> {
    const messages = this.criminalRecordFileUpdateMessages(theCase)
    return this.messageService.sendMessagesToQueue(messages)
  }

  private async dispatchIndictmentSentToPublicProsecutorNotifications(
    theCase: Case,
  ): Promise<void> {
    const hasDrivingLicenseSuspension = theCase.defendants?.some((defendant) =>
      defendant.verdicts?.some((verdict) => verdict.isDrivingLicenseSuspended),
    )

    const hasServiceRequirementNotApplicable = theCase.defendants?.some(
      (defendant) =>
        defendant.verdicts?.some(
          (verdict) =>
            verdict.serviceRequirement === ServiceRequirement.NOT_APPLICABLE,
        ),
    )

    const isFine =
      theCase.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE

    const messages = [
      {
        type: MessageType.INDICTMENT_CASE_NOTIFICATION,
        caseId: theCase.id,
        body: {
          type: IndictmentCaseNotificationType.INDICTMENT_VERDICT_INFO,
        },
      },
      ...(hasDrivingLicenseSuspension &&
      (isFine || hasServiceRequirementNotApplicable)
        ? [
            {
              type: MessageType.INDICTMENT_CASE_NOTIFICATION,
              caseId: theCase.id,
              body: {
                type: IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENDED,
              },
            },
          ]
        : []),
    ]

    return this.messageService.sendMessagesToQueue([
      ...messages,
      ...this.criminalRecordFileUpdateMessages(theCase),
    ])
  }

  private async dispatchCourtDateNotifications(
    theCase: Case,
    userDescriptor?: UserDescriptor,
  ): Promise<void> {
    const messages = []
    if (isIndictmentCase(theCase.type)) {
      messages.push({
        type: MessageType.INDICTMENT_CASE_NOTIFICATION,
        caseId: theCase.id,
        body: {
          type: IndictmentCaseNotificationType.COURT_DATE,
          userDescriptor,
        },
      })
    } else {
      messages.push({
        type: MessageType.NOTIFICATION,
        caseId: theCase.id,
        body: {
          type: CaseNotificationType.COURT_DATE,
          userDescriptor,
        },
      })
    }

    return this.messageService.sendMessagesToQueue(messages)
  }

  async dispatchEventNotification(
    type: EventNotificationType,
    theCase: Case,
    userDescriptor?: UserDescriptor,
  ): Promise<DeliverResponse> {
    try {
      switch (type) {
        case EventNotificationType.COURT_DATE_SCHEDULED:
          await this.dispatchCourtDateNotifications(theCase, userDescriptor)
          break
        case EventNotificationType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR:
          await this.dispatchIndictmentSentToPublicProsecutorNotifications(
            theCase,
          )
          break
        case EventNotificationType.INDICTMENT_CRIMINAL_RECORD_UPDATED_BY_COURT:
          await this.dispatchIndictmentCriminalRecordFileUpdate(theCase)
          break
        default:
          throw new InternalServerErrorException(
            `Invalid notification type ${type}`,
          )
      }
    } catch (error) {
      this.logger.error('Failed to dispatch event notification', error)

      return { delivered: false }
    }

    return { delivered: true }
  }
}
