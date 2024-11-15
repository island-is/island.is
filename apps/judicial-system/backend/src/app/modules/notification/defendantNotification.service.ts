import { MessageDescriptor } from '@formatjs/intl'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { IntlService } from '@island.is/cms-translations'
import { EmailService } from '@island.is/email-service'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import { DEFENDER_INDICTMENT_ROUTE } from '@island.is/judicial-system/consts'
import {
  DefendantNotificationType,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

import { Case } from '../case'
import { Defendant } from '../defendant'
import { EventService } from '../event'
import { DeliverResponse } from './models/deliver.response'
import { Notification, Recipient } from './models/notification.model'
import { BaseNotificationService } from './baseNotification.service'
import { strings } from './defendantNotification.strings'
import { notificationModuleConfig } from './notification.config'

@Injectable()
export class DefendantNotificationService extends BaseNotificationService {
  constructor(
    @InjectModel(Notification)
    notificationModel: typeof Notification,
    @Inject(notificationModuleConfig.KEY)
    config: ConfigType<typeof notificationModuleConfig>,
    @Inject(LOGGER_PROVIDER) logger: Logger,
    intlService: IntlService,
    emailService: EmailService,
    eventService: EventService,
  ) {
    super(
      notificationModel,
      emailService,
      intlService,
      config,
      eventService,
      logger,
    )
  }

  private async sendEmails(
    defendant: Defendant,
    theCase: Case,
    notificationType: DefendantNotificationType,
    subject: MessageDescriptor,
    body: MessageDescriptor,
  ) {
    const courtName = theCase.court?.name
    const defenderHasAccessToRVG = !!defendant.defenderNationalId
    const formattedSubject = this.formatMessage(subject, {
      courtName,
    })
    const formattedBody = this.formatMessage(body, {
      courtName,
      courtCaseNumber: theCase.courtCaseNumber,
      defenderHasAccessToRVG,
      linkStart: `<a href="${this.config.clientUrl}${DEFENDER_INDICTMENT_ROUTE}/${theCase.id}">`,
      linkEnd: '</a>',
    })
    const promises: Promise<Recipient>[] = []

    if (defendant.defenderEmail) {
      promises.push(
        this.sendEmail(
          formattedSubject,
          formattedBody,
          defendant.defenderName,
          defendant.defenderEmail,
          undefined,
          true,
        ),
      )
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(theCase.id, notificationType, recipients)
  }

  private shouldSendDefenderAssignedNotification(
    theCase: Case,
    defendant: Defendant,
  ): boolean {
    if (!defendant.defenderEmail || !defendant.isDefenderChoiceConfirmed) {
      return false
    }

    if (isIndictmentCase(theCase.type)) {
      const hasSentNotificationBefore = this.hasReceivedNotification(
        DefendantNotificationType.DEFENDER_ASSIGNED,
        defendant.defenderEmail,
        theCase.notifications,
      )

      if (!hasSentNotificationBefore) {
        return true
      }
    }
    return false
  }

  private async sendDefenderAssignedNotification(
    defendant: Defendant,
    theCase: Case,
  ): Promise<DeliverResponse> {
    const shouldSend = this.shouldSendDefenderAssignedNotification(
      theCase,
      defendant,
    )

    if (shouldSend) {
      return this.sendEmails(
        defendant,
        theCase,
        DefendantNotificationType.DEFENDER_ASSIGNED,
        strings.defenderAssignedSubject,
        strings.defenderAssignedBody,
      )
    }

    // Nothing should be sent so we return a successful response
    return { delivered: true }
  }

  private sendNotification(
    notificationType: DefendantNotificationType,
    defendant: Defendant,
    theCase: Case,
  ): Promise<DeliverResponse> {
    switch (notificationType) {
      case DefendantNotificationType.DEFENDER_ASSIGNED:
        return this.sendDefenderAssignedNotification(defendant, theCase)
      default:
        throw new InternalServerErrorException(
          `Invalid notification type: ${notificationType}`,
        )
    }
  }

  async sendDefendantNotification(
    type: DefendantNotificationType,
    defendant: Defendant,
    theCase: Case,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()
    try {
      return await this.sendNotification(type, defendant, theCase)
    } catch (error) {
      this.logger.error('Failed to send notification', error)

      return { delivered: false }
    }
  }
}
