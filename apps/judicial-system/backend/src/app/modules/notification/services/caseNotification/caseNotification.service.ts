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
import { SmsService } from '@island.is/nova-sms'

import {
  CLOSED_INDICTMENT_OVERVIEW_ROUTE,
  COURT_OF_APPEAL_OVERVIEW_ROUTE,
  INDICTMENTS_COURT_OVERVIEW_ROUTE,
  INDICTMENTS_OVERVIEW_ROUTE,
  INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE,
  RESTRICTION_CASE_OVERVIEW_ROUTE,
  ROUTE_HANDLER_ROUTE,
  SIGNED_VERDICT_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  applyDativeCaseToCourtName,
  formatDate,
  getAppealResultTextByValue,
  getHumanReadableCaseIndictmentRulingDecision,
  lowercase,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealRulingDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseNotificationType,
  CaseState,
  CaseType,
  DefendantNotificationType,
  DefenderSubRole,
  getIndictmentAppealDeadline,
  getStatementDeadline,
  isDefenceUser,
  isIndictmentCase,
  isInvestigationCase,
  isProsecutionUser,
  isRequestCase,
  isRestrictionCase,
  RequestSharedWhen,
  RequestSharedWithDefender,
  SessionArrangements,
  type User,
  UserDescriptor,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  formatCourtCalendarInvitation,
  formatCourtHeadsUpSmsNotification,
  formatCourtIndictmentReadyForCourtEmailNotification,
  formatCourtOfAppealJudgeAssignedEmailNotification,
  formatCourtReadyForCourtSmsNotification,
  formatCourtResubmittedToCourtSmsNotification,
  formatCourtRevokedSmsNotification,
  formatDefenderCourtDateEmailNotification,
  formatDefenderCourtDateLinkEmailNotification,
  formatDefenderReadyForCourtEmailNotification,
  formatDefenderResubmittedToCourtEmailNotification,
  formatDefenderRoute,
  formatPrisonAdministrationRulingNotification,
  formatPrisonCourtDateEmailNotification,
  formatPrisonRevokedEmailNotification,
  formatProsecutorCourtDateEmailNotification,
  formatProsecutorReadyForCourtEmailNotification,
  formatProsecutorReceivedByCourtSmsNotification,
} from '../../../../formatters'
import { notifications } from '../../../../messages'
import { CourtService } from '../../../court'
import { DefendantService } from '../../../defendant'
import { EventService } from '../../../event'
import {
  type Case,
  type CivilClaimant,
  DateLog,
  type Defendant,
  InstitutionContactRepositoryService,
  Notification,
  Recipient,
} from '../../../repository'
import { BaseNotificationService } from '../../baseNotification.service'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'

interface RecipientInfo {
  name?: string
  email?: string
}

@Injectable()
export class CaseNotificationService extends BaseNotificationService {
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
    private readonly smsService: SmsService,
    private readonly defendantService: DefendantService,
    private readonly institutionContactRepositoryService: InstitutionContactRepositoryService,
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

  private async shouldSendNotificationToPrison(
    theCase: Case,
  ): Promise<boolean> {
    if (theCase.type === CaseType.CUSTODY) {
      return true
    }

    if (
      theCase.type !== CaseType.ADMISSION_TO_FACILITY &&
      theCase.type !== CaseType.PAROLE_REVOCATION
    ) {
      return false
    }

    if (theCase.defendants && theCase.defendants[0]?.noNationalId) {
      return true
    }

    return this.defendantService.isDefendantInActiveCustody(theCase.defendants)
  }

  private getCourtMobileNumbers(courtId?: string) {
    return (
      (courtId && this.config.sms.courtsMobileNumbers[courtId]) ?? undefined
    )
  }

  private getCourtAssistantMobileNumbers(courtId?: string) {
    return (
      (courtId && this.config.sms.courtsAssistantMobileNumbers[courtId]) ??
      undefined
    )
  }

  private getCourtEmail(courtId?: string) {
    return (courtId && this.config.email.courtsEmails[courtId]) ?? undefined
  }

  private async sendSms(
    smsText: string,
    mobileNumbers?: string,
  ): Promise<Recipient> {
    if (!this.config.production && !mobileNumbers) {
      return { address: mobileNumbers, success: true }
    }

    smsText = smsText.match(/rettarvorslugatt.island.is/g)
      ? smsText
      : `${smsText} ${this.formatMessage(notifications.smsTail)}`

    return this.smsService
      .sendSms(mobileNumbers?.split(',') ?? '', smsText)
      .then(() => ({ address: mobileNumbers, success: true }))
      .catch((reason) => {
        this.logger.error('Failed to send sms', { error: reason })

        this.eventService.postErrorEvent(
          'Failed to send sms',
          { mobileNumbers },
          reason,
        )

        return { address: mobileNumbers, success: false }
      })
  }

  //#region HEADS_UP notifications */
  private sendHeadsUpSmsNotificationToCourt(theCase: Case): Promise<Recipient> {
    const smsText = formatCourtHeadsUpSmsNotification(
      this.formatMessage,
      theCase.type,
      theCase.prosecutor?.name,
      theCase.arrestDate,
      theCase.requestedCourtDate,
    )

    return this.sendSms(smsText, this.getCourtMobileNumbers(theCase.courtId))
  }

  private async sendHeadsUpNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const recipient = await this.sendHeadsUpSmsNotificationToCourt(theCase)

