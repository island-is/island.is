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

import {
  DEFENDER_INDICTMENT_ROUTE,
  PRISON_CASES_ROUTE,
  ROUTE_HANDLER_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  DefendantNotificationType,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

import { Case } from '../../../case'
import { Defendant } from '../../../defendant'
import { EventService } from '../../../event'
import { BaseNotificationService } from '../../baseNotification.service'
import { DeliverResponse } from '../../models/deliver.response'
import { Notification, Recipient } from '../../models/notification.model'
import { notificationModuleConfig } from '../../notification.config'
import { strings } from './defendantNotification.strings'

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
    theCase: Case,
    notificationType: DefendantNotificationType,
    subject: string,
    body: string,
    to: { name?: string; email?: string }[],
  ) {
    const promises: Promise<Recipient>[] = []

    for (const recipient of to) {
      if (recipient.email && recipient.name) {
        promises.push(
          this.sendEmail({
            subject,
            html: body,
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

  private sendDefendantSelectedDefenderNotification(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const formattedSubject = this.formatMessage(
      strings.defendantSelectedDefenderSubject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )

    const formattedBody = this.formatMessage(
      strings.defendantSelectedDefenderBody,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        linkStart: `<a href="${this.config.clientUrl}${ROUTE_HANDLER_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    return this.sendEmails(
      theCase,
      DefendantNotificationType.DEFENDANT_SELECTED_DEFENDER,
      formattedSubject,
      formattedBody,
      [
        {
          name: theCase.judge?.name,
          email: theCase.judge?.email,
        },
        {
          name: theCase.registrar?.name,
          email: theCase.registrar?.email,
        },
      ],
    )
  }

  private sendDefendantDelegatedDefenderChoiceNotification(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const formattedSubject = this.formatMessage(
      strings.defendantDelegatedDefenderChoiceSubject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )

    const formattedBody = this.formatMessage(
      strings.defendantDelegatedDefenderChoiceBody,
      {
        linkStart: `<a href="${this.config.clientUrl}${ROUTE_HANDLER_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    return this.sendEmails(
      theCase,
      DefendantNotificationType.DEFENDANT_DELEGATED_DEFENDER_CHOICE,
      formattedSubject,
      formattedBody,
      [
        {
          name: theCase.judge?.name,
          email: theCase.judge?.email,
        },
        {
          name: theCase.registrar?.name,
          email: theCase.registrar?.email,
        },
      ],
    )
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
    theCase: Case,
    defendant: Defendant,
  ): Promise<DeliverResponse> {
    const shouldSend = this.shouldSendDefenderAssignedNotification(
      theCase,
      defendant,
    )

    if (shouldSend) {
      const courtName = theCase.court?.name
      const defenderHasAccessToRVG = !!defendant.defenderNationalId

      const formattedSubject = this.formatMessage(
        strings.defenderAssignedSubject,
        {
          courtName,
        },
      )

      const formattedBody = this.formatMessage(strings.defenderAssignedBody, {
        courtName,
        courtCaseNumber: theCase.courtCaseNumber,
        defenderHasAccessToRVG,
        // This link only works if the user is already logged in
        linkStart: `<a href="${this.config.clientUrl}${DEFENDER_INDICTMENT_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      })

      return this.sendEmails(
        theCase,
        DefendantNotificationType.DEFENDER_ASSIGNED,
        formattedSubject,
        formattedBody,
        [{ name: defendant.defenderName, email: defendant.defenderEmail }],
      )
    }

    // Nothing should be sent so we return a successful response
    return { delivered: true }
  }

  private sendIndictmentSentToPrisonAdminNotification(theCase: Case) {
    const formattedSubject = this.formatMessage(
      strings.indictmentSentToPrisonAdminSubject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )

    const formattedBody = this.formatMessage(
      strings.indictmentSentToPrisonAdminBody,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        linkStart: `<a href="${this.config.clientUrl}${PRISON_CASES_ROUTE}">`,
        linkEnd: '</a>',
      },
    )

    // We want to send separate emails to each recipient
    const to = this.config.email.prisonAdminIndictmentEmails
      .split(',')
      .map((email) => email.trim())
      .map((email) => {
        return {
          name: 'Fangelsismálastofnun',
          email,
        }
      })

    return this.sendEmails(
      theCase,
      DefendantNotificationType.INDICTMENT_SENT_TO_PRISON_ADMIN,
      formattedSubject,
      formattedBody,
      to,
    )
  }

  private sendIndictmentWithdrawnFromPrisonAdminNotification(theCase: Case) {
    const courtCaseNumber = theCase.courtCaseNumber

    const formattedSubject = this.formatMessage(
      strings.indictmentWithdrawnFromPrisonAdminSubject,
      {
        courtCaseNumber,
      },
    )

    const formattedBody = this.formatMessage(
      strings.indictmentWithdrawnFromPrisonAdminBody,
      {
        courtCaseNumber,
      },
    )

    // We want to send separate emails to each recipient
    const to = this.config.email.prisonAdminIndictmentEmails
      .split(',')
      .map((email) => email.trim())
      .map((email) => {
        return {
          name: 'Fangelsismálastofnun',
          email,
        }
      })

    return this.sendEmails(
      theCase,
      DefendantNotificationType.INDICTMENT_WITHDRAWN_FROM_PRISON_ADMIN,
      formattedSubject,
      formattedBody,
      to,
    )
  }

  private sendNotification(
    notificationType: DefendantNotificationType,
    theCase: Case,
    defendant: Defendant,
  ): Promise<DeliverResponse> {
    switch (notificationType) {
      case DefendantNotificationType.DEFENDANT_SELECTED_DEFENDER:
        return this.sendDefendantSelectedDefenderNotification(theCase)
      case DefendantNotificationType.DEFENDANT_DELEGATED_DEFENDER_CHOICE:
        return this.sendDefendantDelegatedDefenderChoiceNotification(theCase)
      case DefendantNotificationType.DEFENDER_ASSIGNED:
        return this.sendDefenderAssignedNotification(theCase, defendant)
      case DefendantNotificationType.INDICTMENT_SENT_TO_PRISON_ADMIN:
        return this.sendIndictmentSentToPrisonAdminNotification(theCase)
      case DefendantNotificationType.INDICTMENT_WITHDRAWN_FROM_PRISON_ADMIN:
        return this.sendIndictmentWithdrawnFromPrisonAdminNotification(theCase)
      default:
        throw new InternalServerErrorException(
          `Invalid notification type: ${notificationType}`,
        )
    }
  }

  async sendDefendantNotification(
    type: DefendantNotificationType,
    theCase: Case,
    defendant: Defendant,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()
    try {
      return await this.sendNotification(type, theCase, defendant)
    } catch (error) {
      this.logger.error('Failed to send notification', error)

      return { delivered: false }
    }
  }
}
