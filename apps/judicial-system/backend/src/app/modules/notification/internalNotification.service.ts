import { ICalendar } from 'datebook'
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
  SIGNED_VERDICT_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  formatDate,
  getAppealResultTextByValue,
  getHumanReadableCaseIndictmentRulingDecision,
  lowercase,
} from '@island.is/judicial-system/formatters'
import {
  AdvocateType,
  CaseAppealRulingDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseState,
  CaseType,
  getStatementDeadline,
  isDefenceUser,
  isIndictmentCase,
  isInvestigationCase,
  isProsecutionUser,
  isRequestCase,
  isRestrictionCase,
  NotificationType,
  RequestSharedWithDefender,
  SessionArrangements,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  formatAdvocateAssignedEmailNotification,
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
  formatDefenderRevokedEmailNotification,
  formatDefenderRoute,
  formatPostponedCourtDateEmailNotification,
  formatPrisonAdministrationRulingNotification,
  formatPrisonCourtDateEmailNotification,
  formatPrisonRevokedEmailNotification,
  formatProsecutorCourtDateEmailNotification,
  formatProsecutorReadyForCourtEmailNotification,
  formatProsecutorReceivedByCourtSmsNotification,
} from '../../formatters'
import { formatDefendantSelectedDefenderEmailNotification } from '../../formatters/formatters'
import { notifications } from '../../messages'
import { type Case, DateLog } from '../case'
import { CourtService } from '../court'
import { type Defendant, DefendantService } from '../defendant'
import { EventService } from '../event'
import { DeliverResponse } from './models/deliver.response'
import { Notification, Recipient } from './models/notification.model'
import { BaseNotificationService } from './baseNotification.service'
import { notificationModuleConfig } from './notification.config'

interface Attachment {
  filename: string
  content: string
  encoding?: string
}

interface RecipientInfo {
  name?: string
  email?: string
}

@Injectable()
export class InternalNotificationService extends BaseNotificationService {
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

  private hasSentNotification(
    type: NotificationType,
    notifications?: Notification[],
  ) {
    return notifications?.some((notification) => notification.type === type)
  }

  private hasReceivedNotification(
    type?: NotificationType | NotificationType[],
    address?: string,
    notifications?: Notification[],
  ) {
    const types = type ? [type].flat() : Object.values(NotificationType)

    return notifications?.some((notification) => {
      return (
        types.includes(notification.type) &&
        notification.recipients.some(
          (recipient) => recipient.address === address && recipient.success,
        )
      )
    })
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

  private createICalAttachment(theCase: Case): Attachment | undefined {
    const scheduledDate =
      DateLog.courtDate(theCase.dateLogs) ??
      DateLog.arraignmentDate(theCase.dateLogs)

    if (!scheduledDate?.date) {
      return
    }

    const eventOrganizer = {
      name: theCase.registrar
        ? theCase.registrar.name
        : theCase.judge
        ? theCase.judge.name
        : '',
      email: theCase.registrar
        ? theCase.registrar.email
        : theCase.judge
        ? theCase.judge.email
        : '',
    }

    const courtDateStart = new Date(scheduledDate.date.toString().split('.')[0])
    const courtDateEnd = new Date(scheduledDate.date.getTime() + 30 * 60000)

    const icalendar = new ICalendar({
      title: `Fyrirtaka í máli ${theCase.courtCaseNumber} - ${theCase.prosecutorsOffice?.name} gegn X`,
      location: `${theCase.court?.name} - ${
        scheduledDate.location
          ? `Dómsalur ${scheduledDate.location}`
          : 'Dómsalur hefur ekki verið skráður.'
      }`,
      start: courtDateStart,
      end: courtDateEnd,
    })

    return {
      filename: 'court-date.ics',
      content: icalendar
        .addProperty(
          `ORGANIZER;CN=${eventOrganizer.name}`,
          `MAILTO:${eventOrganizer.email}`,
        )
        .render(),
    }
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

    return this.recordNotification(theCase.id, NotificationType.HEADS_UP, [
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

  private sendResubmittedToCourtEmailNotificationToDefender(
    theCase: Case,
  ): Promise<Recipient> {
    const { body, subject } = formatDefenderResubmittedToCourtEmailNotification(
      this.formatMessage,
      theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id),
      theCase.court?.name,
      theCase.courtCaseNumber ?? theCase.policeCaseNumbers[0],
    )

    return this.sendEmail(
      subject,
      body,
      theCase.defenderName,
      theCase.defenderEmail,
      undefined,
      !theCase.defenderNationalId,
    )
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

    return this.sendEmail(subject, body, prosecutor?.name, prosecutor?.email)
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

    return this.sendEmail(
      subject,
      body,
      theCase.court?.name,
      this.getCourtEmail(theCase.courtId),
    )
  }

  private sendReadyForCourtEmailNotificationToDefender(
    theCase: Case,
  ): Promise<Recipient> {
    const { subject, body } = formatDefenderReadyForCourtEmailNotification(
      this.formatMessage,
      theCase.policeCaseNumbers[0],
      theCase.court?.name || 'Héraðsdómur',
      theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id),
    )

    return this.sendEmail(
      subject,
      body,
      theCase.defenderName,
      theCase.defenderEmail,
      undefined,
      !theCase.defenderNationalId,
    )
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
        NotificationType.READY_FOR_COURT,
        [recipient],
      )
    }

    // Investigation and Restriction Cases
    const promises: Promise<Recipient>[] = [
      this.sendReadyForCourtEmailNotificationToProsecutor(theCase),
    ]

    const courtHasBeenNotified = this.hasReceivedNotification(
      NotificationType.READY_FOR_COURT,
      this.getCourtMobileNumbers(theCase.courtId),
      theCase.notifications,
    )

    if (!courtHasBeenNotified) {
      promises.push(this.sendReadyForCourtSmsNotificationToCourt(theCase))
    } else if (theCase.state === CaseState.RECEIVED) {
      promises.push(this.sendResubmittedToCourtSmsNotificationToCourt(theCase))

      this.eventService.postEvent('RESUBMIT', theCase)
    }

    if (
      theCase.requestSharedWithDefender ===
        RequestSharedWithDefender.READY_FOR_COURT ||
      theCase.requestSharedWithDefender === RequestSharedWithDefender.COURT_DATE
    ) {
      const hasDefenderBeenNotified = this.hasReceivedNotification(
        [NotificationType.READY_FOR_COURT, NotificationType.COURT_DATE],
        theCase.defenderEmail,
        theCase.notifications,
      )

      if (hasDefenderBeenNotified) {
        promises.push(
          this.sendResubmittedToCourtEmailNotificationToDefender(theCase),
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

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      NotificationType.READY_FOR_COURT,
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
      NotificationType.RECEIVED_BY_COURT,
      [recipient],
    )
  }
  //#endregion

  //#region COURT_DATE notifications */
  private async uploadCourtDateInvitationEmailToCourt(
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
        `Failed to upload email to court for case ${theCase.id}`,
        { error },
      )
    }
  }

