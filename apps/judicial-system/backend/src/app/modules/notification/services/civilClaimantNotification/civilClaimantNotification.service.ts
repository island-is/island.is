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
import { capitalize } from '@island.is/judicial-system/formatters'
import { CivilClaimantNotificationType } from '@island.is/judicial-system/types'

import { EventService } from '../../../event'
import {
  Case,
  CivilClaimant,
  Notification,
  Recipient,
} from '../../../repository'
import { BaseNotificationService } from '../../baseNotification.service'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'
import { strings } from './civilClaimantNotification.strings'

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

    const formattedSubject = this.formatMessage(subject, {
      courtName,
      courtCaseNumber,
    })

    const formattedBody = this.formatMessage(body, {
      courtName,
      courtCaseNumber,
      spokespersonHasAccessToRVG,
      spokespersonIsLawyer: civilClaimant.spokespersonIsLawyer,
      linkStart: `<a href="${this.config.clientUrl}${DEFENDER_INDICTMENT_ROUTE}/${theCase.id}">`,
      linkEnd: '</a>',
    })
    const promises: Promise<Recipient>[] = []

    if (civilClaimant.isSpokespersonConfirmed) {
      promises.push(
        this.sendEmail({
          subject: formattedSubject,
          html: formattedBody,
          recipientName: civilClaimant.spokespersonName,
          recipientEmail: civilClaimant.spokespersonEmail,
          attachments: undefined,
          skipTail: true,
        }),
      )
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(theCase.id, notificationType, recipients)
  }

  private shouldSendSpokespersonAssignedNotification(
    theCase: Case,
    civilClaimant: CivilClaimant,
  ): boolean {
    if (
      !civilClaimant.spokespersonEmail ||
      !civilClaimant.isSpokespersonConfirmed
    ) {
      return false
    }

    const hasSentNotificationBefore = this.hasReceivedNotification(
      CivilClaimantNotificationType.SPOKESPERSON_ASSIGNED,
      civilClaimant.spokespersonEmail,
      theCase.notifications,
    )

    if (!hasSentNotificationBefore) {
      return true
    }

    return false
  }

  private async sendSpokespersonAssignedNotification(
    civilClaimant: CivilClaimant,
    theCase: Case,
  ): Promise<DeliverResponse> {
    const shouldSend = this.shouldSendSpokespersonAssignedNotification(
      theCase,
      civilClaimant,
    )

    if (shouldSend) {
      return this.sendEmails(
        civilClaimant,
        theCase,
        CivilClaimantNotificationType.SPOKESPERSON_ASSIGNED,
        strings.civilClaimantSpokespersonAssignedSubject,
        strings.civilClaimantSpokespersonAssignedBody,
      )
    }

    // Nothing should be sent so we return a successful response
    return { delivered: true }
  }

  private sendNotification(
    notificationType: CivilClaimantNotificationType,
    civilClaimant: CivilClaimant,
    theCase: Case,
  ): Promise<DeliverResponse> {
    switch (notificationType) {
      case CivilClaimantNotificationType.SPOKESPERSON_ASSIGNED:
        return this.sendSpokespersonAssignedNotification(civilClaimant, theCase)
      default:
        throw new InternalServerErrorException(
          `Invalid notification type: ${notificationType}`,
        )
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
