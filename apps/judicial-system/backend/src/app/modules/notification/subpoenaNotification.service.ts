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

import { INDICTMENTS_COURT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import { SubpoenaNotificationType } from '@island.is/judicial-system/types'

import { Case } from '../case'
import { EventService } from '../event'
import { DeliverResponse } from './models/deliver.response'
import { Notification, Recipient } from './models/notification.model'
import { BaseNotificationService } from './baseNotification.service'
import { notificationModuleConfig } from './notification.config'
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
  ) {
    const formattedSubject = this.formatMessage(subject, {
      courtCaseNumber: theCase.courtCaseNumber,
    })

    const formattedBody = this.formatMessage(body, {
      courtCaseNumber: theCase.courtCaseNumber,
      linkStart: `<a href="${this.config.clientUrl}${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${theCase.id}">`,
      linkEnd: '</a>',
    })
    const promises: Promise<Recipient>[] = []

    if (theCase.judge?.email) {
      promises.push(
        this.sendEmail(
          formattedSubject,
          formattedBody,
          theCase.judge.name,
          theCase.judge.email,
          undefined,
          true,
        ),
      )
    }

    if (theCase.registrar?.email) {
      promises.push(
        this.sendEmail(
          formattedSubject,
          formattedBody,
          theCase.registrar.name,
          theCase.registrar.email,
          undefined,
          true,
        ),
      )
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
    )
  }

  private sendDefendantSelectedDefenderNotification(
    theCase: Case,
  ): Promise<DeliverResponse> {
    return this.sendEmails(
      theCase,
      SubpoenaNotificationType.DEFENDANT_SELECTED_DEFENDER,
      strings.defendantSelectedDefenderSubject,
      strings.defendantSelectedDefenderBody,
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
      case SubpoenaNotificationType.DEFENDANT_SELECTED_DEFENDER:
        return this.sendDefendantSelectedDefenderNotification(theCase)
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