  private sendCourtDateEmailNotificationToProsecutor(
    theCase: Case,
    user: User,
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
      theCase.sessionArrangements === SessionArrangements.NONE_PRESENT
        ? undefined
        : this.createICalAttachment(theCase)

    return this.sendEmail(
      subject,
      body,
      theCase.prosecutor?.name,
      theCase.prosecutor?.email,
      calendarInvite ? [calendarInvite] : undefined,
    ).then((recipient) => {
      if (recipient.success) {
        // No need to wait
        this.uploadCourtDateInvitationEmailToCourt(
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

    return this.sendEmail(
      subject,
      html,
      this.formatMessage(notifications.emailNames.prison),
      this.config.email.prisonEmail,
    )
  }

  private sendCourtDateCalendarInviteEmailNotificationToDefender(
    theCase: Case,
    user: User,
  ): Promise<Recipient> {
    const arraignmentDate = DateLog.arraignmentDate(theCase.dateLogs)

    const subject = `Fyrirtaka í máli ${theCase.courtCaseNumber}`
    const calendarInvite = this.createICalAttachment(theCase)

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
    )

    return this.sendEmail(
      subject,
      html,
      theCase.defenderName,
      theCase.defenderEmail,
      calendarInvite ? [calendarInvite] : undefined,
      !theCase.defenderNationalId,
    ).then((recipient) => {
      if (recipient.success) {
        // No need to wait
        this.uploadCourtDateInvitationEmailToCourt(
          theCase,
          user,
          subject,
          html,
          theCase.defenderEmail,
        )
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

    const linkHtml = formatDefenderCourtDateLinkEmailNotification(
      this.formatMessage,
      theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id),
      theCase.court?.name,
      theCase.courtCaseNumber,
      theCase.requestSharedWithDefender ===
        RequestSharedWithDefender.READY_FOR_COURT ||
        theCase.requestSharedWithDefender ===
          RequestSharedWithDefender.COURT_DATE,
    )

    return this.sendEmail(
      linkSubject,
      linkHtml,
      theCase.defenderName,
      theCase.defenderEmail,
      undefined,
      !theCase.defenderNationalId,
    )
  }

  private async sendPostponedCourtDateEmailNotificationForIndictmentCase(
    theCase: Case,
    user: User,
    courtDate: DateLog,
    calendarInvite: Attachment | undefined,
    overviewUrl?: string,
    email?: string,
    name?: string,
  ): Promise<Recipient> {
    const { subject, body } = formatPostponedCourtDateEmailNotification(
      this.formatMessage,
      theCase,
      courtDate,
      overviewUrl,
    )

    return this.sendEmail(
      subject,
      body,
      email,
      name,
      calendarInvite && [calendarInvite],
      Boolean(overviewUrl) === false,
    ).then((recipient) => {
      if (recipient.success) {
        // No need to wait
        this.uploadCourtDateInvitationEmailToCourt(
          theCase,
          user,
          subject,
          body,
          email,
        )
      }

      return recipient
    })
  }

  private sendCourtDateEmailNotificationForIndictmentCase(
    theCase: Case,
    user: User,
  ): Promise<Recipient>[] {
    const courtDate = DateLog.courtDate(theCase.dateLogs)

    if (!courtDate) {
      return [this.sendCourtDateEmailNotificationToProsecutor(theCase, user)]
    }

    const calendarInvite = this.createICalAttachment(theCase)

    const promises = [
      this.sendPostponedCourtDateEmailNotificationForIndictmentCase(
        theCase,
        user,
        courtDate,
        calendarInvite,
        `${this.config.clientUrl}${INDICTMENTS_OVERVIEW_ROUTE}/${theCase.id}`,
        theCase.prosecutor?.name,
        theCase.prosecutor?.email,
      ),
    ]

    const uniqueDefendants = _uniqBy(
      theCase.defendants ?? [],
      (d: Defendant) => d.defenderEmail,
    )
    uniqueDefendants.forEach((defendant) => {
      if (defendant.defenderEmail) {
        promises.push(
          this.sendPostponedCourtDateEmailNotificationForIndictmentCase(
            theCase,
            user,
            courtDate,
            calendarInvite,
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

    return promises
  }

  private async sendCourtDateNotifications(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    this.eventService.postEvent('SCHEDULE_COURT_DATE', theCase)

    const promises: Promise<Recipient>[] = []

    if (isIndictmentCase(theCase.type)) {
      promises.push(
        ...this.sendCourtDateEmailNotificationForIndictmentCase(theCase, user),
      )
    } else {
      promises.push(
        this.sendCourtDateEmailNotificationToProsecutor(theCase, user),
      )

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
            this.sendCourtDateCalendarInviteEmailNotificationToDefender(
              theCase,
              user,
            ),
          )

          const hasDefenderBeenNotified = this.hasReceivedNotification(
            [NotificationType.READY_FOR_COURT],
            theCase.defenderEmail,
            theCase.notifications,
          )

          if (!hasDefenderBeenNotified) {
            promises.push(
              this.sendCourtDateEmailNotificationToDefender(theCase),
            )
          }
        }
      }

      const shouldSendNotificationToPrison =
        await this.shouldSendNotificationToPrison(theCase)

      if (
        shouldSendNotificationToPrison &&
        theCase.type !== CaseType.PAROLE_REVOCATION
      ) {
        promises.push(this.sendCourtDateEmailNotificationToPrison(theCase))
      }
    }

    const recipients = await Promise.all(promises)

    const result = await this.recordNotification(
      theCase.id,
      NotificationType.COURT_DATE,
      recipients,
    )

    return result
  }
  //#endregion

  //#region RULING notifications
  private sendRulingEmailNotificationToProsecutor(
    theCase: Case,
  ): Promise<Recipient> {
    return this.sendEmail(
      isIndictmentCase(theCase.type)
        ? this.formatMessage(notifications.caseCompleted.subject, {
            courtCaseNumber: theCase.courtCaseNumber,
          })
        : this.formatMessage(notifications.signedRuling.subject, {
            courtCaseNumber: theCase.courtCaseNumber,
            isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
          }),
      isIndictmentCase(theCase.type)
        ? this.formatMessage(notifications.caseCompleted.prosecutorBody, {
            courtCaseNumber: theCase.courtCaseNumber,
            courtName: theCase.court?.name?.replace('dómur', 'dómi'),
            caseIndictmentRulingDecision:
              getHumanReadableCaseIndictmentRulingDecision(
                theCase.indictmentRulingDecision,
              ),
            linkStart: `<a href="${this.config.clientUrl}${CLOSED_INDICTMENT_OVERVIEW_ROUTE}/${theCase.id}">`,
            linkEnd: '</a>',
          })
        : this.formatMessage(notifications.signedRuling.prosecutorBodyS3, {
            courtCaseNumber: theCase.courtCaseNumber,
            courtName: theCase.court?.name?.replace('dómur', 'dómi'),
            linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
            linkEnd: '</a>',
            isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
          }),
      theCase.prosecutor?.name,
      theCase.prosecutor?.email,
    )
  }

  private async sendRulingEmailNotificationToDefender(
    theCase: Case,
    defenderNationalId?: string,
    defenderName?: string,
    defenderEmail?: string,
  ) {
    return this.sendEmail(
      isIndictmentCase(theCase.type)
        ? this.formatMessage(notifications.caseCompleted.subject, {
            courtCaseNumber: theCase.courtCaseNumber,
          })
        : this.formatMessage(notifications.signedRuling.subject, {
            courtCaseNumber: theCase.courtCaseNumber,
            isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
          }),
      isIndictmentCase(theCase.type)
        ? this.formatMessage(notifications.caseCompleted.defenderBody, {
            courtCaseNumber: theCase.courtCaseNumber,
            courtName: theCase.court?.name?.replace('dómur', 'dómi'),
            caseIndictmentRulingDecision:
              getHumanReadableCaseIndictmentRulingDecision(
                theCase.indictmentRulingDecision,
              ),
            defenderHasAccessToRvg: Boolean(defenderNationalId),
            linkStart: `<a href="${formatDefenderRoute(
              this.config.clientUrl,
              theCase.type,
              theCase.id,
            )}">`,
            linkEnd: '</a>',
          })
        : this.formatMessage(notifications.signedRuling.defenderBody, {
            isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
            courtCaseNumber: theCase.courtCaseNumber,
            courtName: theCase.court?.name?.replace('dómur', 'dómi'),
            defenderHasAccessToRvg: Boolean(defenderNationalId),
            linkStart: `<a href="${formatDefenderRoute(
              this.config.clientUrl,
              theCase.type,
              theCase.id,
            )}">`,
            linkEnd: '</a>',
          }),
      defenderName ?? '',
      defenderEmail ?? '',
      undefined,
      Boolean(defenderNationalId) === false,
    )
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

    return this.sendEmail(
      subject,
      html,
      this.formatMessage(notifications.emailNames.prison),
      this.config.email.prisonEmail,
    )
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

    return this.sendEmail(
      subject,
      body,
      this.formatMessage(notifications.emailNames.prisonAdmin),
      this.config.email.prisonAdminEmail,
    )
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

    return this.sendEmail(
      subject,
      body,
      this.formatMessage(notifications.emailNames.prison),
      this.config.email.prisonEmail,
    )
  }

  private async sendRulingNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const promises = [this.sendRulingEmailNotificationToProsecutor(theCase)]

    if (isIndictmentCase(theCase.type)) {
      const uniqueDefendants = _uniqBy(
        theCase.defendants ?? [],
        (d: Defendant) => d.defenderEmail,
      )
      uniqueDefendants.forEach((defendant) => {
        if (defendant.defenderEmail) {
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

    if (
      (isRestrictionCase(theCase.type) ||
        theCase.type === CaseType.PAROLE_REVOCATION) &&
      theCase.state === CaseState.ACCEPTED
    ) {
      promises.push(
        this.sendRulingEmailNotificationToPrisonAdministration(theCase),
      )
    }

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
        NotificationType.COURT_DATE,
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
      NotificationType.RULING,
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
    return this.sendEmail(
      subject,
      theCase.isCustodyIsolation
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
      theCase.defenderName,
      theCase.defenderEmail,
      undefined,
      !theCase.defenderNationalId,
    )
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
      this.sendEmail(
        subject,
        html,
        this.formatMessage(notifications.emailNames.prisonAdmin),
        this.config.email.prisonAdminEmail,
      ),
    ]

    const shouldSendNotificationToPrison =
      await this.shouldSendNotificationToPrison(theCase)

    if (shouldSendNotificationToPrison) {
      promises.push(
        this.sendEmail(
          subject,
          html,
          this.formatMessage(notifications.emailNames.prison),
          this.config.email.prisonEmail,
        ),
      )
    }

    if (user.id !== theCase.prosecutorId) {
      promises.push(
        this.sendEmail(
          subject,
          html,
          theCase.prosecutor?.name,
          theCase.prosecutor?.email,
        ),
      )
    }

    if (user.id !== theCase.judgeId) {
      promises.push(
        this.sendEmail(
          subject,
          html,
          theCase.judge?.name,
          theCase.judge?.email,
        ),
      )
    }

    if (theCase.registrar && user.id !== theCase.registrarId) {
      promises.push(
        this.sendEmail(
          subject,
          html,
          theCase.registrar.name,
          theCase.registrar.email,
        ),
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
      NotificationType.MODIFIED,
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

    return this.sendEmail(
      subject,
      html,
      this.formatMessage(notifications.emailNames.prison),
      this.config.email.prisonEmail,
      undefined,
      true,
    )
  }

  private sendRevokedEmailNotificationToDefenderForRequestCase(
    caseType: CaseType,
    defendant: Defendant,
    defenderName?: string,
    defenderEmail?: string,
    arraignmentDate?: Date,
    courtName?: string,
  ): Promise<Recipient> {
    const subject = this.formatMessage(
      notifications.defenderRevokedEmail.subject,
      { caseType },
    )

    const html = formatDefenderRevokedEmailNotification(
      this.formatMessage,
      caseType,
      defendant.nationalId,
      defendant.name,
      defendant.noNationalId,
      courtName,
      arraignmentDate,
    )

    return this.sendEmail(
      subject,
      html,
      defenderName,
      defenderEmail,
      undefined,
      true,
    )
  }

  private sendRevokedEmailNotificationToDefenderForIndictmentCase(
    caseId: string,
    defenderNationalId?: string,
    defenderName?: string,
    defenderEmail?: string,
    courtName?: string,
    courtCaseNumber?: string,
  ): Promise<Recipient> {
    const subject = this.formatMessage(
      notifications.defenderRevokedEmail.indictmentSubject,
      { courtCaseNumber },
    )

    const html = this.formatMessage(
      notifications.defenderRevokedEmail.indictmentBody,
      {
        courtName: courtName?.replace('dómur', 'dómi'),
        defenderHasAccessToRvg: Boolean(defenderNationalId),
        linkStart: `<a href="${formatDefenderRoute(
          this.config.clientUrl,
          CaseType.INDICTMENT,
          caseId,
        )}">`,
        linkEnd: '</a>',
      },
    )

    return this.sendEmail(
      subject,
      html,
      defenderName,
      defenderEmail,
      undefined,
      !defenderNationalId,
    )
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
      const arraignmentDate = DateLog.arraignmentDate(theCase.dateLogs)?.date

      promises.push(
        this.sendRevokedEmailNotificationToDefenderForRequestCase(
          theCase.type,
          theCase.defendants[0],
          theCase.defenderName,
          theCase.defenderEmail,
          arraignmentDate,
          theCase.court?.name,
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
      NotificationType.REVOKED,
      recipients,
    )
  }

  private sendRevokedNotificationToCourt(
    theCase: Case,
    recipientName?: string,
    recipientEmail?: string,
  ): Promise<Recipient> {
    const subject = this.formatMessage(
      notifications.courtRevokedIndictmentEmail.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber ?? 'NONE',
      },
    )
    const body = this.formatMessage(
      notifications.courtRevokedIndictmentEmail.body,
      {
        prosecutorsOffice: theCase.creatingProsecutor?.institution?.name,
        courtCaseNumber: theCase.courtCaseNumber ?? 'NONE',
      },
    )

    return this.sendEmail(subject, body, recipientName, recipientEmail)
  }

  private async sendRevodeNotificationsForIndictmentCase(
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
          this.sendRevokedEmailNotificationToDefenderForIndictmentCase(
            theCase.id,
            defendant.defenderNationalId,
            defendant.defenderName,
            defendant.defenderEmail,
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
      NotificationType.REVOKED,
      recipients,
    )
  }

  private sendRevokedNotifications(theCase: Case): Promise<DeliverResponse> {
    if (isRequestCase(theCase.type)) {
      return this.sendRevokedNotificationsForRequestCase(theCase)
    } else {
      return this.sendRevodeNotificationsForIndictmentCase(theCase)
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
    if (isIndictmentCase(theCase.type)) {
      const hasSentNotificationBefore = this.hasReceivedNotification(
        NotificationType.ADVOCATE_ASSIGNED,
        advocateEmail,
        theCase.notifications,
      )

      if (hasSentNotificationBefore) {
        return false
      }
    } else if (isInvestigationCase(theCase.type)) {
      const isDefenderIncludedInSessionArrangements =
        theCase.sessionArrangements &&
        [
          SessionArrangements.ALL_PRESENT,
          SessionArrangements.ALL_PRESENT_SPOKESPERSON,
        ].includes(theCase.sessionArrangements)

      if (!isDefenderIncludedInSessionArrangements) return false
    } else {
      const hasDefenderBeenNotified = this.hasReceivedNotification(
        [
          NotificationType.READY_FOR_COURT,
          NotificationType.COURT_DATE,
          NotificationType.ADVOCATE_ASSIGNED,
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

  private sendAdvocateAssignedNotification(
    theCase: Case,
    advocateType: AdvocateType,
    advocateNationalId?: string,
    advocateName?: string,
    advocateEmail?: string,
  ): Promise<Recipient> {
    const { subject, body } = formatAdvocateAssignedEmailNotification(
      this.formatMessage,
      theCase,
      advocateType,
      advocateNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id),
    )

    return this.sendEmail(
      subject,
      body,
      advocateName,
      advocateEmail,
      undefined,
      Boolean(advocateNationalId) === false,
    )
  }

  private async sendAdvocateAssignedNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const promises: Promise<Recipient>[] = []

    if (isIndictmentCase(theCase.type)) {
      const uniqDefendants = _uniqBy(
        theCase.defendants ?? [],
        (d: Defendant) => d.defenderEmail,
      )

      for (const defendant of uniqDefendants) {
        const { defenderEmail, defenderNationalId, defenderName } = defendant

        const shouldSend = this.shouldSendAdvocateAssignedNotification(
          theCase,
          defenderEmail,
        )

        if (shouldSend === true) {
          promises.push(
            this.sendAdvocateAssignedNotification(
              theCase,
              AdvocateType.DEFENDER,
              defenderNationalId,
              defenderName,
              defenderEmail,
            ),
          )
        }
      }

      if (theCase.civilClaimants) {
        for (const civilClaimant of theCase.civilClaimants) {
          const {
            spokespersonEmail,
            spokespersonIsLawyer,
            spokespersonName,
            spokespersonNationalId,
            hasSpokesperson,
          } = civilClaimant

          const shouldSend =
            this.shouldSendAdvocateAssignedNotification(
              theCase,
              spokespersonEmail,
            ) && hasSpokesperson

          if (shouldSend === true) {
            promises.push(
              this.sendAdvocateAssignedNotification(
                theCase,
                spokespersonIsLawyer
                  ? AdvocateType.LAWYER
                  : AdvocateType.LEGAL_RIGHTS_PROTECTOR,
                spokespersonNationalId,
                spokespersonName,
                spokespersonEmail,
              ),
            )
          }
        }
      }
    } else if (DateLog.arraignmentDate(theCase.dateLogs)?.date) {
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
      NotificationType.ADVOCATE_ASSIGNED,
      recipients,
    )
  }

  private async sendDefendantSelectedDefenderNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const { subject, body } = formatDefendantSelectedDefenderEmailNotification(
      this.formatMessage,
      theCase,
      `${this.config.clientUrl}${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${theCase.id}`,
    )

    const promises: Promise<Recipient>[] = []
    const judgeName = theCase.judge?.name
    const judgeEmail = theCase.judge?.email
    const registrarName = theCase.registrar?.name
    const registrarEmail = theCase.registrar?.email

    if (judgeName && judgeEmail) {
      promises.push(
        this.sendEmail(subject, body, judgeName, judgeEmail, undefined, true),
      )
    }

    if (registrarName && registrarEmail) {
      promises.push(
        this.sendEmail(
          subject,
          body,
          registrarName,
          registrarEmail,
          undefined,
          true,
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
      NotificationType.DEFENDANT_SELECTED_DEFENDER,
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
        NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
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

    const recipient = await this.sendEmail(
      subject,
      html,
      theCase.registrar.name,
      theCase.registrar.email,
      undefined,
      true,
    )

    return this.recordNotification(
      theCase.id,
      NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
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

    const recipient = await this.sendEmail(
      subject,
      html,
      theCase.prosecutor?.name,
      theCase.prosecutor?.email,
    )

    return this.recordNotification(
      theCase.id,
      NotificationType.INDICTMENT_DENIED,
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

    const recipient = await this.sendEmail(
      subject,
      html,
      theCase.prosecutor?.name,
      theCase.prosecutor?.email,
    )

    return this.recordNotification(
      theCase.id,
      NotificationType.INDICTMENT_RETURNED,
      [recipient],
    )
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
          this.sendEmail(subject, body, recipient.name, recipient.email),
        )
      }
    })

    const recipients = await Promise.all(promises)

    if (recipients.length > 0) {
      return this.recordNotification(
        theCase.id,
        NotificationType.APPEAL_JUDGES_ASSIGNED,
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
      this.sendEmail(subject, html, theCase.judge?.name, theCase.judge?.email),
    ]

    const courtEmail = this.getCourtEmail(theCase.courtId)
    if (courtEmail) {
      promises.push(
        this.sendEmail(subject, html, theCase.court?.name, courtEmail),
      )
    }

    if (theCase.registrar) {
      promises.push(
        this.sendEmail(
          subject,
          html,
          theCase.registrar.name,
          theCase.registrar.email,
        ),
      )
    }

    if (user.role === UserRole.DEFENDER) {
      promises.push(
        this.sendEmail(
          subject,
          html,
          theCase.prosecutor?.name,
          theCase.prosecutor?.email,
        ),
      )
      promises.push(this.sendSms(smsText, theCase.prosecutor?.mobileNumber))
    }

    if (user.role === UserRole.PROSECUTOR && theCase.defenderEmail) {
      const url =
        theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id)
      const defenderHtml = this.formatMessage(
        notifications.caseAppealedToCourtOfAppeals.body,
        {
          userHasAccessToRVG: Boolean(url),
          court: theCase.court?.name.replace('dómur', 'dómi'),
          courtCaseNumber: theCase.courtCaseNumber,
          linkStart: `<a href="${url}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail(
          subject,
          defenderHtml,
          theCase.defenderName,
          theCase.defenderEmail,
          undefined,
          !theCase.defenderNationalId,
        ),
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
      NotificationType.APPEAL_TO_COURT_OF_APPEALS,
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

    const promises = [
      this.sendEmail(
        subject,
        html,
        this.formatMessage(notifications.emailNames.courtOfAppeals),
        this.getCourtEmail(this.config.courtOfAppealsId),
      ),
    ]

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
      this.sendEmail(
        subject,
        prosecutorHtml,
        theCase.prosecutor?.name,
        theCase.prosecutor?.email,
      ),
    )

    if (theCase.defenderEmail) {
      const url =
        theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id)
      const defenderHtml = this.formatMessage(
        notifications.caseAppealReceivedByCourt.body,
        {
          userHasAccessToRVG: Boolean(url),
          court: theCase.court?.name.replace('dómur', 'dómi'),
          courtCaseNumber: theCase.courtCaseNumber,
          statementDeadline: formatDate(statementDeadline, 'PPPp'),
          linkStart: `<a href="${url}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail(
          subject,
          defenderHtml,
          theCase.defenderName,
          theCase.defenderEmail,
          undefined,
          !theCase.defenderNationalId,
        ),
      )
    }

    promises.push(this.sendSms(smsText, theCase.prosecutor?.mobileNumber))

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      NotificationType.APPEAL_RECEIVED_BY_COURT,
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
          this.sendEmail(
            subject,
            courtOfAppealsHtml,
            theCase.appealAssistant.name,
            theCase.appealAssistant.email,
          ),
        )
      }

      if (theCase.appealJudge1) {
        promises.push(
          this.sendEmail(
            subject,
            courtOfAppealsHtml,
            theCase.appealJudge1.name,
            theCase.appealJudge1.email,
          ),
        )
      }

      if (theCase.appealJudge2) {
        promises.push(
          this.sendEmail(
            subject,
            courtOfAppealsHtml,
            theCase.appealJudge2.name,
            theCase.appealJudge2.email,
          ),
        )
      }

      if (theCase.appealJudge3) {
        promises.push(
          this.sendEmail(
            subject,
            courtOfAppealsHtml,
            theCase.appealJudge3.name,
            theCase.appealJudge3.email,
          ),
        )
      }
    }

    if (user.role === UserRole.DEFENDER) {
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
        this.sendEmail(
          subject,
          prosecutorHtml,
          theCase.prosecutor?.name,
          theCase.prosecutor?.email,
        ),
      )
    }

    if (user.role === UserRole.PROSECUTOR && theCase.defenderEmail) {
      const url =
        theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id)
      const defenderHtml = this.formatMessage(
        notifications.caseAppealStatement.body,
        {
          userHasAccessToRVG: Boolean(url),
          court: theCase.court?.name.replace('dómur', 'dómi'),
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCaseNumber ?? 'NONE',
          linkStart: `<a href="${url}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail(
          subject,
          defenderHtml,
          theCase.defenderName,
          theCase.defenderEmail,
          undefined,
          !theCase.defenderNationalId,
        ),
      )
    }

    if (promises.length === 0) {
      // Nothing to send
      return { delivered: true }
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      NotificationType.APPEAL_STATEMENT,
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
          this.sendEmail(subject, courtOfAppealHtml, user.name, user.email),
        )
      }
    })

    if (user.role === UserRole.DEFENDER) {
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
        this.sendEmail(
          subject,
          prosecutorHtml,
          theCase.prosecutor?.name,
          theCase.prosecutor?.email,
        ),
      )
    }

    if (promises.length === 0) {
      // Nothing to send
      return { delivered: true }
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      NotificationType.APPEAL_CASE_FILES_UPDATED,
      recipients,
    )
  }
  //#endregion

  //#region APPEAL_COMPLETED notifications
  private async sendAppealCompletedResultNotifications(
    theCase: Case,
  ): Promise<Recipient[]> {
    const isReopened = this.hasSentNotification(
      NotificationType.APPEAL_COMPLETED,
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
      this.sendEmail(subject, html, theCase.judge?.name, theCase.judge?.email),
      this.sendEmail(
        subject,
        html,
        theCase.prosecutor?.name,
        theCase.prosecutor?.email,
      ),
    )

    if (
      isRestrictionCase(theCase.type) &&
      theCase.state === CaseState.ACCEPTED
    ) {
      promises.push(
        this.sendEmail(
          subject,
          html,
          this.formatMessage(notifications.emailNames.prisonAdmin),
          this.config.email.prisonAdminEmail,
        ),
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
          this.sendEmail(
            subject,
            html,
            this.formatMessage(notifications.emailNames.prison),
            this.config.email.prisonEmail,
          ),
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
          court: theCase.court?.name.replace('dómur', 'dómi'),
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
        this.sendEmail(
          subject,
          defenderHtml,
          theCase.defenderName,
          theCase.defenderEmail,
          undefined,
          !theCase.defenderNationalId,
        ),
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
      this.sendEmail(
        subject,
        html,
        theCase.prosecutor?.name,
        theCase.prosecutor?.email,
      ),
      this.sendEmail(
        subject,
        html,
        theCase.defenderName,
        theCase.defenderEmail,
        undefined,
        !theCase.defenderNationalId,
      ),
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
      NotificationType.APPEAL_COMPLETED,
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
        this.sendEmail(subject, html, recipient.name, recipient.email),
      )
    })

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      NotificationType.APPEAL_WITHDRAWN,
      recipients,
    )
  }

  private getWithdrawnNotificationRecipients(
    theCase: Case,
    user: User,
    wasWithdrawnByProsecution: boolean,
  ): RecipientInfo[] {
    const hasBeenAssigned = this.hasSentNotification(
      NotificationType.APPEAL_JUDGES_ASSIGNED,
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
  async sendCaseNotification(
    type: NotificationType,
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    try {
      switch (type) {
        case NotificationType.HEADS_UP:
          return this.sendHeadsUpNotifications(theCase)
        case NotificationType.READY_FOR_COURT:
          return this.sendReadyForCourtNotifications(theCase)
        case NotificationType.RECEIVED_BY_COURT:
          return this.sendReceivedByCourtNotifications(theCase)
        case NotificationType.COURT_DATE:
          return this.sendCourtDateNotifications(theCase, user)
        case NotificationType.RULING:
          return this.sendRulingNotifications(theCase)
        case NotificationType.MODIFIED:
          return this.sendModifiedNotifications(theCase, user)
        case NotificationType.REVOKED:
          return this.sendRevokedNotifications(theCase)
        case NotificationType.ADVOCATE_ASSIGNED:
          return this.sendAdvocateAssignedNotifications(theCase)
        case NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT:
          return this.sendDefendantsNotUpdatedAtCourtNotifications(theCase)
        case NotificationType.APPEAL_TO_COURT_OF_APPEALS:
          return this.sendAppealToCourtOfAppealsNotifications(theCase, user)
        case NotificationType.APPEAL_RECEIVED_BY_COURT:
          return this.sendAppealReceivedByCourtNotifications(theCase)
        case NotificationType.APPEAL_STATEMENT:
          return this.sendAppealStatementNotifications(theCase, user)
        case NotificationType.APPEAL_COMPLETED:
          return this.sendAppealCompletedNotifications(theCase)
        case NotificationType.APPEAL_JUDGES_ASSIGNED:
          return this.sendCourtOfAppealJudgeAssignedNotification(theCase)
        case NotificationType.APPEAL_CASE_FILES_UPDATED:
          return this.sendAppealCaseFilesUpdatedNotifications(theCase, user)
        case NotificationType.APPEAL_WITHDRAWN:
          return this.sendAppealWithdrawnNotifications(theCase, user)
        case NotificationType.INDICTMENT_DENIED:
          return this.sendIndictmentDeniedNotifications(theCase)
        case NotificationType.INDICTMENT_RETURNED:
          return this.sendIndictmentReturnedNotifications(theCase)
        case NotificationType.DEFENDANT_SELECTED_DEFENDER:
          return this.sendDefendantSelectedDefenderNotifications(theCase)
        default:
          throw new InternalServerErrorException(
            `Invalid notification type ${type}`,
          )
      }
    } catch (error) {
      this.logger.error('Failed to send notification', error)

      return { delivered: false }
    }
    //#endregion
  }
}
