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
  getStandardUserDashboardRoute,
  ROUTE_HANDLER_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  DefendantNotificationType,
  InstitutionType,
  isIndictmentCase,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  formatArraignmentDateEmailNotification,
  formatCourtCalendarInvitation,
} from '../../../../formatters'
import { CourtService } from '../../../court'
import { EventService } from '../../../event'
import {
  Case,
  DateLog,
  Defendant,
  Notification,
  Recipient,
} from '../../../repository'
import { BaseNotificationService } from '../../baseNotification.service'
import { DeliverResponse } from '../../models/deliver.response'
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
    private readonly courtService: CourtService,
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

  private shouldSendDefendantNotification(
    theCase: Case,
    defendant: Defendant,
    notificationType: DefendantNotificationType,
  ): boolean {
    if (!defendant.defenderEmail || !defendant.isDefenderChoiceConfirmed) {
      return false
    }

    if (isIndictmentCase(theCase.type)) {
      const hasSentNotificationBefore = this.hasReceivedNotification(
        notificationType,
        defendant.defenderEmail,
        theCase.notifications,
      )
      return !hasSentNotificationBefore
    }
    return false
  }

  // TODO-FIX: redundant in other services - defendant, case, indictmentCase notifications
  private getCourtDateCalendarInvite = (
    theCase: Case,
    targetDateLog: DateLog,
  ) => {
    const { date: scheduledDate, location: courtRoom } = targetDateLog
    const { title, location, eventOrganizer } = formatCourtCalendarInvitation(
      theCase,
      courtRoom,
    )
    const calendarInvite = this.createICalAttachment({
      eventOrganizer,
      scheduledDate,
      title,
      location,
    })
    return calendarInvite
  }

  // TODO-FIX: redundant in other services - defendant, case, indictmentCase notifications
  private async uploadEmailToCourt(
    theCase: Case,
    user: User,
    subject: string,
    body: string,
    recipients?: string,
  ): Promise<void> {
    try {
      await this.courtService.createEmail(
        user,
        theCase.id,
        theCase.courtId ?? '',
        theCase.courtCaseNumber ?? '',
        subject,
        body,
        recipients ?? '',
        this.config.email.fromEmail,
        this.config.email.fromName,
      )
    } catch (error) {
      // Tolerate failure, but log warning - use warning instead of error to avoid monitoring alerts
      this.logger.warn(
        `Failed to upload email to court for indictment case ${theCase.id}`,
        { error },
      )
    }
  }

  private async sendDefenderCourtDateEmailNotification(
    theCase: Case,
    defendant: Defendant,
    user?: User,
  ): Promise<DeliverResponse> {
    const shouldSendCourtDateFollowUp = this.shouldSendDefendantNotification(
      theCase,
      defendant,
      DefendantNotificationType.DEFENDER_COURT_DATE_FOLLOW_UP,
    )
    const arraignmentDateLog = DateLog.arraignmentDate(theCase.dateLogs)
    const hasFutureArraignmentDate =
      arraignmentDateLog && arraignmentDateLog.date.getTime() > Date.now()
    if (!shouldSendCourtDateFollowUp || !hasFutureArraignmentDate || !user) {
      // Nothing should be sent so we return a successful response
      return { delivered: true }
    }

    // TODO-FIX: redundant in other services - defendant, indictmentCase notifications
    const { subject, body } = formatArraignmentDateEmailNotification({
      formatMessage: this.formatMessage,
      courtName: theCase.court?.name,
      courtCaseNumber: theCase.courtCaseNumber,
      judgeName: theCase.judge?.name,
      registrarName: theCase.registrar?.name,
      arraignmentDateLog,
    })

    const calendarInvite = this.getCourtDateCalendarInvite(
      theCase,
      arraignmentDateLog,
    )

    const promise = this.sendEmail({
      subject,
      html: body,
      recipientName: defendant.defenderName,
      recipientEmail: defendant.defenderEmail,
      attachments: calendarInvite ? [calendarInvite] : undefined,
    }).then((recipient) => {
      if (recipient.success) {
        // No need to wait
        this.uploadEmailToCourt(
          theCase,
          user,
          subject,
          body,
          defendant.defenderEmail,
        )
      }
      return recipient
    })

    const recipients = await Promise.all([promise])
    const result = await this.recordNotification(
      theCase.id,
      DefendantNotificationType.DEFENDER_COURT_DATE_FOLLOW_UP,
      recipients,
    )

    return result
  }

  private async sendDefenderAssignedNotification(
    theCase: Case,
    defendant: Defendant,
  ): Promise<DeliverResponse> {
    const shouldSend = this.shouldSendDefendantNotification(
      theCase,
      defendant,
      DefendantNotificationType.DEFENDER_ASSIGNED,
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
    const dashboardRoute = getStandardUserDashboardRoute({
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { type: InstitutionType.PRISON_ADMIN },
    })
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
        linkStart: `<a href="${this.config.clientUrl}${dashboardRoute}">`,
        linkEnd: '</a>',
      },
    )

    // We want to send separate emails to each recipient
    const to = this.config.email.prisonAdminIndictmentEmails
      .split(',')
      .map((email: string) => email.trim())
      .map((email: string) => {
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
      .map((email: string) => email.trim())
      .map((email: string) => {
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
    user?: User,
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
      case DefendantNotificationType.DEFENDER_COURT_DATE_FOLLOW_UP:
        return this.sendDefenderCourtDateEmailNotification(
          theCase,
          defendant,
          user,
        )
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
    user?: User,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()
    try {
      return await this.sendNotification(type, theCase, defendant, user)
    } catch (error) {
      this.logger.error('Failed to send notification', error)

      return { delivered: false }
    }
  }
}
