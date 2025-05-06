import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  EventNotificationType,
  IndictmentCaseNotificationType,
  InstitutionNotificationType,
  NotificationDispatchType,
  prosecutorsOfficeTypes,
} from '@island.is/judicial-system/types'

import { Case } from '../case'
import { Institution, InstitutionService } from '../institution'
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

  async dispatchNotification(
    type: NotificationDispatchType,
  ): Promise<DeliverResponse> {
    try {
      switch (type) {
        case NotificationDispatchType.INDICTMENTS_WAITING_FOR_CONFIRMATION:
          await this.dispatchIndictmentsWaitingForConfirmationNotification()
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

  private async dispatchIndictmentSentToPublicProsecutorNotifications(
    theCase: Case,
  ): Promise<void> {
    const messages = [
      {
        type: MessageType.INDICTMENT_CASE_NOTIFICATION,
        caseId: theCase.id,
        body: {
          type: IndictmentCaseNotificationType.INDICTMENT_VERDICT_INFO,
        },
      },
    ]
    const hasCriminalRecordFiles = theCase.caseFiles?.some(
      (file) => file.category === CaseFileCategory.CRIMINAL_RECORD_UPDATE,
    )
    if (hasCriminalRecordFiles) {
      messages.push({
        type: MessageType.INDICTMENT_CASE_NOTIFICATION,
        caseId: theCase.id,
        body: {
          type: IndictmentCaseNotificationType.CRIMINAL_RECORD_FILES_UPLOADED,
        },
      })
    }
    return this.messageService.sendMessagesToQueue(messages)
  }

  async dispatchEventNotification(
    type: EventNotificationType,
    theCase: Case,
  ): Promise<DeliverResponse> {
    try {
      switch (type) {
        case EventNotificationType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR:
          await this.dispatchIndictmentSentToPublicProsecutorNotifications(
            theCase,
          )
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
