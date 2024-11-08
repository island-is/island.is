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

import { capitalize } from '@island.is/judicial-system/formatters'
import { CivilClaimantNotificationType } from '@island.is/judicial-system/types'

import { formatDefenderRoute } from '../../formatters'
import { Case } from '../case'
import { CivilClaimant } from '../defendant'
import { EventService } from '../event'
import { DeliverResponse } from './models/deliver.response'
import { Notification, Recipient } from './models/notification.model'
import { BaseNotificationService } from './baseNotification.service'
import { strings } from './civilClaimantNotification.strings'
import { notificationModuleConfig } from './notification.config'

@Injectable()
export class CivilClaimantNotificationService extends BaseNotificationService {
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
    civilClaimant: CivilClaimant,
    theCase: Case,
    notificationType: CivilClaimantNotificationType,
    subject: MessageDescriptor,
    body: MessageDescriptor,
  ) {
    const courtName = capitalize(theCase.court?.name)
    const courtCaseNumber = theCase.courtCaseNumber
    const spokespersonHasAccessToRVG = !!civilClaimant.spokespersonNationalId

    const overviewUrl = formatDefenderRoute(
      this.config.clientUrl,
      theCase.type,
      theCase.id,
    )

    const formattedSubject = this.formatMessage(subject, {
      courtName,
      courtCaseNumber,
    })

    const formattedBody = this.formatMessage(body, {
      courtName,
      courtCaseNumber,
      spokespersonHasAccessToRVG,
      spokesPersonIsLawyer: civilClaimant.spokespersonIsLawyer,
      linkStart: `<a href="${overviewUrl}">`,
      linkEnd: '</a>',
    })
    const promises: Promise<Recipient>[] = []

    if (civilClaimant.isSpokespersonConfirmed) {
      promises.push(
        this.sendEmail(
          formattedSubject,
          formattedBody,
          civilClaimant.spokespersonName,
          civilClaimant.spokespersonEmail,
          undefined,
          true,
        ),
      )
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(theCase.id, notificationType, recipients)
  }

  private async sendSpokespersonAssignedNotification(
    civilClaimant: CivilClaimant,
    theCase: Case,
  ): Promise<DeliverResponse> {
    return this.sendEmails(
      civilClaimant,
      theCase,
      CivilClaimantNotificationType.SPOKESPERSON_ASSIGNED,
      strings.civilClaimantSpokespersonAssignedSubject,
      strings.civilClaimantSpokespersonAssignedBody,
    )
  }

  private sendNotification(
    notificationType: CivilClaimantNotificationType,
    civilClaimant: CivilClaimant,
    theCase: Case,
  ): Promise<DeliverResponse> {
    {
      switch (notificationType) {
        case CivilClaimantNotificationType.SPOKESPERSON_ASSIGNED:
          return this.sendSpokespersonAssignedNotification(
            civilClaimant,
            theCase,
          )
        default:
          throw new InternalServerErrorException(
            `Invalid notification type: ${notificationType}`,
          )
      }
    }
  }

  async sendCivilClaimantNotification(
    type: CivilClaimantNotificationType,
    civilClaimant: CivilClaimant,
    theCase: Case,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    try {
      return await this.sendNotification(type, civilClaimant, theCase)
    } catch (error) {
      this.logger.error('Failed to send notification', error)

      return { delivered: false }
    }
  }
}
