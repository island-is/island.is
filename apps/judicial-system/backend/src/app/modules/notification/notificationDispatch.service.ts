import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CaseNotificationType,
  EventNotificationType,
  IndictmentCaseNotificationType,
  InstitutionNotificationType,
  InstitutionType,
  isIndictmentCase,
  NotificationDispatchType,
  prosecutorsOfficeTypes,
  UserDescriptor,
} from '@island.is/judicial-system/types'

import { InstitutionService } from '../institution'
import { Case } from '../repository'
import { DeliverResponse } from './models/deliver.response'

@Injectable()
export class NotificationDispatchService {
  constructor(
    private readonly institutionService: InstitutionService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async dispatchIndictmentsWaitingForConfirmationNotification(): Promise<void> {
    const prosecutorsOffices = await this.institutionService.getAll(
      prosecutorsOfficeTypes,
    )

    for (const prosecutorsOffice of prosecutorsOffices) {
      addMessagesToQueue({
        type: MessageType.INSTITUTION_NOTIFICATION,
        body: {
          type: InstitutionNotificationType.INDICTMENTS_WAITING_FOR_CONFIRMATION,
          prosecutorsOfficeId: prosecutorsOffice.id,
        },
      })
    }
  }

  private async dispatchPublicProsecutorVerdictAppealDeadlineReminderNotification(): Promise<void> {
    const publicProsecutorOffices = await this.institutionService.getAll([
      InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
    ])

    for (const prosecutorsOffice of publicProsecutorOffices) {
      addMessagesToQueue({
        type: MessageType.INSTITUTION_NOTIFICATION,
        body: {
          type: InstitutionNotificationType.PUBLIC_PROSECUTOR_VERDICT_APPEAL_DEADLINE_REMINDER,
          prosecutorsOfficeId: prosecutorsOffice.id,
        },
      })
    }
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

  private addMessagesForCriminalRecordFileUpdateToQueue(theCase: Case): void {
    const hasCriminalRecordFiles = theCase.caseFiles?.some(
      (file) => file.category === CaseFileCategory.CRIMINAL_RECORD_UPDATE,
    )

    if (hasCriminalRecordFiles) {
      addMessagesToQueue({
        type: MessageType.INDICTMENT_CASE_NOTIFICATION,
        caseId: theCase.id,
        body: {
          type: IndictmentCaseNotificationType.CRIMINAL_RECORD_FILES_UPLOADED,
        },
      })
    }
  }

  private dispatchIndictmentCriminalRecordFileUpdate(theCase: Case): void {
    this.addMessagesForCriminalRecordFileUpdateToQueue(theCase)
  }

  private dispatchIndictmentSentToPublicProsecutorNotifications(
    theCase: Case,
  ): void {
    addMessagesToQueue({
      type: MessageType.INDICTMENT_CASE_NOTIFICATION,
      caseId: theCase.id,
      body: {
        type: IndictmentCaseNotificationType.INDICTMENT_VERDICT_INFO,
      },
    })
    this.addMessagesForCriminalRecordFileUpdateToQueue(theCase)
  }

  private dispatchCourtDateNotifications(
    theCase: Case,
    userDescriptor?: UserDescriptor,
  ): void {
    if (isIndictmentCase(theCase.type)) {
      addMessagesToQueue({
        type: MessageType.INDICTMENT_CASE_NOTIFICATION,
        caseId: theCase.id,
        body: {
          type: IndictmentCaseNotificationType.COURT_DATE,
          userDescriptor,
        },
      })
    } else {
      addMessagesToQueue({
        type: MessageType.NOTIFICATION,
        caseId: theCase.id,
        body: {
          type: CaseNotificationType.COURT_DATE,
          userDescriptor,
        },
      })
    }
  }

  async dispatchEventNotification(
    type: EventNotificationType,
    theCase: Case,
    userDescriptor?: UserDescriptor,
  ): Promise<DeliverResponse> {
    try {
      switch (type) {
        case EventNotificationType.COURT_DATE_SCHEDULED:
          this.dispatchCourtDateNotifications(theCase, userDescriptor)
          break
        case EventNotificationType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR:
          this.dispatchIndictmentSentToPublicProsecutorNotifications(theCase)
          break
        case EventNotificationType.INDICTMENT_CRIMINAL_RECORD_UPDATED_BY_COURT:
          this.dispatchIndictmentCriminalRecordFileUpdate(theCase)
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