    return this.recordNotification(theCase.id, CaseNotificationType.HEADS_UP, [
      recipient,
    ])
  }
  //#endregion

  //#region READY_FOR_COURT notifications */
  private sendReadyForCourtSmsNotificationToCourt(
    theCase: Case,
  ): Promise<Recipient> {
    const smsText = formatCourtReadyForCourtSmsNotification(
      this.formatMessage,
      theCase.type,
      theCase.prosecutor?.name,
      theCase.prosecutorsOffice?.name,
    )

    return this.sendSms(smsText, this.getCourtMobileNumbers(theCase.courtId))
  }

  private sendResubmittedToCourtSmsNotificationToCourt(
    theCase: Case,
  ): Promise<Recipient> {
    const smsText = formatCourtResubmittedToCourtSmsNotification(
      this.formatMessage,
      theCase.courtCaseNumber,
    )

    return this.sendSms(smsText, this.getCourtMobileNumbers(theCase.courtId))
  }

  // this is shared between defender sub roles: defendant defender, victim lawyer, etc.
  private sendResubmittedToCourtEmailNotificationToDefender({
    theCase,
    defenderNationalId,
    defenderEmail,
    defenderName,
  }: {
    theCase: Case
    defenderNationalId?: string
    defenderEmail?: string
    defenderName?: string
  }): Promise<Recipient> {
    const { body, subject } = formatDefenderResubmittedToCourtEmailNotification(
      this.formatMessage,
      defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id),
      theCase.court?.name,
      theCase.courtCaseNumber ?? theCase.policeCaseNumbers[0],
    )

    return this.sendEmail({
      subject,
      html: body,
      recipientName: defenderName,
      recipientEmail: defenderEmail,
      skipTail: !defenderNationalId,
    })
  }

  private async sendReadyForCourtEmailNotificationToProsecutor(
    theCase: Case,
  ): Promise<Recipient> {
    const { id, type, court, policeCaseNumbers, prosecutor } = theCase

    const overviewUrl = `${
      isRestrictionCase(type)
        ? `${this.config.clientUrl}${RESTRICTION_CASE_OVERVIEW_ROUTE}`
        : `${this.config.clientUrl}${INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE}`
    }/${id}`

    const { subject, body } = formatProsecutorReadyForCourtEmailNotification(
      this.formatMessage,
      policeCaseNumbers,
      type,
      court?.name,
      overviewUrl,
    )

    return this.sendEmail({
      subject,
      html: body,
      recipientName: prosecutor?.name,
      recipientEmail: prosecutor?.email,
    })
  }

  private sendReadyForCourtEmailNotificationToCourt(
    theCase: Case,
  ): Promise<Recipient> {
    const { subject, body } =
      formatCourtIndictmentReadyForCourtEmailNotification(
        this.formatMessage,
        theCase,
        `${this.config.clientUrl}${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${theCase.id}`,
      )

    return this.sendEmail({
      subject,
      html: body,
      recipientName: theCase.court?.name,
      recipientEmail: this.getCourtEmail(theCase.courtId),
    })
  }

  private sendReadyForCourtEmailNotificationToDefender(
    theCase: Case,
  ): Promise<Recipient> {
    const { subject, body } = formatDefenderReadyForCourtEmailNotification({
      formatMessage: this.formatMessage,
      policeCaseNumber: theCase.policeCaseNumbers[0],
      courtName: theCase.court?.name || 'Héraðsdómur',
      overviewUrl:
        theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id),
      defenderSubRole: DefenderSubRole.DEFENDANT_DEFENDER,
    })

    return this.sendEmail({
      subject,
      html: body,
      recipientName: theCase.defenderName,
      recipientEmail: theCase.defenderEmail,
      skipTail: !theCase.defenderNationalId,
    })
  }

  private sendReadyForCourtEmailNotificationToVictimLawyer({
    theCase,
    lawyerName,
    lawyerEmail,
    lawyerNationalId,
  }: {
    theCase: Case
    lawyerName?: string
    lawyerEmail?: string
    lawyerNationalId?: string
  }): Promise<Recipient> {
    const { subject, body } = formatDefenderReadyForCourtEmailNotification({
      formatMessage: this.formatMessage,
      policeCaseNumber: theCase.policeCaseNumbers[0],
      courtName: theCase.court?.name || 'Héraðsdómur',
      overviewUrl:
        lawyerNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id),
      defenderSubRole: DefenderSubRole.VICTIM_LAWYER,
    })

    return this.sendEmail({
      subject,
      html: body,
      recipientName: lawyerName,
      recipientEmail: lawyerEmail,
      skipTail: !lawyerNationalId,
    })
  }

  private async sendReadyForCourtNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    if (isIndictmentCase(theCase.type)) {
      const recipient = await this.sendReadyForCourtEmailNotificationToCourt(
        theCase,
      )
      return this.recordNotification(
        theCase.id,
        CaseNotificationType.READY_FOR_COURT,
        [recipient],
      )
    }

    // Investigation and Restriction Cases

    // PROSECUTOR NOTIFICATIONS
    const promises: Promise<Recipient>[] = [
      this.sendReadyForCourtEmailNotificationToProsecutor(theCase),
    ]

    // COURT NOTIFICATIONS
    const courtHasBeenNotified = this.hasReceivedNotification(
      CaseNotificationType.READY_FOR_COURT,
      this.getCourtMobileNumbers(theCase.courtId),
      theCase.notifications,
    )

    if (!courtHasBeenNotified) {
      promises.push(this.sendReadyForCourtSmsNotificationToCourt(theCase))
    } else if (theCase.state === CaseState.RECEIVED) {
      promises.push(this.sendResubmittedToCourtSmsNotificationToCourt(theCase))

      this.eventService.postEvent('RESUBMIT', theCase)
    }

    // DEFENDER
    if (
      theCase.requestSharedWithDefender ===
        RequestSharedWithDefender.READY_FOR_COURT ||
      theCase.requestSharedWithDefender === RequestSharedWithDefender.COURT_DATE
    ) {
      const hasDefenderBeenNotified = this.hasReceivedNotification(
        [CaseNotificationType.READY_FOR_COURT, CaseNotificationType.COURT_DATE],
        theCase.defenderEmail,
        theCase.notifications,
      )

      if (hasDefenderBeenNotified) {
        promises.push(
          this.sendResubmittedToCourtEmailNotificationToDefender({
            theCase,
            defenderEmail: theCase.defenderEmail,
            defenderName: theCase.defenderName,
            defenderNationalId: theCase.defenderNationalId,
          }),
        )
      } else if (
        theCase.defenderEmail &&
        theCase.requestSharedWithDefender ===
          RequestSharedWithDefender.READY_FOR_COURT
      ) {
        promises.push(
          this.sendReadyForCourtEmailNotificationToDefender(theCase),
        )
      }
    }

    // VICTIM LAWYER
    theCase.victims?.forEach((victim) => {
      if (!victim.lawyerEmail) return

      const hasReceivedCourtEventNotification = this.hasReceivedNotification(
        [CaseNotificationType.READY_FOR_COURT, CaseNotificationType.COURT_DATE],
        victim.lawyerEmail,
        theCase.notifications,
      )
      if (hasReceivedCourtEventNotification) {
        promises.push(
          this.sendResubmittedToCourtEmailNotificationToDefender({
            theCase,
            defenderEmail: victim.lawyerEmail,
            defenderName: victim.lawyerName,
            defenderNationalId: victim.lawyerNationalId,
          }),
        )
      } else if (
        victim.lawyerAccessToRequest === RequestSharedWhen.READY_FOR_COURT
      ) {
        promises.push(
          this.sendReadyForCourtEmailNotificationToVictimLawyer({
            theCase,
            lawyerEmail: victim.lawyerEmail,
            lawyerName: victim.lawyerName,
            lawyerNationalId: victim.lawyerNationalId,
          }),
        )
      }
    })

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.READY_FOR_COURT,
      recipients,
    )
  }
  //#endregion

  //#region RECEIVED_BY_COURT notifications */
  private sendReceivedByCourtSmsNotificationToProsecutor(
    theCase: Case,
  ): Promise<Recipient> {
    const smsText = formatProsecutorReceivedByCourtSmsNotification(
      this.formatMessage,
      theCase.type,
      theCase.court?.name,
      theCase.courtCaseNumber,
    )

    return this.sendSms(smsText, theCase.prosecutor?.mobileNumber)
  }

  private async sendReceivedByCourtNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const recipient = await this.sendReceivedByCourtSmsNotificationToProsecutor(
      theCase,
    )

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.RECEIVED_BY_COURT,
      [recipient],
    )
  }
  //#endregion

  //#region non-indictment COURT_DATE notifications */
  private async uploadEmailToCourt(
    theCase: Case,
    user: UserDescriptor,
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
        `Failed to upload email to court for case ${theCase.id}`,
        { error },
      )
    }
  }

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

  private sendCourtDateEmailNotificationToProsecutor(
    theCase: Case,
    user: UserDescriptor,
  ): Promise<Recipient> {
    const arraignmentDate = DateLog.arraignmentDate(theCase.dateLogs)

    const { subject, body } = formatProsecutorCourtDateEmailNotification(
      this.formatMessage,
      theCase.type,
      theCase.courtCaseNumber,
      theCase.court?.name,
      arraignmentDate?.date,
      arraignmentDate?.location,
      theCase.judge?.name,
      theCase.registrar?.name,
      theCase.defenderName,
      theCase.sessionArrangements,
    )

    const calendarInvite =
      theCase.sessionArrangements === SessionArrangements.NONE_PRESENT ||
      !arraignmentDate
        ? undefined
        : this.getCourtDateCalendarInvite(theCase, arraignmentDate)

    return this.sendEmail({
      subject,
      html: body,
      recipientName: theCase.prosecutor?.name,
      recipientEmail: theCase.prosecutor?.email,
      attachments: calendarInvite ? [calendarInvite] : undefined,
    }).then((recipient) => {
      if (recipient.success) {
        // No need to wait
        this.uploadEmailToCourt(
          theCase,
          user,
          subject,
          body,
          theCase.prosecutor?.email,
        )
      }

      return recipient
    })
  }

  private sendCourtDateEmailNotificationToPrison(
    theCase: Case,
  ): Promise<Recipient> {
    const subject = this.formatMessage(
      notifications.prisonCourtDateEmail.subject,
      { caseType: theCase.type, courtCaseNumber: theCase.courtCaseNumber },
    )

    // Assume there is at most one defendant
    const html = formatPrisonCourtDateEmailNotification(
      this.formatMessage,
      theCase.type,
      theCase.prosecutorsOffice?.name,
      theCase.court?.name,
      DateLog.arraignmentDate(theCase.dateLogs)?.date,
      theCase.defendants && theCase.defendants.length > 0
        ? theCase.defendants[0].gender
        : undefined,
      theCase.requestedValidToDate,
      theCase.requestedCustodyRestrictions?.includes(
        CaseCustodyRestrictions.ISOLATION,
      ),
      theCase.defenderName,
      Boolean(theCase.parentCase),
      theCase.sessionArrangements,
      theCase.courtCaseNumber,
    )

    return this.sendEmail({
      subject,
      html,
      recipientName: this.formatMessage(notifications.emailNames.prison),
      recipientEmail: this.config.email.prisonEmail,
    })
  }

  private sendCourtDateCalendarInviteEmailNotificationToDefender({
    theCase,
    user,
    defenderName,
    defenderEmail,
    defenderNationalId,
    defenderSubRole,
  }: {
    theCase: Case
    user: UserDescriptor
    defenderName?: string
    defenderEmail?: string
    defenderNationalId?: string
    defenderSubRole?: DefenderSubRole
  }): Promise<Recipient> {
    const arraignmentDate = DateLog.arraignmentDate(theCase.dateLogs)

    const calendarInvite = arraignmentDate
      ? this.getCourtDateCalendarInvite(theCase, arraignmentDate)
      : undefined

    const subject = `Fyrirtaka í máli ${theCase.courtCaseNumber}`
    const html = formatDefenderCourtDateEmailNotification(
      this.formatMessage,
      theCase.court?.name,
      theCase.courtCaseNumber,
      arraignmentDate?.date,
      arraignmentDate?.location,
      theCase.judge?.name,
      theCase.registrar?.name,
      theCase.prosecutor?.name,
      theCase.prosecutorsOffice?.name,
      theCase.sessionArrangements,
      defenderSubRole,
    )

    return this.sendEmail({
      subject,
      html,
      recipientName: defenderName,
      recipientEmail: defenderEmail,
      attachments: calendarInvite ? [calendarInvite] : undefined,
      skipTail: !defenderNationalId,
    }).then((recipient) => {
      if (recipient.success) {
        // No need to wait
        this.uploadEmailToCourt(theCase, user, subject, html, defenderEmail)
      }

      return recipient
    })
  }

  private sendCourtDateEmailNotificationToDefender(
    theCase: Case,
  ): Promise<Recipient> {
    const linkSubject = `${
      theCase.requestSharedWithDefender ===
        RequestSharedWithDefender.READY_FOR_COURT ||
      theCase.requestSharedWithDefender === RequestSharedWithDefender.COURT_DATE
        ? 'Krafa í máli'
        : 'Yfirlit máls'
    } ${theCase.courtCaseNumber}`

    const linkHtml = formatDefenderCourtDateLinkEmailNotification({
      formatMessage: this.formatMessage,
      overviewUrl:
        theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id),
      court: theCase.court?.name,
      courtCaseNumber: theCase.courtCaseNumber,
      requestSharedWithDefender:
        theCase.requestSharedWithDefender ===
          RequestSharedWithDefender.READY_FOR_COURT ||
        theCase.requestSharedWithDefender ===
          RequestSharedWithDefender.COURT_DATE,
      defenderSubRole: DefenderSubRole.DEFENDANT_DEFENDER,
    })

    return this.sendEmail({
      subject: linkSubject,
      html: linkHtml,
      recipientName: theCase.defenderName,
      recipientEmail: theCase.defenderEmail,
      skipTail: !theCase.defenderNationalId,
    })
  }

  private sendCourtDateEmailNotificationToVictimLawyer({
    theCase,
    lawyerName,
    lawyerEmail,
    lawyerNationalId,
  }: {
    theCase: Case
    lawyerName?: string
    lawyerEmail?: string
    lawyerNationalId?: string
  }): Promise<Recipient> {
    const linkSubject = `Krafa í máli ${theCase.courtCaseNumber}`

    const linkHtml = formatDefenderCourtDateLinkEmailNotification({
      formatMessage: this.formatMessage,
      overviewUrl:
        lawyerNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id),
      court: theCase.court?.name,
      courtCaseNumber: theCase.courtCaseNumber,
      requestSharedWithDefender: true,
      defenderSubRole: DefenderSubRole.VICTIM_LAWYER,
    })

    return this.sendEmail({
      subject: linkSubject,
      html: linkHtml,
      recipientName: lawyerName,
      recipientEmail: lawyerEmail,
      skipTail: !lawyerNationalId,
    })
  }

  private sendCourtOfficialAssignedEmailNotificationForIndictmentCase(
    theCase: Case,
    role: UserRole.DISTRICT_COURT_JUDGE | UserRole.DISTRICT_COURT_REGISTRAR,
  ): Promise<Recipient> {
    const official =
      role === UserRole.DISTRICT_COURT_JUDGE ? theCase.judge : theCase.registrar

    if (!official?.email) {
      return Promise.resolve({ success: true })
    }

    return this.sendEmail({
      subject: this.formatMessage(
        notifications.courtOfficialAssignedEmail.subject,
        {
          courtCaseNumber: theCase.courtCaseNumber,
        },
      ),
      html: this.formatMessage(notifications.courtOfficialAssignedEmail.body, {
        courtCaseNumber: theCase.courtCaseNumber,
        role,
        linkStart: `<a href="${this.config.clientUrl}${ROUTE_HANDLER_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      }),
      recipientName: official?.name,
      recipientEmail: official?.email,
    })
  }

  // NOTE: Only for non-indictment cases
  private async sendCourtDateNotifications(
    theCase: Case,
    user?: UserDescriptor,
  ): Promise<DeliverResponse> {
    if (!user) {
      // nothing happens
      return { delivered: true }
    }
    this.eventService.postEvent('SCHEDULE_COURT_DATE', theCase)

    const promises: Promise<Recipient>[] = []

    // PROSECUTOR
    promises.push(
      this.sendCourtDateEmailNotificationToProsecutor(theCase, user),
    )

    // DEFENDER
    if (theCase.defenderEmail) {
      if (
        isRestrictionCase(theCase.type) ||
        (isInvestigationCase(theCase.type) &&
          theCase.sessionArrangements &&
          [
            SessionArrangements.ALL_PRESENT,
            SessionArrangements.ALL_PRESENT_SPOKESPERSON,
          ].includes(theCase.sessionArrangements))
      ) {
        promises.push(
          this.sendCourtDateCalendarInviteEmailNotificationToDefender({
            theCase,
            user,
            defenderName: theCase.defenderName,
            defenderEmail: theCase.defenderEmail,
            defenderNationalId: theCase.defenderNationalId,
            defenderSubRole: DefenderSubRole.DEFENDANT_DEFENDER,
          }),
        )

        const hasDefenderBeenNotified = this.hasReceivedNotification(
          [CaseNotificationType.READY_FOR_COURT],
          theCase.defenderEmail,
          theCase.notifications,
        )

        if (!hasDefenderBeenNotified) {
          promises.push(this.sendCourtDateEmailNotificationToDefender(theCase))
        }
      }
    }

    // VICTIM LAWYER
    if (isInvestigationCase(theCase.type)) {
      theCase.victims?.forEach((victim) => {
        if (!victim.lawyerEmail) return

        const hasReceivedCourtDateEventNotification =
          this.hasReceivedNotification(
            [CaseNotificationType.COURT_DATE],
            victim.lawyerEmail,
            theCase.notifications,
          )
        if (
          victim.lawyerAccessToRequest ===
            RequestSharedWhen.ARRAIGNMENT_DATE_ASSIGNED &&
          !hasReceivedCourtDateEventNotification
        ) {
          promises.push(
            this.sendCourtDateEmailNotificationToVictimLawyer({
              theCase,
              lawyerName: victim.lawyerName,
              lawyerEmail: victim.lawyerEmail,
              lawyerNationalId: victim.lawyerNationalId,
            }),
          )
        }

        if (theCase.sessionArrangements === SessionArrangements.ALL_PRESENT) {
          // calendar invite is always sent independent of request shared added by prosecutor
          promises.push(
            this.sendCourtDateCalendarInviteEmailNotificationToDefender({
              theCase,
              user,
              defenderName: victim.lawyerName,
              defenderEmail: victim.lawyerEmail,
              defenderNationalId: victim.lawyerNationalId,
              defenderSubRole: DefenderSubRole.VICTIM_LAWYER,
            }),
          )
        }
      })
    }

    // PRISON
    const shouldSendNotificationToPrison =
      await this.shouldSendNotificationToPrison(theCase)

    if (
      shouldSendNotificationToPrison &&
      theCase.type !== CaseType.PAROLE_REVOCATION
    ) {
      promises.push(this.sendCourtDateEmailNotificationToPrison(theCase))
    }

    const recipients = await Promise.all(promises)

    const result = await this.recordNotification(
      theCase.id,
      CaseNotificationType.COURT_DATE,
      recipients,
    )

    return result
  }

  private async sendDistrictCourtUserAssignedNotifications(
    theCase: Case,
    userRole: UserRole.DISTRICT_COURT_JUDGE | UserRole.DISTRICT_COURT_REGISTRAR,
  ): Promise<DeliverResponse> {
    const recipient =
      await this.sendCourtOfficialAssignedEmailNotificationForIndictmentCase(
        theCase,
        userRole,
      )

    return await this.recordNotification(
      theCase.id,
      userRole === UserRole.DISTRICT_COURT_JUDGE
        ? CaseNotificationType.DISTRICT_COURT_JUDGE_ASSIGNED
        : CaseNotificationType.DISTRICT_COURT_REGISTRAR_ASSIGNED,
      [recipient],
    )
  }
  //#endregion

  //#region RULING notifications
  private getIndictmentRulingEmailNotificationToProsecutorProps = (
    theCase: Case,
  ) => {
    return {
      subject: this.formatMessage(notifications.caseCompleted.subject, {
        isCorrection: Boolean(theCase.rulingModifiedHistory),
        courtCaseNumber: theCase.courtCaseNumber,
      }),
      html: this.formatMessage(notifications.caseCompleted.prosecutorBody, {
        isCorrection: Boolean(theCase.rulingModifiedHistory),
        courtCaseNumber: theCase.courtCaseNumber,
        courtName: applyDativeCaseToCourtName(
          theCase.court?.name || 'héraðsdómi',
        ),
        caseIndictmentRulingDecision:
          getHumanReadableCaseIndictmentRulingDecision(
            theCase.indictmentRulingDecision,
          ),
        linkStart: `<a href="${this.config.clientUrl}${CLOSED_INDICTMENT_OVERVIEW_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      }),
    }
  }

  private getRulingEmailNotificationToProsecutorProps = (theCase: Case) => {
    const sharedHtmlProps = {
      courtCaseNumber: theCase.courtCaseNumber,
      courtName: applyDativeCaseToCourtName(
        theCase.court?.name || 'héraðsdómi',
      ),
      linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
      linkEnd: '</a>',
    }
    return {
      subject: theCase.isCompletedWithoutRuling
        ? this.formatMessage(notifications.acceptedWithoutRuling.subject, {
            courtCaseNumber: theCase.courtCaseNumber,
          })
        : this.formatMessage(notifications.signedRuling.subject, {
            courtCaseNumber: theCase.courtCaseNumber,
            isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
          }),
      html: theCase.isCompletedWithoutRuling
        ? this.formatMessage(
            notifications.acceptedWithoutRuling.prosecutorBody,
            {
              ...sharedHtmlProps,
            },
          )
        : this.formatMessage(notifications.signedRuling.prosecutorBodyS3, {
            ...sharedHtmlProps,
            isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
          }),
    }
  }

  private sendRulingEmailNotificationToProsecutor(
    theCase: Case,
  ): Promise<Recipient> {
    const emailProps = isIndictmentCase(theCase.type)
      ? this.getIndictmentRulingEmailNotificationToProsecutorProps(theCase)
      : this.getRulingEmailNotificationToProsecutorProps(theCase)

    return this.sendEmail({
      subject: emailProps.subject,
      html: emailProps.html,
      recipientName: theCase.prosecutor?.name,
      recipientEmail: theCase.prosecutor?.email,
    })
  }

  private async sendRulingEmailNotificationToDefender(
    theCase: Case,
    defenderNationalId?: string,
    defenderName?: string,
    defenderEmail?: string,
  ) {
    const sharedHtmlProps = {
      courtCaseNumber: theCase.courtCaseNumber,
      courtName: applyDativeCaseToCourtName(
        theCase.court?.name || 'héraðsdómi',
      ),
      defenderHasAccessToRvg: Boolean(defenderNationalId),
      linkStart: `<a href="${formatDefenderRoute(
        this.config.clientUrl,
        theCase.type,
        theCase.id,
      )}">`,
      linkEnd: '</a>',
    }
    // for restrictive and investigation cases
    const rulingMessage = theCase.isCompletedWithoutRuling
      ? {
          subject: notifications.acceptedWithoutRuling.subject,
          body: notifications.acceptedWithoutRuling.defenderBody,
          props: { subject: { courtCaseNumber: theCase.courtCaseNumber } },
        }
      : {
          subject: notifications.signedRuling.subject,
          body: notifications.signedRuling.defenderBody,
          props: {
            subject: {
              courtCaseNumber: theCase.courtCaseNumber,
              isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
            },
            body: {
              isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
            },
          },
        }

    return this.sendEmail({
      subject: isIndictmentCase(theCase.type)
        ? this.formatMessage(notifications.caseCompleted.subject, {
            isCorrection: Boolean(theCase.rulingModifiedHistory),
            courtCaseNumber: theCase.courtCaseNumber,
          })
        : this.formatMessage(rulingMessage.subject, {
            ...rulingMessage.props.subject,
          }),
      html: isIndictmentCase(theCase.type)
        ? this.formatMessage(notifications.caseCompleted.defenderBody, {
            isCorrection: Boolean(theCase.rulingModifiedHistory),
            caseIndictmentRulingDecision:
              getHumanReadableCaseIndictmentRulingDecision(
                theCase.indictmentRulingDecision,
              ),
            ...sharedHtmlProps,
          })
        : this.formatMessage(rulingMessage.body, {
            ...rulingMessage.props.body,
            ...sharedHtmlProps,
          }),
      recipientName: defenderName ?? '',
      recipientEmail: defenderEmail ?? '',
      skipTail: Boolean(defenderNationalId) === false,
    })
  }

  private async sendRulingEmailNotificationToVictimLawyer({
    theCase,
    defenderNationalId,
    defenderName,
    defenderEmail,
  }: {
    theCase: Case
    defenderNationalId?: string
    defenderName?: string
    defenderEmail?: string
  }) {
    const sharedHtmlProps = {
      courtCaseNumber: theCase.courtCaseNumber,
      courtName: applyDativeCaseToCourtName(
        theCase.court?.name || 'héraðsdómi',
      ),
      defenderHasAccessToRvg: Boolean(defenderNationalId),
      linkStart: `<a href="${formatDefenderRoute(
        this.config.clientUrl,
        theCase.type,
        theCase.id,
      )}">`,
      linkEnd: '</a>',
    }

    const rulingMessage = theCase.isCompletedWithoutRuling
      ? {
          subject: notifications.acceptedWithoutRuling.subject,
          body: notifications.acceptedWithoutRuling.victimLawyerBody,
          props: { subject: { courtCaseNumber: theCase.courtCaseNumber } },
        }
      : {
          subject: notifications.signedRuling.subject,
          body: notifications.signedRuling.victimLawyerBody,
          props: {
            subject: {
              courtCaseNumber: theCase.courtCaseNumber,
              isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
            },
            body: {
              isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
            },
          },
        }

    return this.sendEmail({
      subject: this.formatMessage(rulingMessage.subject, {
        ...rulingMessage.props.subject,
      }),
      html: this.formatMessage(rulingMessage.body, {
        ...rulingMessage.props.body,
        ...sharedHtmlProps,
      }),
      recipientName: defenderName ?? '',
      recipientEmail: defenderEmail ?? '',
      skipTail: !defenderNationalId,
    })
  }

  private async sendRulingEmailNotificationToPrison(
    theCase: Case,
  ): Promise<Recipient> {
    const subject = this.formatMessage(
      notifications.prisonRulingEmail.subject,
      {
        isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )
    const html =
      theCase.type === CaseType.PAROLE_REVOCATION
        ? this.formatMessage(
            notifications.prisonRulingEmail.paroleRevocationBody,
            {
              institutionName: theCase.court?.name,
              courtCaseNumber: theCase.courtCaseNumber,
              linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
              linkEnd: '</a>',
            },
          )
        : this.formatMessage(notifications.prisonRulingEmail.body, {
            isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
            institutionName: theCase.court?.name,
            caseType: theCase.type,
            linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
            linkEnd: '</a>',
          })

    return this.sendEmail({
      subject,
      html,
      recipientName: this.formatMessage(notifications.emailNames.prison),
      recipientEmail: this.config.email.prisonEmail,
    })
  }

  private async sendRulingEmailNotificationToPrisonAdministration(
    theCase: Case,
  ): Promise<Recipient> {
    const { subject, body } = formatPrisonAdministrationRulingNotification(
      this.formatMessage,
      Boolean(theCase.rulingModifiedHistory),
      `${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}`,
      theCase.courtCaseNumber,
      theCase.court?.name,
    )
    const institutionContact =
      this.institutionContactRepositoryService.getInstitutionContact(
        this.config.prisonAdminId,
        DefendantNotificationType.INDICTMENT_SENT_TO_PRISON_ADMIN,
      )

    return this.sendEmail({
      subject,
      html: body,
      recipientName: this.formatMessage(notifications.emailNames.prisonAdmin),
      recipientEmail: `${this.config.email.prisonAdminEmail}${
        institutionContact ? `,${institutionContact}` : ''
      }`,
    })
  }

  private async sendRejectedCustodyEmailToPrison(
    theCase: Case,
  ): Promise<Recipient> {
    const subject = this.formatMessage(
      notifications.rejectedCustodyEmail.subject,
      {
        isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
        caseType: theCase.type,
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )
    const body = this.formatMessage(notifications.rejectedCustodyEmail.body, {
      court: theCase.court?.name,
      caseType: theCase.type,
      courtCaseNumber: theCase.courtCaseNumber,
    })

    return this.sendEmail({
      subject,
      html: body,
      recipientName: this.formatMessage(notifications.emailNames.prison),
      recipientEmail: this.config.email.prisonEmail,
    })
  }

  private async sendRulingNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const promises = [this.sendRulingEmailNotificationToProsecutor(theCase)]

    // DEFENDANTS BOTH S AND R CASES
    if (isIndictmentCase(theCase.type)) {
      const uniqueDefendants = _uniqBy(
        theCase.defendants ?? [],
        (d: Defendant) => d.defenderEmail,
      )
      uniqueDefendants.forEach((defendant) => {
        if (defendant.defenderEmail && defendant.isDefenderChoiceConfirmed) {
          promises.push(
            this.sendRulingEmailNotificationToDefender(
              theCase,
              defendant.defenderNationalId,
              defendant.defenderName,
              defendant.defenderEmail,
            ),
          )
        }
      })
    } else if (
      theCase.defenderEmail &&
      (isRestrictionCase(theCase.type) ||
        (isInvestigationCase(theCase.type) &&
          theCase.sessionArrangements &&
          [
            SessionArrangements.ALL_PRESENT,
            SessionArrangements.ALL_PRESENT_SPOKESPERSON,
          ].includes(theCase.sessionArrangements)))
    ) {
      promises.push(
        this.sendRulingEmailNotificationToDefender(
          theCase,
          theCase.defenderNationalId,
          theCase.defenderName,
          theCase.defenderEmail,
        ),
      )
    }

    // VICTIM LAWYER
    if (
      isInvestigationCase(theCase.type) &&
      theCase.sessionArrangements === SessionArrangements.ALL_PRESENT
    ) {
      theCase.victims?.forEach((victim) => {
        if (!victim.lawyerEmail) return

        promises.push(
          this.sendRulingEmailNotificationToVictimLawyer({
            theCase,
            defenderNationalId: victim.lawyerNationalId,
            defenderName: victim.lawyerName,
            defenderEmail: victim.lawyerEmail,
          }),
        )
      })
    }

    // PRISON ADMIN
    if (
      (isRestrictionCase(theCase.type) ||
        theCase.type === CaseType.PAROLE_REVOCATION) &&
      theCase.state === CaseState.ACCEPTED
    ) {
      promises.push(
        this.sendRulingEmailNotificationToPrisonAdministration(theCase),
      )
    }

    // PRISON
    if (
      theCase.decision === CaseDecision.ACCEPTING ||
      theCase.decision === CaseDecision.ACCEPTING_PARTIALLY
    ) {
      const shouldSendNotificationToPrison =
        await this.shouldSendNotificationToPrison(theCase)

      if (shouldSendNotificationToPrison) {
        promises.push(this.sendRulingEmailNotificationToPrison(theCase))
      }
    } else if (
      theCase.type === CaseType.CUSTODY &&
      (theCase.decision === CaseDecision.REJECTING ||
        theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN)
    ) {
      const prisonHasBeenNotified = this.hasReceivedNotification(
        CaseNotificationType.COURT_DATE,
        this.config.email.prisonEmail,
        theCase.notifications,
      )

      if (prisonHasBeenNotified) {
        promises.push(this.sendRejectedCustodyEmailToPrison(theCase))
      }
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.RULING,
      recipients,
    )
  }
  //#endregion

  //#region MODIFIED notifications
  private async sendModifiedNotificationToDefender(
    subject: string,
    theCase: Case,
    user: User,
  ): Promise<Recipient> {
    return this.sendEmail({
      subject,
      html: theCase.isCustodyIsolation
        ? this.formatMessage(notifications.modified.isolationHtmlDefender, {
            caseType: theCase.type,
            actorInstitution: user.institution?.name,
            actorName: user.name,
            actorTitle: lowercase(user.title),
            courtCaseNumber: theCase.courtCaseNumber,
            defenderHasAccessToRvg: Boolean(theCase.defenderNationalId),
            linkStart: `<a href="${formatDefenderRoute(
              this.config.clientUrl,
              theCase.type,
              theCase.id,
            )}">`,
            linkEnd: '</a>',
            validToDate: formatDate(theCase.validToDate, 'PPPp'),
            isolationToDate: formatDate(theCase.isolationToDate, 'PPPp'),
          })
        : this.formatMessage(notifications.modified.htmlDefender, {
            caseType: theCase.type,
            actorInstitution: user.institution?.name,
            actorName: user.name,
            actorTitle: lowercase(user.title),
            courtCaseNumber: theCase.courtCaseNumber,
            defenderHasAccessToRvg: Boolean(theCase.defenderNationalId),
            linkStart: `<a href="${formatDefenderRoute(
              this.config.clientUrl,
              theCase.type,
              theCase.id,
            )}">`,
            linkEnd: '</a>',
            validToDate: formatDate(theCase.validToDate, 'PPPp'),
          }),
      recipientName: theCase.defenderName,
      recipientEmail: theCase.defenderEmail,
      skipTail: !theCase.defenderNationalId,
    })
  }

  private async sendModifiedNotifications(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    const subject = this.formatMessage(notifications.modified.subject, {
      courtCaseNumber: theCase.courtCaseNumber,
      caseType: theCase.type,
    })

    const html = theCase.isCustodyIsolation
      ? this.formatMessage(notifications.modified.isolationHtml, {
          caseType: theCase.type,
          actorInstitution: user.institution?.name,
          actorName: user.name,
          actorTitle: lowercase(user.title),
          courtCaseNumber: theCase.courtCaseNumber,
          linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
          linkEnd: '</a>',
          validToDate: formatDate(theCase.validToDate, 'PPPp'),
          isolationToDate: formatDate(theCase.isolationToDate, 'PPPp'),
        })
      : this.formatMessage(notifications.modified.html, {
          caseType: theCase.type,
          actorInstitution: user.institution?.name,
          actorName: user.name,
          actorTitle: lowercase(user.title),
          courtCaseNumber: theCase.courtCaseNumber,
          linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
          linkEnd: '</a>',
          validToDate: formatDate(theCase.validToDate, 'PPPp'),
        })

    const promises = [
      this.sendEmail({
        subject,
        html,
        recipientName: this.formatMessage(notifications.emailNames.prisonAdmin),
        recipientEmail: this.config.email.prisonAdminEmail,
      }),
    ]

    const shouldSendNotificationToPrison =
      await this.shouldSendNotificationToPrison(theCase)

    if (shouldSendNotificationToPrison) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: this.formatMessage(notifications.emailNames.prison),
          recipientEmail: this.config.email.prisonEmail,
        }),
      )
    }

    if (user.id !== theCase.prosecutorId) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: theCase.prosecutor?.name,
          recipientEmail: theCase.prosecutor?.email,
        }),
      )
    }

    if (user.id !== theCase.judgeId) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: theCase.judge?.name,
          recipientEmail: theCase.judge?.email,
        }),
      )
    }

    if (theCase.registrar && user.id !== theCase.registrarId) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: theCase.registrar.name,
          recipientEmail: theCase.registrar.email,
        }),
      )
    }

    if (theCase.defenderEmail) {
      promises.push(
        this.sendModifiedNotificationToDefender(subject, theCase, user),
      )
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.MODIFIED,
      recipients,
    )
  }
  //#endregion

  //#region REVOKED notifications */
  private sendRevokedSmsNotificationToCourt(theCase: Case): Promise<Recipient> {
    const smsText = formatCourtRevokedSmsNotification(
      this.formatMessage,
      theCase.type,
      theCase.prosecutor?.name,
      theCase.requestedCourtDate,
      DateLog.arraignmentDate(theCase.dateLogs)?.date,
    )

    return this.sendSms(smsText, this.getCourtMobileNumbers(theCase.courtId))
  }

  private sendRevokedEmailNotificationToPrison(
    theCase: Case,
  ): Promise<Recipient> {
    const subject = this.formatMessage(
      notifications.prisonRevokedEmail.subject,
      { caseType: theCase.type, courtCaseNumber: theCase.courtCaseNumber },
    )

    // Assume there is at most one defendant
    const html = formatPrisonRevokedEmailNotification(
      this.formatMessage,
      theCase.type,
      theCase.prosecutorsOffice?.name,
      theCase.court?.name,
      DateLog.arraignmentDate(theCase.dateLogs)?.date,
      theCase.defenderName,
      Boolean(theCase.parentCase),
      theCase.courtCaseNumber,
    )

    return this.sendEmail({
      subject,
      html,
      recipientName: this.formatMessage(notifications.emailNames.prison),
      recipientEmail: this.config.email.prisonEmail,
      skipTail: true,
    })
  }

  private sendRevokedEmailNotificationToDefender(
    caseType: CaseType,
    caseId: string,
    actorInstitution?: string,
    defenderName?: string,
    defenderEmail?: string,
    defenderNationalId?: string,
    courtName?: string,
    courtCaseNumber?: string,
  ): Promise<Recipient> {
    const subject = isIndictmentCase(caseType)
      ? this.formatMessage(
          notifications.defenderRevokedEmail.indictmentSubject,
          { courtCaseNumber },
        )
      : this.formatMessage(notifications.defenderRevokedEmail.subject, {
          caseType,
        })

    const html = this.formatMessage(notifications.defenderRevokedEmail.bodyV2, {
      actorInstitution,
      courtName: applyDativeCaseToCourtName(courtName || 'héraðsdómi'),
      courtCaseNumber,
      caseType,
      defenderHasAccessToRvg: Boolean(defenderNationalId),
      linkStart: `<a href="${formatDefenderRoute(
        this.config.clientUrl,
        caseType,
        caseId,
      )}">`,
      linkEnd: '</a>',
    })

    return this.sendEmail({
      subject,
      html,
      recipientName: defenderName,
      recipientEmail: defenderEmail,
      skipTail: isIndictmentCase(caseType) || !defenderNationalId,
    })
  }

  private async sendRevokedNotificationsForRequestCase(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const promises: Promise<Recipient>[] = []

    const courtWasNotified = this.hasReceivedNotification(
      undefined,
      this.getCourtMobileNumbers(theCase.courtId),
      theCase.notifications,
    )

    if (courtWasNotified) {
      promises.push(this.sendRevokedSmsNotificationToCourt(theCase))
    }

    const prisonWasNotified = this.hasReceivedNotification(
      undefined,
      this.config.email.prisonEmail,
      theCase.notifications,
    )

    if (prisonWasNotified) {
      promises.push(this.sendRevokedEmailNotificationToPrison(theCase))
    }

    const defenderWasNotified = this.hasReceivedNotification(
      undefined,
      theCase.defenderEmail,
      theCase.notifications,
    )

    if (defenderWasNotified && theCase.defendants) {
      promises.push(
        this.sendRevokedEmailNotificationToDefender(
          theCase.type,
          theCase.id,
          theCase.creatingProsecutor?.institution?.name,
          theCase.defenderName,
          theCase.defenderEmail,
          theCase.defenderNationalId,
          theCase.court?.name,
          theCase.courtCaseNumber,
        ),
      )
    }

    const recipients = await Promise.all(promises)

    if (recipients.length === 0) {
      // Nothing to send
      return { delivered: true }
    }

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.REVOKED,
      recipients,
    )
  }

  private sendRevokedNotificationToCourt(
    theCase: Case,
    recipientName?: string,
    recipientEmail?: string,
  ): Promise<Recipient> {
    const { courtCaseNumber } = theCase
    const subject = this.formatMessage(
      notifications.courtRevokedIndictmentEmail.subject,
      {
        courtCaseNumber: courtCaseNumber || 'NONE',
      },
    )
    const body = this.formatMessage(
      notifications.courtRevokedIndictmentEmail.body,
      {
        prosecutorsOffice: theCase.creatingProsecutor?.institution?.name,
        caseNumber: courtCaseNumber || theCase.policeCaseNumbers.join(', '),
      },
    )

    return this.sendEmail({
      subject,
      html: body,
      recipientName,
      recipientEmail,
    })
  }

  private async sendRevokeNotificationsForIndictmentCase(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const promises: Promise<Recipient>[] = []

    if (!theCase.judge && !theCase.registrar) {
      promises.push(
        this.sendRevokedNotificationToCourt(
          theCase,
          theCase.court?.name,
          this.getCourtEmail(theCase.courtId),
        ),
      )
    } else {
      if (theCase.judge) {
        promises.push(
          this.sendRevokedNotificationToCourt(
            theCase,
            theCase.judge.name,
            theCase.judge.email,
          ),
        )
      }

      if (theCase.registrar) {
        promises.push(
          this.sendRevokedNotificationToCourt(
            theCase,
            theCase.registrar.name,
            theCase.registrar.email,
          ),
        )
      }
    }

    const uniqDefendants = _uniqBy(
      theCase.defendants ?? [],
      (d: Defendant) => d.defenderEmail,
    )
    for (const defendant of uniqDefendants) {
      const defenderWasNotified = this.hasReceivedNotification(
        undefined,
        defendant.defenderEmail,
        theCase.notifications,
      )

      if (defenderWasNotified) {
        promises.push(
          this.sendRevokedEmailNotificationToDefender(
            theCase.type,
            theCase.id,
            theCase.creatingProsecutor?.institution?.name,
            defendant.defenderName,
            defendant.defenderEmail,
            defendant.defenderNationalId,
            theCase.court?.name,
            theCase.courtCaseNumber,
          ),
        )
      }
    }

    const recipients = await Promise.all(promises)

    if (recipients.length === 0) {
      // Nothing to send
      return { delivered: true }
    }

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.REVOKED,
      recipients,
    )
  }

  private sendRevokedNotifications(theCase: Case): Promise<DeliverResponse> {
    if (isRequestCase(theCase.type)) {
      return this.sendRevokedNotificationsForRequestCase(theCase)
    } else {
      return this.sendRevokeNotificationsForIndictmentCase(theCase)
    }
  }
  //#endregion

  //#region ADVOCATE_ASSIGNED notifications */
  private shouldSendAdvocateAssignedNotification(
    theCase: Case,
    advocateEmail?: string,
  ): boolean {
    if (!advocateEmail) {
      return false
    }
    if (isInvestigationCase(theCase.type)) {
      const isDefenderIncludedInSessionArrangements =
        theCase.sessionArrangements &&
        [
          SessionArrangements.ALL_PRESENT,
          SessionArrangements.ALL_PRESENT_SPOKESPERSON,
        ].includes(theCase.sessionArrangements)

      if (!isDefenderIncludedInSessionArrangements) {
        return false
      }
    } else if (isRequestCase(theCase.type)) {
      const hasDefenderBeenNotified = this.hasReceivedNotification(
        [
          CaseNotificationType.READY_FOR_COURT,
          CaseNotificationType.COURT_DATE,
          CaseNotificationType.ADVOCATE_ASSIGNED,
        ],
        theCase.defenderEmail,
        theCase.notifications,
      )

      if (hasDefenderBeenNotified) {
        return false
      }
    }

    return true
  }

  private async sendAdvocateAssignedNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const promises: Promise<Recipient>[] = []

    if (DateLog.arraignmentDate(theCase.dateLogs)?.date) {
      const shouldSend = this.shouldSendAdvocateAssignedNotification(
        theCase,
        theCase.defenderEmail,
      )

      if (shouldSend) {
        promises.push(this.sendCourtDateEmailNotificationToDefender(theCase))
      }
    }

    const recipients = await Promise.all(promises)

    if (recipients.length === 0) {
      // Nothing to send
      return { delivered: true }
    }

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.ADVOCATE_ASSIGNED,
      recipients,
    )
  }
  //#endregion

  //#region DEFENDANTS_NOT_UPDATED_AT_COURT notifications
  private async sendDefendantsNotUpdatedAtCourtNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    if (
      !theCase.registrar ||
      this.hasReceivedNotification(
        CaseNotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
        theCase.registrar?.email,
        theCase.notifications,
      )
    ) {
      // Nothing to send
      return { delivered: true }
    }

    const subject = this.formatMessage(
      notifications.defendantsNotUpdatedAtCourt.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )
    const html = this.formatMessage(
      notifications.defendantsNotUpdatedAtCourt.body,
      { courtCaseNumber: theCase.courtCaseNumber },
    )

    const recipient = await this.sendEmail({
      subject,
      html,
      recipientName: theCase.registrar.name,
      recipientEmail: theCase.registrar.email,
      skipTail: true,
    })

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
      [recipient],
    )
  }
  //#endregion

  //#region INDICTMENT_DENIED notifications
  private async sendIndictmentDeniedNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const subject = this.formatMessage(notifications.indictmentDenied.subject)
    const html = this.formatMessage(notifications.indictmentDenied.body, {
      caseNumber: theCase.policeCaseNumbers[0],
      linkStart: `<a href="${this.config.clientUrl}${INDICTMENTS_OVERVIEW_ROUTE}/${theCase.id}">`,
      linkEnd: '</a>',
    })

    const recipient = await this.sendEmail({
      subject,
      html,
      recipientName: theCase.prosecutor?.name,
      recipientEmail: theCase.prosecutor?.email,
    })

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.INDICTMENT_DENIED,
      [recipient],
    )
  }
  //#endregion

  //#region INDICTMENT_RETURNED notifications
  private async sendIndictmentReturnedNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const subject = this.formatMessage(
      notifications.indictmentReturned.subject,
      {
        caseNumber: theCase.policeCaseNumbers[0],
      },
    )
    const html = this.formatMessage(notifications.indictmentReturned.body, {
      courtName: theCase.court?.name,
      caseNumber: theCase.policeCaseNumbers[0],
      linkStart: `<a href="${this.config.clientUrl}${INDICTMENTS_OVERVIEW_ROUTE}/${theCase.id}">`,
      linkEnd: '</a>',
    })

    const recipient = await this.sendEmail({
      subject,
      html,
      recipientName: theCase.prosecutor?.name,
      recipientEmail: theCase.prosecutor?.email,
    })

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.INDICTMENT_RETURNED,
      [recipient],
    )
  }
  //#endregion

  //#region PUBLIC_PROSECUTOR_REVIEWER_ASSIGNED notifications
  private async sendPublicProsecutorReviewerAssignedNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const rulingDate = theCase.rulingDate
    if (!rulingDate) {
      return { delivered: true }
    }
    const subject = `Úthlutun máls ${theCase.courtCaseNumber} til yfirlestrar`

    const { deadlineDate } = getIndictmentAppealDeadline({
      baseDate: rulingDate,
      isFine:
        theCase.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE,
    })
    const html = `Þér hefur verið úthlutað máli ${
      theCase.courtCaseNumber
    } til yfirlestrar. Áfrýjunarfrestur er til ${formatDate(
      deadlineDate,
    )}. Sjá nánar á <a href="${
      this.config.clientUrl
    }${CLOSED_INDICTMENT_OVERVIEW_ROUTE}/${
      theCase.id
    }">yfirlitssíðu málsins í Réttarvörslugátt.</a>`

    const recipient = await this.sendEmail({
      subject,
      html,
      recipientName: theCase.indictmentReviewer?.name,
      recipientEmail: theCase.indictmentReviewer?.email,
    })

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.PUBLIC_PROSECUTOR_REVIEWER_ASSIGNED,
      [recipient],
    )
  }
  //#endregion

  //#region CASE_FILES_UPDATED notifications
  private sendCaseFilesUpdatedNotification(
    courtCaseNumber?: string,
    court?: string,
    link?: string,
    name?: string,
    email?: string,
  ) {
    const subject = this.formatMessage(notifications.caseFilesUpdated.subject, {
      courtCaseNumber,
    })
    const html = this.formatMessage(notifications.caseFilesUpdated.body, {
      courtCaseNumber,
      court: applyDativeCaseToCourtName(court || 'héraðsdómi'),
      userHasAccessToRVG: Boolean(link),
      linkStart: `<a href="${link}">`,
      linkEnd: '</a>',
    })

    return this.sendEmail({
      subject,
      html,
      recipientName: name,
      recipientEmail: email,
      skipTail: !link,
    })
  }

  private async sendCaseFilesUpdatedNotifications(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    const isCurrentUserRecipient = (user: User, recipientEmail?: string) =>
      user.email === recipientEmail

    const promises = []
    if (!isCurrentUserRecipient(user, theCase.judge?.email)) {
      promises.push(
        this.sendCaseFilesUpdatedNotification(
          theCase.courtCaseNumber,
          theCase.court?.name,
          `${this.config.clientUrl}${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${theCase.id}`,
          theCase.judge?.name,
          theCase.judge?.email,
        ),
      )
    }

    if (
      theCase.registrar &&
      !isCurrentUserRecipient(user, theCase.registrar.email)
    ) {
      promises.push(
        this.sendCaseFilesUpdatedNotification(
          theCase.courtCaseNumber,
          theCase.court?.name,
          `${this.config.clientUrl}${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${theCase.id}`,
          theCase.registrar.name,
          theCase.registrar.email,
        ),
      )
    }

    const uniqueSpokespersons = _uniqBy(
      theCase.civilClaimants?.filter(
        (c) =>
          c.hasSpokesperson &&
          !isCurrentUserRecipient(user, c.spokespersonEmail),
      ) ?? [],
      (c: CivilClaimant) => c.spokespersonEmail,
    )
    uniqueSpokespersons.forEach((civilClaimant) => {
      if (civilClaimant.spokespersonEmail) {
        promises.push(
          this.sendCaseFilesUpdatedNotification(
            theCase.courtCaseNumber,
            theCase.court?.name,
            civilClaimant.spokespersonNationalId &&
              formatDefenderRoute(
                this.config.clientUrl,
                theCase.type,
                theCase.id,
              ),
            civilClaimant.spokespersonName,
            civilClaimant.spokespersonEmail,
          ),
        )
      }
    })

    if (isProsecutionUser(user)) {
      const uniqueDefendants = _uniqBy(
        theCase.defendants ?? [],
        (d: Defendant) => d.defenderEmail,
      )
      uniqueDefendants.forEach((defendant) => {
        if (defendant.defenderEmail && defendant.isDefenderChoiceConfirmed) {
          promises.push(
            this.sendCaseFilesUpdatedNotification(
              theCase.courtCaseNumber,
              theCase.court?.name,
              defendant.defenderNationalId &&
                formatDefenderRoute(
                  this.config.clientUrl,
                  theCase.type,
                  theCase.id,
                ),
              defendant.defenderName,
              defendant.defenderEmail,
            ),
          )
        }
      })
    }

    if (isDefenceUser(user)) {
      promises.push(
        this.sendCaseFilesUpdatedNotification(
          theCase.courtCaseNumber,
          theCase.court?.name,
          `${this.config.clientUrl}${INDICTMENTS_OVERVIEW_ROUTE}/${theCase.id}`,
          theCase.prosecutor?.name,
          theCase.prosecutor?.email,
        ),
      )
    }

    const recipients = await Promise.all(promises)

    if (recipients.length > 0) {
      return this.recordNotification(
        theCase.id,
        CaseNotificationType.CASE_FILES_UPDATED,
        recipients,
      )
    }

    return { delivered: true }
  }
  //#endregion

  //#region Ruling order notifications
  //#region RULING_ORDER_ADDED notifications
  private sendRulingOrderAddedNotification({
    courtCaseNumber,
    link,
    name,
    email,
  }: {
    courtCaseNumber?: string
    link?: string
    name?: string
    email?: string
  } = {}) {
    const subject = `Nýr úrskurður í máli ${courtCaseNumber}`
    const hasLink = Boolean(link)
    const html = hasLink
      ? `Dómari hefur kveðið upp úrskurð í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins á <a href="${link}">yfirlitssíðu málsins í Réttarvörslugátt.</a>`
      : `Dómari hefur kveðið upp úrskurð í máli ${courtCaseNumber}. Hægt er að nálgast gögn málsins í Réttarvörslugátt.`

    return this.sendEmail({
      subject,
      html,
      recipientName: name,
      recipientEmail: email,
    })
  }

  private async sendRulingOrderAddedNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const promises = []

    if (theCase.registrar) {
      promises.push(
        this.sendRulingOrderAddedNotification({
          courtCaseNumber: theCase.courtCaseNumber,
          link: `${this.config.clientUrl}${ROUTE_HANDLER_ROUTE}/${theCase.id}`,
          name: theCase.registrar.name,
          email: theCase.registrar.email,
        }),
      )
    }

    const uniqueSpokespersons = _uniqBy(
      theCase.civilClaimants?.filter((c) => c.hasSpokesperson) ?? [],
      (c: CivilClaimant) => c.spokespersonEmail,
    )
    uniqueSpokespersons.forEach((civilClaimant) => {
      if (civilClaimant.spokespersonEmail) {
        promises.push(
          this.sendRulingOrderAddedNotification({
            courtCaseNumber: theCase.courtCaseNumber,
            link:
              civilClaimant.spokespersonNationalId &&
              formatDefenderRoute(
                this.config.clientUrl,
                theCase.type,
                theCase.id,
              ),
            name: civilClaimant.spokespersonName,
            email: civilClaimant.spokespersonEmail,
          }),
        )
      }
    })

    const uniqueDefendants = _uniqBy(
      theCase.defendants ?? [],
      (d: Defendant) => d.defenderEmail,
    )
    uniqueDefendants.forEach((defendant) => {
      if (defendant.defenderEmail && defendant.isDefenderChoiceConfirmed) {
        promises.push(
          this.sendRulingOrderAddedNotification({
            courtCaseNumber: theCase.courtCaseNumber,
            link:
              defendant.defenderNationalId &&
              formatDefenderRoute(
                this.config.clientUrl,
                theCase.type,
                theCase.id,
              ),
            name: defendant.defenderName,
            email: defendant.defenderEmail,
          }),
        )
      }
    })

    promises.push(
      this.sendRulingOrderAddedNotification({
        courtCaseNumber: theCase.courtCaseNumber,
        link: `${this.config.clientUrl}${ROUTE_HANDLER_ROUTE}/${theCase.id}`,
        name: theCase.prosecutor?.name,
        email: theCase.prosecutor?.email,
      }),
    )

    const recipients = await Promise.all(promises)

    if (recipients.length > 0) {
      return this.recordNotification(
        theCase.id,
        CaseNotificationType.RULING_ORDER_ADDED,
        recipients,
      )
    }

    return { delivered: true }
  }
  //#endregion

  //#region Appeal notifications
  //#region COURT_OF_APPEAL_JUDGE_ASSIGNED notifications
  private async sendCourtOfAppealJudgeAssignedNotification(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const promises: Promise<Recipient>[] = []
    const recipientRoles = [
      theCase.appealAssistant,
      theCase.appealJudge1,
      theCase.appealJudge2,
      theCase.appealJudge3,
    ]

    recipientRoles.forEach((recipient) => {
      if (theCase.appealCaseNumber && recipient && theCase.appealJudge1?.name) {
        const { subject, body } =
          formatCourtOfAppealJudgeAssignedEmailNotification(
            this.formatMessage,
            theCase.appealCaseNumber,
            recipient.id === theCase.appealJudge1Id,
            theCase.appealJudge1.name,
            recipient.role,
            `${this.config.clientUrl}${COURT_OF_APPEAL_OVERVIEW_ROUTE}/${theCase.id}`,
          )

        promises.push(
          this.sendEmail({
            subject,
            html: body,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
          }),
        )
      }
    })

    const recipients = await Promise.all(promises)

    if (recipients.length > 0) {
      return this.recordNotification(
        theCase.id,
        CaseNotificationType.APPEAL_JUDGES_ASSIGNED,
        recipients,
      )
    }

    return { delivered: true }
  }
  //#endregion

  //#region APPEAL_TO_COURT_OF_APPEALS notifications
  private async sendAppealToCourtOfAppealsNotifications(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    const subject = this.formatMessage(
      notifications.caseAppealedToCourtOfAppeals.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )
    const html = this.formatMessage(
      notifications.caseAppealedToCourtOfAppeals.body,
      {
        userHasAccessToRVG: true,
        courtCaseNumber: theCase.courtCaseNumber,
        linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )
    const smsText = this.formatMessage(
      notifications.caseAppealedToCourtOfAppeals.text,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )

    const promises = [
      this.sendEmail({
        subject,
        html,
        recipientName: theCase.judge?.name,
        recipientEmail: theCase.judge?.email,
      }),
    ]

    const courtEmail = this.getCourtEmail(theCase.courtId)
    if (courtEmail) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: theCase.court?.name,
          recipientEmail: courtEmail,
        }),
      )
    }

    if (theCase.registrar) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: theCase.registrar.name,
          recipientEmail: theCase.registrar.email,
        }),
      )
    }

    if (isDefenceUser(user)) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: theCase.prosecutor?.name,
          recipientEmail: theCase.prosecutor?.email,
        }),
      )
      promises.push(this.sendSms(smsText, theCase.prosecutor?.mobileNumber))
    }

    if (isProsecutionUser(user) && theCase.defenderEmail) {
      const url =
        theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id)
      const defenderHtml = this.formatMessage(
        notifications.caseAppealedToCourtOfAppeals.body,
        {
          userHasAccessToRVG: Boolean(url),
          court: applyDativeCaseToCourtName(
            theCase.court?.name || 'héraðsdómi',
          ),
          courtCaseNumber: theCase.courtCaseNumber,
          linkStart: `<a href="${url}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: defenderHtml,
          recipientName: theCase.defenderName,
          recipientEmail: theCase.defenderEmail,

          skipTail: !theCase.defenderNationalId,
        }),
      )
    }

    promises.push(
      this.sendSms(
        smsText,
        this.getCourtAssistantMobileNumbers(theCase.courtId),
      ),
    )

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.APPEAL_TO_COURT_OF_APPEALS,
      recipients,
    )
  }
  //#endregion

  //#region APPEAL_RECEIVED_BY_COURT notifications
  private async sendAppealReceivedByCourtNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const statementDeadline =
      theCase.appealReceivedByCourtDate &&
      getStatementDeadline(theCase.appealReceivedByCourtDate)

    const subject = this.formatMessage(
      notifications.caseAppealReceivedByCourt.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )

    const html = this.formatMessage(
      notifications.caseAppealReceivedByCourt.courtOfAppealsBody,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        statementDeadline: formatDate(statementDeadline, 'PPPp'),
        linkStart: `<a href="${this.config.clientUrl}${COURT_OF_APPEAL_OVERVIEW_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    const smsText = this.formatMessage(
      notifications.caseAppealReceivedByCourt.text,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        statementDeadline: formatDate(statementDeadline, 'PPPp'),
      },
    )

    const courtOfAppealsAssistantEmails =
      this.config.email.courtOfAppealsAssistantEmails
        .split(',')
        .map((email) => email.trim())

    const allCourtOfAppealsEmails = [
      ...courtOfAppealsAssistantEmails,
      this.getCourtEmail(this.config.courtOfAppealsId),
    ]

    const promises = allCourtOfAppealsEmails.map((email) =>
      this.sendEmail({
        subject,
        html,
        recipientName: this.formatMessage(
          notifications.emailNames.courtOfAppeals,
        ),
        recipientEmail: email,
      }),
    )

    const prosecutorHtml = this.formatMessage(
      notifications.caseAppealReceivedByCourt.body,
      {
        userHasAccessToRVG: true,
        courtCaseNumber: theCase.courtCaseNumber,
        statementDeadline: formatDate(statementDeadline, 'PPPp'),
        linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    promises.push(
      this.sendEmail({
        subject,
        html: prosecutorHtml,
        recipientName: theCase.prosecutor?.name,
        recipientEmail: theCase.prosecutor?.email,
      }),
    )

    if (theCase.defenderEmail) {
      const url =
        theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id)
      const defenderHtml = this.formatMessage(
        notifications.caseAppealReceivedByCourt.body,
        {
          userHasAccessToRVG: Boolean(url),
          court: applyDativeCaseToCourtName(
            theCase.court?.name || 'héraðsdómi',
          ),
          courtCaseNumber: theCase.courtCaseNumber,
          statementDeadline: formatDate(statementDeadline, 'PPPp'),
          linkStart: `<a href="${url}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: defenderHtml,
          recipientName: theCase.defenderName,
          recipientEmail: theCase.defenderEmail,

          skipTail: !theCase.defenderNationalId,
        }),
      )
    }

    promises.push(this.sendSms(smsText, theCase.prosecutor?.mobileNumber))

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.APPEAL_RECEIVED_BY_COURT,
      recipients,
    )
  }
  //#endregion

  //#region APPEAL_RULING_ACCEPTED notifications
  private async sendAppealStatementNotifications(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    const subject = this.formatMessage(
      notifications.caseAppealStatement.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCaseNumber ?? 'NONE',
      },
    )

    const promises = []

    if (theCase.appealCaseNumber) {
      const courtOfAppealsHtml = this.formatMessage(
        notifications.caseAppealStatement.body,
        {
          userHasAccessToRVG: true,
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCaseNumber,
          linkStart: `<a href="${this.config.clientUrl}${COURT_OF_APPEAL_OVERVIEW_ROUTE}/${theCase.id}">`,
          linkEnd: '</a>',
        },
      )

      if (theCase.appealAssistant) {
        promises.push(
          this.sendEmail({
            subject,
            html: courtOfAppealsHtml,
            recipientName: theCase.appealAssistant.name,
            recipientEmail: theCase.appealAssistant.email,
          }),
        )
      }

      if (theCase.appealJudge1) {
        promises.push(
          this.sendEmail({
            subject,
            html: courtOfAppealsHtml,
            recipientName: theCase.appealJudge1.name,
            recipientEmail: theCase.appealJudge1.email,
          }),
        )
      }

      if (theCase.appealJudge2) {
        promises.push(
          this.sendEmail({
            subject,
            html: courtOfAppealsHtml,
            recipientName: theCase.appealJudge2.name,
            recipientEmail: theCase.appealJudge2.email,
          }),
        )
      }

      if (theCase.appealJudge3) {
        promises.push(
          this.sendEmail({
            subject,
            html: courtOfAppealsHtml,
            recipientName: theCase.appealJudge3.name,
            recipientEmail: theCase.appealJudge3.email,
          }),
        )
      }
    }

    if (isDefenceUser(user)) {
      const prosecutorHtml = this.formatMessage(
        notifications.caseAppealStatement.body,
        {
          userHasAccessToRVG: true,
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCaseNumber ?? 'NONE',
          linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: prosecutorHtml,
          recipientName: theCase.prosecutor?.name,
          recipientEmail: theCase.prosecutor?.email,
        }),
      )
    }

    if (isProsecutionUser(user)) {
      const url =
        theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id)
      const defenderHtml = this.formatMessage(
        notifications.caseAppealStatement.body,
        {
          userHasAccessToRVG: Boolean(url),
          court: applyDativeCaseToCourtName(
            theCase.court?.name || 'héraðsdómi',
          ),
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCaseNumber ?? 'NONE',
          linkStart: `<a href="${url}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: defenderHtml,
          recipientName: theCase.defenderName,
          recipientEmail: theCase.defenderEmail,

          skipTail: !theCase.defenderNationalId,
        }),
      )
    }

    if (promises.length === 0) {
      // Nothing to send
      return { delivered: true }
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.APPEAL_STATEMENT,
      recipients,
    )
  }
  //#endregion

  //#region APPEAL_CASE_FILES_UPDATED notifications
  private async sendAppealCaseFilesUpdatedNotifications(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    const courtOfAppealUsers = [
      theCase.appealJudge1,
      theCase.appealJudge2,
      theCase.appealJudge3,
      theCase.appealAssistant,
    ]

    const promises: Promise<Recipient>[] = []

    const subject = this.formatMessage(
      notifications.caseAppealCaseFilesUpdated.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCaseNumber ?? 'NONE',
      },
    )

    const courtOfAppealHtml = this.formatMessage(
      notifications.caseAppealCaseFilesUpdated.body,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCaseNumber ?? 'NONE',
        linkStart: `<a href="${this.config.clientUrl}${COURT_OF_APPEAL_OVERVIEW_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    courtOfAppealUsers.forEach((user) => {
      if (user) {
        promises.push(
          this.sendEmail({
            subject,
            html: courtOfAppealHtml,
            recipientName: user.name,
            recipientEmail: user.email,
          }),
        )
      }
    })

    if (isDefenceUser(user)) {
      const prosecutorHtml = this.formatMessage(
        notifications.caseAppealCaseFilesUpdated.body,
        {
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCaseNumber ?? 'NONE',
          linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: prosecutorHtml,
          recipientName: theCase.prosecutor?.name,
          recipientEmail: theCase.prosecutor?.email,
        }),
      )
    }

    if (promises.length === 0) {
      // Nothing to send
      return { delivered: true }
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.APPEAL_CASE_FILES_UPDATED,
      recipients,
    )
  }
  //#endregion

  //#region APPEAL_COMPLETED notifications
  private async sendAppealCompletedResultNotifications(
    theCase: Case,
  ): Promise<Recipient[]> {
    const isReopened = this.hasSentNotification(
      CaseNotificationType.APPEAL_COMPLETED,
      theCase.notifications,
    )
    const promises = []

    const subject = this.formatMessage(
      isReopened
        ? notifications.caseAppealResent.subject
        : notifications.caseAppealCompleted.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCaseNumber,
      },
    )

    const html = this.formatMessage(
      isReopened
        ? notifications.caseAppealResent.body
        : notifications.caseAppealCompleted.body,
      {
        userHasAccessToRVG: true,
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCaseNumber,
        appealRulingDecision: getAppealResultTextByValue(
          theCase.appealRulingDecision,
        ),
        linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    promises.push(
      this.sendEmail({
        subject,
        html,
        recipientName: theCase.judge?.name,
        recipientEmail: theCase.judge?.email,
      }),
      this.sendEmail({
        subject,
        html,
        recipientName: theCase.prosecutor?.name,
        recipientEmail: theCase.prosecutor?.email,
      }),
    )

    if (
      isRestrictionCase(theCase.type) &&
      theCase.state === CaseState.ACCEPTED
    ) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: this.formatMessage(
            notifications.emailNames.prisonAdmin,
          ),
          recipientEmail: this.config.email.prisonAdminEmail,
        }),
      )
    }

    if (
      theCase.decision === CaseDecision.ACCEPTING ||
      theCase.decision === CaseDecision.ACCEPTING_PARTIALLY
    ) {
      const shouldSendNotificationToPrison =
        await this.shouldSendNotificationToPrison(theCase)

      if (shouldSendNotificationToPrison) {
        promises.push(
          this.sendEmail({
            subject,
            html,
            recipientName: this.formatMessage(notifications.emailNames.prison),
            recipientEmail: this.config.email.prisonEmail,
          }),
        )
      }
    }

    if (theCase.defenderEmail) {
      const url =
        theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id)
      const defenderHtml = this.formatMessage(
        notifications.caseAppealCompleted.body,
        {
          userHasAccessToRVG: Boolean(url),
          court: applyDativeCaseToCourtName(
            theCase.court?.name || 'héraðsdómi',
          ),
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCaseNumber,
          appealRulingDecision: getAppealResultTextByValue(
            theCase.appealRulingDecision,
          ),
          linkStart: `<a href="${url}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: defenderHtml,
          recipientName: theCase.defenderName,
          recipientEmail: theCase.defenderEmail,
          skipTail: !theCase.defenderNationalId,
        }),
      )
    }

    return Promise.all(promises)
  }

  private async sendAppealDiscontinuedNotifications(
    theCase: Case,
  ): Promise<Recipient[]> {
    const promises = []

    const subject = this.formatMessage(
      notifications.caseAppealDiscontinued.subject,
      {
        appealCaseNumber: theCase.appealCaseNumber,
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )
    const html = this.formatMessage(notifications.caseAppealDiscontinued.body, {
      courtCaseNumber: theCase.courtCaseNumber,
      appealCaseNumber: theCase.appealCaseNumber,
    })

    promises.push(
      this.sendEmail({
        subject,
        html,
        recipientName: theCase.prosecutor?.name,
        recipientEmail: theCase.prosecutor?.email,
      }),
      this.sendEmail({
        subject,
        html,
        recipientName: theCase.defenderName,
        recipientEmail: theCase.defenderEmail,
        skipTail: !theCase.defenderNationalId,
      }),
    )

    return Promise.all(promises)
  }

  private async sendAppealCompletedNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    /**
     * If anyone has received the APPEAL_COMPLETED notification before,
     * we know that the case is being reopened.
     */

    let recipients: Recipient[] = []
    if (
      theCase.appealRulingDecision === CaseAppealRulingDecision.DISCONTINUED
    ) {
      recipients = await this.sendAppealDiscontinuedNotifications(theCase)
    } else {
      recipients = await this.sendAppealCompletedResultNotifications(theCase)
    }

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.APPEAL_COMPLETED,
      recipients,
    )
  }
  //#endregion

  //#region APPEAL_WITHDRAWN notifications
  private async sendAppealWithdrawnNotifications(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    const promises: Promise<Recipient>[] = []
    const wasWithdrawnByProsecution = isProsecutionUser(user)

    const subject = this.formatMessage(
      notifications.caseAppealWithdrawn.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )
    const html = this.formatMessage(notifications.caseAppealWithdrawn.body, {
      withdrawnByProsecution: wasWithdrawnByProsecution ?? false,
      courtCaseNumber: theCase.courtCaseNumber,
    })

    // This may result in a defender with no national id getting a link to RVG
    // TODO: Separate defenders from other recipients and handle no national id
    const sendTo = this.getWithdrawnNotificationRecipients(
      theCase,
      user,
      wasWithdrawnByProsecution,
    )

    sendTo.forEach((recipient) => {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: recipient.name,
          recipientEmail: recipient.email,
        }),
      )
    })

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      CaseNotificationType.APPEAL_WITHDRAWN,
      recipients,
    )
  }

  private getWithdrawnNotificationRecipients(
    theCase: Case,
    user: User,
    wasWithdrawnByProsecution: boolean,
  ): RecipientInfo[] {
    const hasBeenAssigned = this.hasSentNotification(
      CaseNotificationType.APPEAL_JUDGES_ASSIGNED,
      theCase.notifications,
    )

    const recipients = [
      {
        name: theCase.judge?.name,
        email: theCase.judge?.email,
      } as RecipientInfo,
    ]

    if (
      wasWithdrawnByProsecution &&
      theCase.defenderName &&
      theCase.defenderEmail
    ) {
      recipients.push({
        name: theCase.defenderName,
        email: theCase.defenderEmail,
      })
    } else if (isDefenceUser(user)) {
      recipients.push({
        name: theCase.prosecutor?.name,
        email: theCase.prosecutor?.email,
      })
    }

    recipients.push({
      name: theCase.court?.name,
      email: this.getCourtEmail(theCase.court?.id),
    })

    if (theCase.registrar) {
      recipients.push({
        name: theCase.registrar.name,
        email: theCase.registrar.email,
      })
    }

    if (theCase.appealReceivedByCourtDate) {
      recipients.push({
        name: this.formatMessage(notifications.emailNames.courtOfAppeals),
        email: this.getCourtEmail(this.config.courtOfAppealsId),
      })
    }

    if (hasBeenAssigned) {
      recipients.push(
        {
          name: theCase.appealAssistant?.name,
          email: theCase.appealAssistant?.email,
        },
        {
          name: theCase.appealJudge1?.name,
          email: theCase.appealJudge1?.email,
        },
        {
          name: theCase.appealJudge2?.name,
          email: theCase.appealJudge2?.email,
        },
        {
          name: theCase.appealJudge3?.name,
          email: theCase.appealJudge3?.email,
        },
      )
    }

    return recipients
  }
  //#endregion
  //#endregion

  //#region API
  private sendNotification(
    type: CaseNotificationType,
    theCase: Case,
    user: User,
    userDescriptor?: UserDescriptor,
  ): Promise<DeliverResponse> {
    switch (type) {
      case CaseNotificationType.HEADS_UP:
        return this.sendHeadsUpNotifications(theCase)
      case CaseNotificationType.READY_FOR_COURT:
        return this.sendReadyForCourtNotifications(theCase)
      case CaseNotificationType.RECEIVED_BY_COURT:
        return this.sendReceivedByCourtNotifications(theCase)
      case CaseNotificationType.COURT_DATE:
        return this.sendCourtDateNotifications(theCase, user ?? userDescriptor)
      case CaseNotificationType.DISTRICT_COURT_JUDGE_ASSIGNED:
        return this.sendDistrictCourtUserAssignedNotifications(
          theCase,
          UserRole.DISTRICT_COURT_JUDGE,
        )
      case CaseNotificationType.DISTRICT_COURT_REGISTRAR_ASSIGNED:
        return this.sendDistrictCourtUserAssignedNotifications(
          theCase,
          UserRole.DISTRICT_COURT_REGISTRAR,
        )
      case CaseNotificationType.RULING:
        return this.sendRulingNotifications(theCase)
      case CaseNotificationType.MODIFIED:
        return this.sendModifiedNotifications(theCase, user)
      case CaseNotificationType.REVOKED:
        return this.sendRevokedNotifications(theCase)
      case CaseNotificationType.ADVOCATE_ASSIGNED:
        return this.sendAdvocateAssignedNotifications(theCase)
      case CaseNotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT:
        return this.sendDefendantsNotUpdatedAtCourtNotifications(theCase)
      case CaseNotificationType.APPEAL_TO_COURT_OF_APPEALS:
        return this.sendAppealToCourtOfAppealsNotifications(theCase, user)
      case CaseNotificationType.APPEAL_RECEIVED_BY_COURT:
        return this.sendAppealReceivedByCourtNotifications(theCase)
      case CaseNotificationType.APPEAL_STATEMENT:
        return this.sendAppealStatementNotifications(theCase, user)
      case CaseNotificationType.APPEAL_COMPLETED:
        return this.sendAppealCompletedNotifications(theCase)
      case CaseNotificationType.APPEAL_JUDGES_ASSIGNED:
        return this.sendCourtOfAppealJudgeAssignedNotification(theCase)
      case CaseNotificationType.APPEAL_CASE_FILES_UPDATED:
        return this.sendAppealCaseFilesUpdatedNotifications(theCase, user)
      case CaseNotificationType.APPEAL_WITHDRAWN:
        return this.sendAppealWithdrawnNotifications(theCase, user)
      case CaseNotificationType.INDICTMENT_DENIED:
        return this.sendIndictmentDeniedNotifications(theCase)
      case CaseNotificationType.INDICTMENT_RETURNED:
        return this.sendIndictmentReturnedNotifications(theCase)
      case CaseNotificationType.CASE_FILES_UPDATED:
        return this.sendCaseFilesUpdatedNotifications(theCase, user)
      case CaseNotificationType.RULING_ORDER_ADDED:
        return this.sendRulingOrderAddedNotifications(theCase)
      case CaseNotificationType.PUBLIC_PROSECUTOR_REVIEWER_ASSIGNED:
        return this.sendPublicProsecutorReviewerAssignedNotifications(theCase)
      default:
        throw new InternalServerErrorException(
          `Invalid notification type ${type}`,
        )
    }
  }

  async sendCaseNotification(
    type: CaseNotificationType,
    theCase: Case,
    user: User,
    userDescriptor?: UserDescriptor,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    try {
      return await this.sendNotification(type, theCase, user, userDescriptor)
    } catch (error) {
      this.logger.error('Failed to send notification', error)

      return { delivered: false }
    }
  }
  //#endregion
}
