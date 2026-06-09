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

import { DEFENDER_INDICTMENT_CASE_ROUTE } from '@island.is/judicial-system/consts'
import { capitalize } from '@island.is/judicial-system/formatters'
import {
  CivilClaimantNotificationType,
  TrackedNotificationType,
  type User,
} from '@island.is/judicial-system/types'

import { CourtService } from '../../../court'
import { EventService } from '../../../event'
import {
  Case,
  CivilClaimant,
  DateLog,
  Notification,
  Recipient,
} from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'
import { BaseNotificationService } from '../baseNotification.service'
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
    courtService: CourtService,
  ) {
    super(
      notificationModel,
      emailService,
      intlService,
      courtService,
      config,
      eventService,
      logger,
    )
  }

  private async sendEmails(
    civilClaimant: CivilClaimant,
    theCase: Case,
    notificationType: TrackedNotificationType,
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
      linkStart: `<a href="${this.config.clientUrl}${DEFENDER_INDICTMENT_CASE_ROUTE}/${theCase.id}">`,
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

  private shouldSendSpokespersonNotification(
    theCase: Case,
    civilClaimant: CivilClaimant,
    notificationType: TrackedNotificationType,
  ): boolean {
    if (
      !civilClaimant.spokespersonEmail ||
      !civilClaimant.isSpokespersonConfirmed
    ) {
      return false
    }

    const hasSentNotificationBefore = this.hasReceivedNotification(
      notificationType,
      civilClaimant.spokespersonEmail,
      theCase.notifications,
    )

    if (!hasSentNotificationBefore) {
      return true
    }

    return false
  }

  private async sendSpokespersonCourtDateEmailNotification(
    theCase: Case,
    civilClaimant: CivilClaimant,
    user?: User,
  ): Promise<DeliverResponse> {
    const shouldSendCourtDateFollowUp = this.shouldSendSpokespersonNotification(
      theCase,
      civilClaimant,
      TrackedNotificationType.SPOKESPERSON_COURT_DATE_FOLLOW_UP,
    )
    const arraignmentDateLog = DateLog.arraignmentDate(theCase.dateLogs)
    const hasFutureArraignmentDate =
      arraignmentDateLog && arraignmentDateLog.date.getTime() > Date.now()

    if (!shouldSendCourtDateFollowUp || !hasFutureArraignmentDate || !user) {
      // Nothing should be sent so we return a successful response
      return { delivered: true }
    }

    const recipient = await this.sendArraignmentDateEmailNotification({
      theCase,
      user,
      arraignmentDateLog,
      recipientName: civilClaimant.spokespersonName ?? '',
      recipientEmail: civilClaimant.spokespersonEmail ?? '',
    })

    const result = await this.recordNotification(
      theCase.id,
      TrackedNotificationType.SPOKESPERSON_COURT_DATE_FOLLOW_UP,
      [recipient],
    )

    return result
  }

  private async sendSpokespersonAssignedNotification(
    civilClaimant: CivilClaimant,
    theCase: Case,
  ): Promise<DeliverResponse> {
    const shouldSend = this.shouldSendSpokespersonNotification(
      theCase,
      civilClaimant,
      TrackedNotificationType.SPOKESPERSON_ASSIGNED,
    )

    if (shouldSend) {
      return this.sendEmails(
        civilClaimant,
        theCase,
        TrackedNotificationType.SPOKESPERSON_ASSIGNED,
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
    user?: User,
  ): Promise<DeliverResponse> {
    switch (notificationType) {
      case CivilClaimantNotificationType.SPOKESPERSON_ASSIGNED:
        return this.sendSpokespersonAssignedNotification(civilClaimant, theCase)
      case CivilClaimantNotificationType.SPOKESPERSON_COURT_DATE_FOLLOW_UP:
        return this.sendSpokespersonCourtDateEmailNotification(
          theCase,
          civilClaimant,
          user,
        )
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
    user?: User,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    try {
      return await this.sendNotification(type, civilClaimant, theCase, user)
    } catch (error) {
      this.logger.error('Failed to send notification', error)

      return { delivered: false }
    }
  }
}
