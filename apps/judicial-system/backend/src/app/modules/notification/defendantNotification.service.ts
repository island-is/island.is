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

    const formattedSubject = this.formatMessage(subject, {
      courtName,
    })

    const formattedBody = this.formatMessage(body, {
      courtName,
      courtCaseNumber: theCase.courtCaseNumber,
      linkStart: `<a href="${this.config.clientUrl}${DEFENDER_INDICTMENT_ROUTE}/${theCase.id}">`,
      linkEnd: '</a>',
    })
    const promises: Promise<Recipient>[] = []

    if (defendant.defenderEmail && defendant.isDefenderChoiceConfirmed) {
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

  private async sendAdvocateAssignedNotification(
    defendant: Defendant,
    theCase: Case,
  ): Promise<DeliverResponse> {
    // We aren't using this yet for request cases
    if (isIndictmentCase(theCase.type)) {
      return this.sendEmails(
        defendant,
        theCase,
        DefendantNotificationType.ADVOCATE_ASSIGNED,
        strings.indictmentAdvocateAssignedSubject,
        strings.indictmentAdvocateAssignedBody,
      )
    }
    return { delivered: false }
  }

  private sendNotification(
    notificationType: DefendantNotificationType,
    defendant: Defendant,
    theCase: Case,
  ): Promise<DeliverResponse> {
    {
      switch (notificationType) {
        case DefendantNotificationType.ADVOCATE_ASSIGNED:
          return this.sendAdvocateAssignedNotification(defendant, theCase)
        default:
          throw new InternalServerErrorException(
            `Invalid notification type: ${notificationType}`,
          )
      }
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
