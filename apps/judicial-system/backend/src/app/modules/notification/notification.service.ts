import _uniqBy from 'lodash/uniqBy'

import { Injectable, InternalServerErrorException } from '@nestjs/common'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import { type User } from '@island.is/judicial-system/types'
import {
  CaseNotificationType,
  CaseState,
} from '@island.is/judicial-system/types'

import { EventService } from '../event'
import { type Case } from '../repository'
import { SendNotificationResponse } from './models/sendNotification.response'

@Injectable()
export class NotificationService {
  constructor(private readonly eventService: EventService) {}

  private addMessageForNotificationToQueue(
    type: CaseNotificationType,
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
    type: CaseNotificationType,
    eventOnly = false,
    theCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    switch (type) {
      case CaseNotificationType.READY_FOR_COURT:
        this.addMessageForNotificationToQueue(type, user, theCase)

        if (theCase.state === CaseState.RECEIVED) {
          addMessagesToQueue({
            type: MessageType.DELIVERY_TO_COURT_REQUEST,
            user,
            caseId: theCase.id,
          })
        }
        break
      case CaseNotificationType.COURT_DATE:
        if (eventOnly) {
          this.eventService.postEvent('SCHEDULE_COURT_DATE', theCase, true)

          // We still want to send the defender a link to the case even if
          // the judge chooses not to send a calendar invitation
          // Note: This is only relevant for non-indictment cases
          this.addMessageForNotificationToQueue(
            CaseNotificationType.ADVOCATE_ASSIGNED,
            user,
            theCase,
          )
        } else {
          this.addMessageForNotificationToQueue(type, user, theCase)
        }
        break
      case CaseNotificationType.HEADS_UP:
      case CaseNotificationType.APPEAL_JUDGES_ASSIGNED:
      case CaseNotificationType.APPEAL_CASE_FILES_UPDATED:
      case CaseNotificationType.CASE_FILES_UPDATED:
      case CaseNotificationType.RULING_ORDER_ADDED:
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
