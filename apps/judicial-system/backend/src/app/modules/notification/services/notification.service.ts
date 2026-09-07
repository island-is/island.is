import { Injectable, InternalServerErrorException } from '@nestjs/common'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import { CaseState, type User } from '@island.is/judicial-system/types'

import { type Case } from '../../repository'
import { UserInitiatedAppealNotificationType } from '../dto/appealNotification.dto'
import { UserInitiatedNotificationType } from '../dto/notification.dto'
import { SendNotificationResponse } from '../models/sendNotification.response'

@Injectable()
export class NotificationService {
  private addMessageForNotificationToQueue(
    type: UserInitiatedNotificationType,
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

  // The appeal case is resolved and validated against the case by
  // AppealCaseExistsGuard before this is called.
  async addMessagesForAppealNotificationToQueue(
    type: UserInitiatedAppealNotificationType,
    theCase: Case,
    user: User,
    appealCaseId: string,
  ): Promise<SendNotificationResponse> {
    switch (type) {
      case UserInitiatedAppealNotificationType.APPEAL_CASE_FILES_UPDATED:
        addMessagesToQueue({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          user,
          caseId: theCase.id,
          elementId: appealCaseId,
          body: { type },
        })
        break
      default:
        throw new InternalServerErrorException(
          `Invalid appeal notification type ${type}`,
        )
    }

    return { notificationSent: true }
  }

  async addMessagesForNotificationToQueue(
    type: UserInitiatedNotificationType,
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
      case UserInitiatedNotificationType.ADVOCATE_ASSIGNED:
      case UserInitiatedNotificationType.HEADS_UP:
      case UserInitiatedNotificationType.CASE_FILES_UPDATED:
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
