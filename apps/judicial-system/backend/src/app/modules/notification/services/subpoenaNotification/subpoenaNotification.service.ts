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

import { ROUTE_HANDLER_ROUTE } from '@island.is/judicial-system/consts'
import { SubpoenaNotificationType } from '@island.is/judicial-system/types'

import { EventService } from '../../../event'
import { Case, Notification, Recipient } from '../../../repository'
import { BaseNotificationService } from '../../baseNotification.service'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'
import { strings } from './subpoenaNotification.strings'

@Injectable()
export class SubpoenaNotificationService extends BaseNotificationService {
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
    theCase: Case,
    notificationType: SubpoenaNotificationType,
    subject: MessageDescriptor,
    body: MessageDescriptor,
    to: { name?: string; email?: string }[],
  ) {
    const formattedSubject = this.formatMessage(subject, {
      courtCaseNumber: theCase.courtCaseNumber,
    })

    const formattedBody = this.formatMessage(body, {
      courtCaseNumber: theCase.courtCaseNumber,
      linkStart: `<a href="${this.config.clientUrl}${ROUTE_HANDLER_ROUTE}/${theCase.id}">`,
      linkEnd: '</a>',
    })

    const promises: Promise<Recipient>[] = []

    for (const recipient of to) {
      if (recipient.email && recipient.name) {
        promises.push(
          this.sendEmail({
            subject: formattedSubject,
            html: formattedBody,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            attachments: undefined,
            skipTail: true,
          }),
        )
      }
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(theCase.id, notificationType, recipients)
  }

  private sendServiceSuccessfulNotification(
    theCase: Case,
  ): Promise<DeliverResponse> {
    return this.sendEmails(
      theCase,
      SubpoenaNotificationType.SERVICE_SUCCESSFUL,
      strings.serviceSuccessfulSubject,
      strings.serviceSuccessfulBody,
      [
        {
          name: theCase.judge?.name,
          email: theCase.judge?.email,
        },
        {
          name: theCase.registrar?.name,
          email: theCase.registrar?.email,
        },
        {
          name: theCase.prosecutor?.name,
          email: theCase.prosecutor?.email,
        },
      ],
    )
  }

  private sendServiceFailedNotification(
    theCase: Case,
  ): Promise<DeliverResponse> {
    return this.sendEmails(
      theCase,
      SubpoenaNotificationType.SERVICE_FAILED,
      strings.serviceFailedSubject,
      strings.serviceFailedBody,
      [
        {
          name: theCase.judge?.name,
          email: theCase.judge?.email,
        },
        {
          name: theCase.registrar?.name,
          email: theCase.registrar?.email,
        },
        {
          name: theCase.prosecutor?.name,
          email: theCase.prosecutor?.email,
        },
      ],
    )
  }

  private sendNotification(
    type: SubpoenaNotificationType,
    theCase: Case,
  ): Promise<DeliverResponse> {
    switch (type) {
      case SubpoenaNotificationType.SERVICE_SUCCESSFUL:
        return this.sendServiceSuccessfulNotification(theCase)
      case SubpoenaNotificationType.SERVICE_FAILED:
        return this.sendServiceFailedNotification(theCase)
      default:
        throw new InternalServerErrorException(
          `Invalid notification type: ${type}`,
        )
    }
  }

  async sendSubpoenaNotification(
    type: SubpoenaNotificationType,
    theCase: Case,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    try {
      return await this.sendNotification(type, theCase)
    } catch (error) {
      this.logger.error('Failed to send notification', error)

      return { delivered: false }
    }
  }
}
