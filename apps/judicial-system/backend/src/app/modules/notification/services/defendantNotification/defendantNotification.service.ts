import _uniqBy from 'lodash/uniqBy'

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
  DEFENDER_INDICTMENT_CASE_ROUTE,
  getStandardUserDashboardRoute,
  ROUTE_HANDLER_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  applyDativeCaseToCourtName,
  getHumanReadableCaseIndictmentRulingDecision,
} from '@island.is/judicial-system/formatters'
import {
  CaseIndictmentRulingDecision,
  DefendantEventType,
  DefendantNotificationType,
  InstitutionType,
  isIndictmentCase,
  TrackedNotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { formatDefenderRoute } from '../../../../formatters'
import { CourtService } from '../../../court'
import { EventService } from '../../../event'
import {
  Case,
  DateLog,
  Defendant,
  DefendantEventLog,
  InstitutionContactRepositoryService,
  Notification,
  Recipient,
} from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'
import { BaseNotificationService } from '../baseNotification.service'
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
    courtService: CourtService,
    private readonly institutionContactRepositoryService: InstitutionContactRepositoryService,
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
    theCase: Case,
    notificationType: TrackedNotificationType,
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
      TrackedNotificationType.DEFENDANT_SELECTED_DEFENDER,
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
      TrackedNotificationType.DEFENDANT_DELEGATED_DEFENDER_CHOICE,
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
    notificationType: TrackedNotificationType,
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

  private async sendDefenderCourtDateEmailNotification(
    theCase: Case,
    defendant: Defendant,
    user?: User,
  ): Promise<DeliverResponse> {
    const shouldSendCourtDateFollowUp = this.shouldSendDefendantNotification(
      theCase,
      defendant,
      TrackedNotificationType.DEFENDER_COURT_DATE_FOLLOW_UP,
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
      recipientName: defendant.defenderName ?? '',
      recipientEmail: defendant.defenderEmail ?? '',
    })

    const result = await this.recordNotification(
      theCase.id,
      TrackedNotificationType.DEFENDER_COURT_DATE_FOLLOW_UP,
      [recipient],
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
      TrackedNotificationType.DEFENDER_ASSIGNED,
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
        linkStart: `<a href="${this.config.clientUrl}${DEFENDER_INDICTMENT_CASE_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      })

      return this.sendEmails(
        theCase,
        TrackedNotificationType.DEFENDER_ASSIGNED,
        formattedSubject,
        formattedBody,
        [{ name: defendant.defenderName, email: defendant.defenderEmail }],
      )
    }

    // Nothing should be sent so we return a successful response
    return { delivered: true }
  }

  private async sendIndictmentSentToPrisonAdminNotification(theCase: Case) {
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

    const institutionContact =
      await this.institutionContactRepositoryService.getInstitutionContact(
        this.config.prisonAdminId,
        DefendantNotificationType.INDICTMENT_SENT_TO_PRISON_ADMIN,
      )

    if (!institutionContact) {
      this.logger.error(
        `No institution contact found for prison admin with id ${this.config.prisonAdminId}`,
      )

      return { delivered: false }
    }

    return this.sendEmails(
      theCase,
      TrackedNotificationType.INDICTMENT_SENT_TO_PRISON_ADMIN,
      formattedSubject,
      formattedBody,
      [
        {
          name: 'Fangelsismálastofnun',
          email: institutionContact,
        },
      ],
    )
  }

  private async sendIndictmentWithdrawnFromPrisonAdminNotification(
    theCase: Case,
  ) {
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

    const institutionContact =
      await this.institutionContactRepositoryService.getInstitutionContact(
        this.config.prisonAdminId,
        DefendantNotificationType.INDICTMENT_SENT_TO_PRISON_ADMIN,
      )

    if (!institutionContact) {
      this.logger.error(
        `No institution contact found for prison admin with id ${this.config.prisonAdminId}`,
      )

      return { delivered: false }
    }

    return this.sendEmails(
      theCase,
      TrackedNotificationType.INDICTMENT_WITHDRAWN_FROM_PRISON_ADMIN,
      formattedSubject,
      formattedBody,
      [
        {
          name: 'Fangelsismálastofnun',
          email: institutionContact,
        },
      ],
    )
  }

  private async sendIndictmentCompletedForSomeNotification(
    theCase: Case,
    defendant: Defendant,
  ): Promise<DeliverResponse> {
    // The indictment was concluded for this defendant while the case continues
    // for the rest. The decision is read directly from the defendant's own event
    // log so only this defendant's conclusion is notified.
    const eventLog = DefendantEventLog.getEventLogByEventType(
      [
        DefendantEventType.INDICTMENT_CANCELLED,
        DefendantEventType.INDICTMENT_DISMISSED,
      ],
      defendant.eventLogs,
    )

    if (!eventLog) {
      // No conclusion recorded for this defendant, nothing to notify
      return { delivered: true }
    }

    const rulingDecision =
      eventLog.eventType === DefendantEventType.INDICTMENT_CANCELLED
        ? CaseIndictmentRulingDecision.CANCELLATION
        : CaseIndictmentRulingDecision.DISMISSAL

    const courtName = applyDativeCaseToCourtName(
      theCase.court?.name || 'héraðsdómi',
    )
    const humanReadableDecision =
      getHumanReadableCaseIndictmentRulingDecision(rulingDecision)

    const subject = `Lyktir skráðar í máli ${theCase.courtCaseNumber}`
    const baseBody = `Lyktir hafa verið skráðar á aðila í máli ${theCase.courtCaseNumber} hjá ${courtName}.<br>Niðurstaða: ${humanReadableDecision}`

    const defenderUrl = formatDefenderRoute(
      this.config.clientUrl,
      theCase.type,
      theCase.id,
    )
    const prosecutorUrl = `${this.config.clientUrl}${ROUTE_HANDLER_ROUTE}/${theCase.id}`

    const promises: Promise<Recipient>[] = []

    // DEFENDER — only this defendant's own confirmed defender
    if (
      defendant.isDefenderChoiceConfirmed &&
      defendant.defenderName &&
      defendant.defenderEmail
    ) {
      promises.push(
        this.sendEmail({
          subject,
          html: `${baseBody}<br>Sjá nánar á <a href="${defenderUrl}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
          recipientName: defendant.defenderName,
          recipientEmail: defendant.defenderEmail,
        }),
      )
    }

    // CIVIL CLAIMANT SPOKESPERSONS — all confirmed spokespersons on the case
    const spokespersons = _uniqBy(
      theCase.civilClaimants?.filter(
        ({ hasSpokesperson, isSpokespersonConfirmed }) =>
          hasSpokesperson && isSpokespersonConfirmed,
      ) ?? [],
      (civilClaimant) => civilClaimant.spokespersonEmail,
    )

    spokespersons
      .filter(
        ({ spokespersonName, spokespersonEmail }) =>
          spokespersonName && spokespersonEmail,
      )
      .forEach(({ spokespersonName, spokespersonEmail }) => {
        promises.push(
          this.sendEmail({
            subject,
            html: `${baseBody}<br>Sjá nánar á <a href="${defenderUrl}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
            recipientName: spokespersonName,
            recipientEmail: spokespersonEmail,
          }),
        )
      })

    // PROSECUTOR
    if (theCase.prosecutor?.name && theCase.prosecutor?.email) {
      promises.push(
        this.sendEmail({
          subject,
          html: `${baseBody}<br>Sjá nánar á <a href="${prosecutorUrl}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
          recipientName: theCase.prosecutor.name,
          recipientEmail: theCase.prosecutor.email,
        }),
      )
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      TrackedNotificationType.INDICTMENT_COMPLETED_FOR_SOME,
      recipients,
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
      case DefendantNotificationType.INDICTMENT_COMPLETED_FOR_SOME:
        return this.sendIndictmentCompletedForSomeNotification(theCase, defendant)
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
