import _uniqBy from 'lodash/uniqBy'

import { Injectable, InternalServerErrorException } from '@nestjs/common'

import {
  Message,
  MessageService,
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
  constructor(
    private readonly eventService: EventService,
    private readonly messageService: MessageService,
  ) {}

  private getNotificationMessage(
    type: CaseNotificationType,
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
    type: CaseNotificationType,
    eventOnly = false,
    theCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    let messages: Message[]

    switch (type) {
      case CaseNotificationType.READY_FOR_COURT:
        messages = [this.getNotificationMessage(type, user, theCase)]

        if (theCase.state === CaseState.RECEIVED) {
          messages.push({
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
          messages = [
            this.getNotificationMessage(
              CaseNotificationType.ADVOCATE_ASSIGNED,
              user,
              theCase,
            ),
          ]
        } else {
          messages = [this.getNotificationMessage(type, user, theCase)]
        }
        break
      case CaseNotificationType.HEADS_UP:
      case CaseNotificationType.APPEAL_JUDGES_ASSIGNED:
      case CaseNotificationType.APPEAL_CASE_FILES_UPDATED:
      case CaseNotificationType.CASE_FILES_UPDATED:
      case CaseNotificationType.RULING_ORDER_ADDED:
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
