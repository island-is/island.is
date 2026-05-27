import { Injectable, InternalServerErrorException } from '@nestjs/common'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  CaseState,
  RequestCaseNotificationType,
  type User,
} from '@island.is/judicial-system/types'

import { EventService } from '../event'
import { type Case } from '../repository'
import { UserInitiatedNotificationType } from './dto/notification.dto'
import { SendNotificationResponse } from './models/sendNotification.response'

@Injectable()
export class NotificationService {
  constructor(private readonly eventService: EventService) {}

  private addMessageForNotificationToQueue(
    type:
      | UserInitiatedNotificationType
      | RequestCaseNotificationType.ADVOCATE_ASSIGNED,
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
    type: UserInitiatedNotificationType,
    eventOnly = false,
    theCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    switch (type) {
      case UserInitiatedNotificationType.READY_FOR_COURT:
        this.addMessageForNotificationToQueue(type, user, theCase)

        if (theCase.state === CaseState.RECEIVED) {
          addMessagesToQueue({
            type: MessageType.DELIVERY_TO_COURT_REQUEST,
            user,
            caseId: theCase.id,
          })
        }
        break
      case UserInitiatedNotificationType.COURT_DATE:
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
      case UserInitiatedNotificationType.HEADS_UP:
      case UserInitiatedNotificationType.APPEAL_JUDGES_ASSIGNED as string:
      case UserInitiatedNotificationType.APPEAL_CASE_FILES_UPDATED as string:
      case UserInitiatedNotificationType.CASE_FILES_UPDATED:
      case UserInitiatedNotificationType.RULING_ORDER_ADDED as string:
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
