import _uniqBy from 'lodash/uniqBy'

import { Injectable, InternalServerErrorException } from '@nestjs/common'

import {
  Message,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'
import { type User } from '@island.is/judicial-system/types'
import { CaseState, NotificationType } from '@island.is/judicial-system/types'

import { type Case } from '../case'
import { EventService } from '../event'
import { SendNotificationResponse } from './models/sendNotification.response'

@Injectable()
export class NotificationService {
  constructor(
    private readonly eventService: EventService,
    private readonly messageService: MessageService,
  ) {}

  private getNotificationMessage(
    type: NotificationType,
    user: User,
    theCase: Case,
  ): Message {
    return {
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type },
    }
  }

  async addNotificationMessagesToQueue(
    type: NotificationType,
    eventOnly = false,
    theCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    let messages: Message[]

    switch (type) {
      case NotificationType.READY_FOR_COURT:
        messages = [this.getNotificationMessage(type, user, theCase)]

        if (theCase.state === CaseState.RECEIVED) {
          messages.push({
            type: MessageType.DELIVERY_TO_COURT_REQUEST,
            user,
            caseId: theCase.id,
          })
        }
        break
      case NotificationType.COURT_DATE:
        if (eventOnly) {
          this.eventService.postEvent('SCHEDULE_COURT_DATE', theCase, true)

          // We still want to send the defender a link to the case even if
          // the judge chooses not to send a calendar invitation
          messages = [
            this.getNotificationMessage(
              NotificationType.ADVOCATE_ASSIGNED,
              user,
              theCase,
            ),
          ]
        } else {
          messages = [this.getNotificationMessage(type, user, theCase)]
        }
        break
      case NotificationType.HEADS_UP:
      case NotificationType.ADVOCATE_ASSIGNED:
      case NotificationType.APPEAL_JUDGES_ASSIGNED:
      case NotificationType.APPEAL_CASE_FILES_UPDATED:
      case NotificationType.SERVICE_STATUS_UPDATED:
      case NotificationType.DEFENDANT_SELECTED_DEFENDER:
        messages = [this.getNotificationMessage(type, user, theCase)]
        break
      default:
        throw new InternalServerErrorException(
          `Invalid notification type ${type}`,
        )
    }

    await this.messageService.sendMessagesToQueue(messages)

    return { notificationSent: true }
  }
}
