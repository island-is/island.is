import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

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
  NotificationRepositoryService,
  Recipient,
} from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'
import { BaseNotificationService } from '../baseNotification.service'

@Injectable()
export class CivilClaimantNotificationService extends BaseNotificationService {
  constructor(
    notificationRepositoryService: NotificationRepositoryService,
    @Inject(notificationModuleConfig.KEY)
    config: ConfigType<typeof notificationModuleConfig>,
    @Inject(LOGGER_PROVIDER) logger: Logger,
    intlService: IntlService,
    emailService: EmailService,
    eventService: EventService,
    courtService: CourtService,
  ) {
    super(
      notificationRepositoryService,
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
    subject: string,
    body: string,
  ) {
    const promises: Promise<Recipient>[] = []

    if (civilClaimant.isSpokespersonConfirmed) {
      promises.push(
        this.sendEmail({
          subject,
          html: body,
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

    if (!shouldSendCourtDateFollowUp) {
      // Nothing should be sent so we return a successful response
      return { delivered: true }
    }

    const recipient = await this.sendCourtDateFollowUpEmailNotification({
      theCase,
      user,
      recipientName: civilClaimant.spokespersonName ?? '',
      recipientEmail: civilClaimant.spokespersonEmail ?? '',
      recipientHasAccessToRVG: Boolean(civilClaimant.spokespersonNationalId),
    })

    if (!recipient) {
      // Neither a court session nor an arraignment is scheduled in the future,
      // so there is nothing to invite the spokesperson to
      return { delivered: true }
    }

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
      if (!theCase.court?.name) {
        this.logger.error(
          `Missing court name for case ${theCase.id} when sending spokesperson assigned notification`,
        )

        return { delivered: false }
      }

      const courtName = capitalize(theCase.court.name)
      const spokespersonHasAccessToRVG = !!civilClaimant.spokespersonNationalId
      const role = civilClaimant.spokespersonIsLawyer
        ? 'lögmann einkaréttarkröfuhafa'
        : 'réttargæslumann einkaréttarkröfuhafa'

      const subject = `${courtName} - aðgangur að máli`

      const accessInfo = spokespersonHasAccessToRVG
        ? `Sjá nánar á <a href="${this.config.clientUrl}${DEFENDER_INDICTMENT_CASE_ROUTE}/${theCase.id}">yfirlitssíðu málsins í Réttarvörslugátt</a>`
        : 'Þú getur nálgast málið hjá dómstólnum'
      const body = `${courtName} hefur skráð þig sem ${role} í máli ${theCase.courtCaseNumber}.<br /><br />${accessInfo}.`

      return this.sendEmails(
        civilClaimant,
        theCase,
        TrackedNotificationType.SPOKESPERSON_ASSIGNED,
        subject,
        body,
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
