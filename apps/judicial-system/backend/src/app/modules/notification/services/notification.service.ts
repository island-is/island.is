import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  CaseState,
  RequestCaseNotificationType,
  type User,
} from '@island.is/judicial-system/types'

import { EventService } from '../../event'
import { type Case } from '../../repository'
import { UserInitiatedNotificationType } from '../dto/notification.dto'
import { SendNotificationResponse } from '../models/sendNotification.response'

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

  // Resolves the appeal case the notification is about from the generic
  // properties bag, validating it belongs to the case. Works for both the
  // case-level appeal and ruling-order appeals.
  private resolveAppealCaseId(
    theCase: Case,
    properties?: { [key: string]: string },
  ): string {
    const appealCaseId = properties?.appealCaseId

    if (!appealCaseId) {
      throw new BadRequestException(
        'Missing appealCaseId for appeal case notification',
      )
    }

    const appealCaseExists =
      theCase.appealCase?.id === appealCaseId ||
      theCase.rulingOrderAppealCases?.some((a) => a.id === appealCaseId)

    if (!appealCaseExists) {
      throw new BadRequestException(
        `Appeal case ${appealCaseId} not found for case ${theCase.id}`,
      )
    }

    return appealCaseId
  }

  async addMessagesForNotificationToQueue(
    type: UserInitiatedNotificationType,
    eventOnly = false,
    theCase: Case,
    user: User,
    properties?: { [key: string]: string },
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
      case UserInitiatedNotificationType.APPEAL_CASE_FILES_UPDATED:
        addMessagesToQueue({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          user,
          caseId: theCase.id,
          elementId: this.resolveAppealCaseId(theCase, properties),
          body: { type },
        })
        break
      case UserInitiatedNotificationType.HEADS_UP:
      case UserInitiatedNotificationType.CASE_FILES_UPDATED:
      case UserInitiatedNotificationType.RULING_ORDER_ADDED:
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
