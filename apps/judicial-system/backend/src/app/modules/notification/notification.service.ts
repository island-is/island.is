import { Injectable, InternalServerErrorException } from '@nestjs/common'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  IndictmentCaseNotificationType,
  type User,
} from '@island.is/judicial-system/types'
import {
  CaseState,
  RequestCaseNotificationType,
} from '@island.is/judicial-system/types'

import { EventService } from '../event'
import { type Case } from '../repository'
import { SendNotificationResponse } from './models/sendNotification.response'

@Injectable()
export class NotificationService {
  constructor(private readonly eventService: EventService) {}

  private addMessageForNotificationToQueue(
    type: RequestCaseNotificationType,
    user: User,
    theCase: Case,
  ): void {
    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type },
    })
  }

  async addMessagesForNotificationToQueue(
    type: RequestCaseNotificationType,
    eventOnly = false,
    theCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    switch (type) {
      case RequestCaseNotificationType.READY_FOR_COURT:
        this.addMessageForNotificationToQueue(type, user, theCase)

        if (theCase.state === CaseState.RECEIVED) {
          addMessagesToQueue({
            type: MessageType.DELIVERY_TO_COURT_REQUEST,
            user,
            caseId: theCase.id,
          })
        }
        break
      case RequestCaseNotificationType.COURT_DATE:
        if (eventOnly) {
          this.eventService.postEvent('SCHEDULE_COURT_DATE', theCase, true)

          // We still want to send the defender a link to the case even if
          // the judge chooses not to send a calendar invitation
          // Note: This is only relevant for non-indictment cases
          this.addMessageForNotificationToQueue(
            RequestCaseNotificationType.ADVOCATE_ASSIGNED,
            user,
            theCase,
          )
        } else {
          this.addMessageForNotificationToQueue(type, user, theCase)
        }
        break
      case RequestCaseNotificationType.HEADS_UP:
      case AppealCaseNotificationType.APPEAL_JUDGES_ASSIGNED as string:
      case AppealCaseNotificationType.APPEAL_CASE_FILES_UPDATED as string:
      case RequestCaseNotificationType.CASE_FILES_UPDATED:
      case IndictmentCaseNotificationType.RULING_ORDER_ADDED as string:
        this.addMessageForNotificationToQueue(type, user, theCase)
        break
      default:
        throw new InternalServerErrorException(
          `Invalid notification type ${type}`,
        )
    }

    return { notificationSent: true }
  }
}
