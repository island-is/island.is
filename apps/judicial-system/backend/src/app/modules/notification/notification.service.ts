import { ICalendar } from 'datebook'
import _uniqBy from 'lodash/uniqBy'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { EmailService } from '@island.is/email-service'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'
import { SmsService } from '@island.is/nova-sms'

import {
  CLOSED_INDICTMENT_OVERVIEW_ROUTE,
  COURT_OF_APPEAL_OVERVIEW_ROUTE,
  INDICTMENTS_COURT_OVERVIEW_ROUTE,
  INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE,
  RESTRICTION_CASE_OVERVIEW_ROUTE,
  SIGNED_VERDICT_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseMessage,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'
import type { User } from '@island.is/judicial-system/types'
import {
  CaseCustodyRestrictions,
  CaseDecision,
  CaseState,
  CaseType,
  getStatementDeadline,
  isIndictmentCase,
  isInvestigationCase,
  isRestrictionCase,
  NotificationType,
  Recipient,
  RequestSharedWithDefender,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  formatCourtHeadsUpSmsNotification,
  formatCourtIndictmentReadyForCourtEmailNotification,
  formatCourtReadyForCourtSmsNotification,
  formatCourtResubmittedToCourtSmsNotification,
  formatCourtRevokedSmsNotification,
  formatDefenderAssignedEmailNotification,
  formatDefenderCourtDateEmailNotification,
  formatDefenderCourtDateLinkEmailNotification,
  formatDefenderReadyForCourtEmailNotification,
  formatDefenderResubmittedToCourtEmailNotification,
  formatDefenderRevokedEmailNotification,
  formatDefenderRoute,
  formatPrisonAdministrationRulingNotification,
  formatPrisonCourtDateEmailNotification,
  formatPrisonRevokedEmailNotification,
  formatProsecutorCourtDateEmailNotification,
  formatProsecutorReadyForCourtEmailNotification,
  formatProsecutorReceivedByCourtSmsNotification,
  stripHtmlTags,
} from '../../formatters'
import { notifications } from '../../messages'
import { Case } from '../case'
import { CourtService } from '../court'
import { Defendant, DefendantService } from '../defendant'
import { CaseEvent, EventService } from '../event'
import { SendNotificationDto } from './dto/sendNotification.dto'
import { Notification } from './models/notification.model'
import { SendNotificationResponse } from './models/sendNotification.response'
import { notificationModuleConfig } from './notification.config'

interface Attachment {
  filename: string
  content: string
  encoding?: string
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    @Inject(notificationModuleConfig.KEY)
    private readonly config: ConfigType<typeof notificationModuleConfig>,
    private readonly courtService: CourtService,
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
    private readonly eventService: EventService,
    private readonly intlService: IntlService,
    private readonly defendantService: DefendantService,
    private readonly messageService: MessageService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private formatMessage: FormatMessage = () => {
    throw new InternalServerErrorException('Format message not initialized')
  }

  private async refreshFormatMessage(): Promise<void> {
    return this.intlService
      .useIntl(['judicial.system.backend'], 'is')
      .then((res) => {
        this.formatMessage = res.formatMessage
      })
      .catch((reason) => {
        this.logger.error('Unable to refresh format messages', { reason })
      })
  }

  private async hasReceivedNotification(
    caseId: string,
    type: NotificationType | NotificationType[],
    address?: string,
  ) {
    const previousNotifications = await this.notificationModel.findAll({
      where: { caseId, type },
    })

    return previousNotifications.some((notification) => {
      return notification.recipients.some(
        (recipient) => recipient.address === address && recipient.success,
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

  private async sendEmail(
    subject: string,
    html: string,
    recipientName?: string,
    recipientEmail?: string,
    attachments?: Attachment[],
  ): Promise<Recipient> {
    try {
      // This is to handle a comma separated list of emails
      // We use the first one as the main recipient and the rest as CC
      const recipients = recipientEmail ? recipientEmail.split(',') : undefined

      await this.emailService.sendEmail({
        from: {
          name: this.config.email.fromName,
          address: this.config.email.fromEmail,
        },
        replyTo: {
          name: this.config.email.replyToName,
          address: this.config.email.replyToEmail,
        },
        to: [
          {
            name: recipientName ?? '',
            address: recipients ? recipients[0] : '',
          },
        ],
        cc:
          recipients && recipients.length > 1 ? recipients.slice(1) : undefined,
        subject: subject,
        text: stripHtmlTags(html),
        html: html,
        attachments: attachments,
      })
    } catch (error) {
      this.logger.error('Failed to send email', { error })

      this.eventService.postErrorEvent(
        'Failed to send email',
        {
          subject,
          to: `${recipientName} (${recipientEmail})`,
          attachments:
            attachments && attachments.length > 0
              ? attachments.reduce(
                  (acc, attachment, index) =>
                    index > 0
                      ? `${acc}, ${attachment.filename}`
                      : `${attachment.filename}`,
                  '',
                )
              : undefined,
        },
        error as Error,
      )

      return {
        address: recipientEmail,
        success: false,
      }
    }

    return {
      address: recipientEmail,
      success: true,
    }
  }

  private async recordNotification(
    caseId: string,
    type: NotificationType,
    recipients: Recipient[],
  ): Promise<SendNotificationResponse> {
    await this.notificationModel.create({
      caseId,
      type,
      recipients: recipients,
    })

    return {
      notificationSent: recipients.reduce(
        (sent, recipient) => sent || recipient.success,
        false as boolean,
      ),
    }
  }

  private createICalAttachment(theCase: Case): Attachment | undefined {
    if (theCase.courtDate) {
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

      const courtDate = new Date(theCase.courtDate.toString().split('.')[0])
      const courtEnd = new Date(theCase.courtDate.getTime() + 30 * 60000)

      const icalendar = new ICalendar({
        title: `Fyrirtaka í máli ${theCase.courtCaseNumber} - ${theCase.creatingProsecutor?.institution?.name} gegn X`,
        location: `${theCase.court?.name} - ${
          theCase.courtRoom
            ? `Dómsalur ${theCase.courtRoom}`
            : 'Dómsalur hefur ekki verið skráður.'
        }`,
        start: courtDate,
        end: courtEnd,
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
  }

  /* HEADS_UP notifications */

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
  ): Promise<SendNotificationResponse> {
    const recipient = await this.sendHeadsUpSmsNotificationToCourt(theCase)

    return this.recordNotification(theCase.id, NotificationType.HEADS_UP, [
      recipient,
    ])
  }

  /* READY_FOR_COURT notifications */

  private sendReadyForCourtSmsNotificationToCourt(
    theCase: Case,
  ): Promise<Recipient> {
    const smsText = formatCourtReadyForCourtSmsNotification(
      this.formatMessage,
      theCase.type,
      theCase.prosecutor?.name,
      theCase.prosecutor?.institution?.name,
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
      theCase.courtCaseNumber,
    )

    return this.sendEmail(
      subject,
      body,
      theCase.defenderName,
      theCase.defenderEmail,
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
    )
  }

  private async sendReadyForCourtNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
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

    const courtHasBeenNotified = await this.hasReceivedNotification(
      theCase.id,
      NotificationType.READY_FOR_COURT,
      this.getCourtMobileNumbers(theCase.courtId),
    )

    if (!courtHasBeenNotified) {
      promises.push(this.sendReadyForCourtSmsNotificationToCourt(theCase))
    } else if (theCase.state === CaseState.RECEIVED) {
      promises.push(this.sendResubmittedToCourtSmsNotificationToCourt(theCase))

      this.eventService.postEvent(CaseEvent.RESUBMIT, theCase)
    }

    if (theCase.requestSharedWithDefender) {
      const hasDefenderBeenNotified = await this.hasReceivedNotification(
        theCase.id,
        [NotificationType.READY_FOR_COURT, NotificationType.COURT_DATE],
        theCase.defenderEmail,
      )

      if (
        theCase.defenderName &&
        theCase.defenderEmail &&
        hasDefenderBeenNotified
      ) {
        promises.push(
          this.sendResubmittedToCourtEmailNotificationToDefender(theCase),
        )
      } else if (
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

  /* RECEIVED_BY_COURT notifications */

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
  ): Promise<SendNotificationResponse> {
    const recipient = await this.sendReceivedByCourtSmsNotificationToProsecutor(
      theCase,
    )

    return this.recordNotification(
      theCase.id,
      NotificationType.RECEIVED_BY_COURT,
      [recipient],
    )
  }

  /* COURT_DATE notifications */

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
      // Tolerate failure, but log error
      this.logger.error(
        `Failed to upload email to court for case ${theCase.id}`,
        { error },
      )
    }
  }

  private async sendCourtDateEmailNotificationToProsecutor(
    theCase: Case,
    user: User,
  ): Promise<Recipient> {
    const { subject, body } = formatProsecutorCourtDateEmailNotification(
      this.formatMessage,
      theCase.type,
      theCase.courtCaseNumber,
      theCase.court?.name,
      theCase.courtDate,
      theCase.courtRoom,
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

  private async sendCourtDateEmailNotificationToPrison(
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
      theCase.creatingProsecutor?.institution?.name,
      theCase.court?.name,
      theCase.courtDate,
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
    const subject = `Fyrirtaka í máli ${theCase.courtCaseNumber}`
    const calendarInvite = this.createICalAttachment(theCase)

    const html = formatDefenderCourtDateEmailNotification(
      this.formatMessage,
      theCase.court?.name,
      theCase.courtCaseNumber,
      theCase.courtDate,
      theCase.courtRoom,
      theCase.judge?.name,
      theCase.registrar?.name,
      theCase.prosecutor?.name,
      theCase.creatingProsecutor?.institution?.name,
      theCase.sessionArrangements,
    )

    return this.sendEmail(
      subject,
      html,
      theCase.defenderName,
      theCase.defenderEmail,
      calendarInvite ? [calendarInvite] : undefined,
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
      theCase.requestSharedWithDefender ? 'Gögn í máli' : 'Yfirlit máls'
    } ${theCase.courtCaseNumber}`

    const linkHtml = formatDefenderCourtDateLinkEmailNotification(
      this.formatMessage,
      theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id),
      theCase.court?.name,
      theCase.courtCaseNumber,
      Boolean(theCase.requestSharedWithDefender),
    )

    return this.sendEmail(
      linkSubject,
      linkHtml,
      theCase.defenderName,
      theCase.defenderEmail,
    )
  }

  private async sendCourtDateNotifications(
    theCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    this.eventService.postEvent(CaseEvent.SCHEDULE_COURT_DATE, theCase)

    const promises: Promise<Recipient>[] = [
      this.sendCourtDateEmailNotificationToProsecutor(theCase, user),
    ]

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

        const hasDefenderBeenNotified = await this.hasReceivedNotification(
          theCase.id,
          [NotificationType.READY_FOR_COURT],
          theCase.defenderEmail,
        )

        if (!hasDefenderBeenNotified) {
          promises.push(this.sendCourtDateEmailNotificationToDefender(theCase))
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

    const recipients = await Promise.all(promises)

    const result = await this.recordNotification(
      theCase.id,
      NotificationType.COURT_DATE,
      recipients,
    )

    return result
  }

  /* RULING notifications */

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
  ): Promise<SendNotificationResponse> {
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
      const prisonHasBeenNotified = await this.hasReceivedNotification(
        theCase.id,
        NotificationType.COURT_DATE,
        this.config.email.prisonEmail,
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

  /* MODIFIED notifications */

  private async sendModifiedNotifications(
    theCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    const subject = this.formatMessage(notifications.modified.subject, {
      courtCaseNumber: theCase.courtCaseNumber,
      caseType: theCase.type,
    })
    const html = theCase.isCustodyIsolation
      ? this.formatMessage(notifications.modified.isolationHtml, {
          caseType: theCase.type,
          actorInstitution: user.institution?.name,
          actorName: user.name,
          actorTitle: user.title,
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
          actorTitle: user.title,
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

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      NotificationType.MODIFIED,
      recipients,
    )
  }

  /* REVOKED notifications */

  private async existsRevokableNotification(
    caseId: string,
    address?: string,
    isIndictment?: boolean,
  ): Promise<boolean> {
    return this.hasReceivedNotification(
      caseId,
      isIndictment
        ? [NotificationType.DEFENDER_ASSIGNED]
        : [
            NotificationType.HEADS_UP,
            NotificationType.READY_FOR_COURT,
            NotificationType.COURT_DATE,
          ],
      address,
    )
  }

  private sendRevokedSmsNotificationToCourt(theCase: Case): Promise<Recipient> {
    const smsText = formatCourtRevokedSmsNotification(
      this.formatMessage,
      theCase.type,
      theCase.prosecutor?.name,
      theCase.requestedCourtDate,
      theCase.courtDate,
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
      theCase.creatingProsecutor?.institution?.name,
      theCase.court?.name,
      theCase.courtDate,
      theCase.defenderName,
      Boolean(theCase.parentCase),
      theCase.courtCaseNumber,
    )

    return this.sendEmail(
      subject,
      html,
      this.formatMessage(notifications.emailNames.prison),
      this.config.email.prisonEmail,
    )
  }

  private sendRevokedEmailNotificationToDefender(
    caseType: CaseType,
    defendant: Defendant,
    defenderName?: string,
    defenderEmail?: string,
    courtDate?: Date,
    courtName?: string,
  ): Promise<Recipient> {
    const subject = isIndictmentCase(caseType)
      ? this.formatMessage(notifications.defenderRevokedEmail.indictmentSubject)
      : this.formatMessage(notifications.defenderRevokedEmail.subject, {
          caseType,
        })

    const html = formatDefenderRevokedEmailNotification(
      this.formatMessage,
      caseType,
      defendant.nationalId,
      defendant.name,
      defendant.noNationalId,
      courtName,
      courtDate,
    )

    return this.sendEmail(subject, html, defenderName, defenderEmail)
  }

  private async sendRevokedNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    const promises: Promise<Recipient>[] = []

    const courtWasNotified =
      !isIndictmentCase(theCase.type) &&
      (await this.existsRevokableNotification(
        theCase.id,
        this.getCourtMobileNumbers(theCase.courtId),
      ))

    if (courtWasNotified) {
      promises.push(this.sendRevokedSmsNotificationToCourt(theCase))
    }

    const prisonWasNotified =
      (theCase.type === CaseType.CUSTODY ||
        theCase.type === CaseType.ADMISSION_TO_FACILITY) &&
      (await this.existsRevokableNotification(
        theCase.id,
        this.config.email.prisonEmail,
      ))

    if (prisonWasNotified) {
      promises.push(this.sendRevokedEmailNotificationToPrison(theCase))
    }

    if (isIndictmentCase(theCase.type)) {
      for (const defendant of theCase.defendants ?? []) {
        const defenderWasNotified = await this.existsRevokableNotification(
          theCase.id,
          defendant.defenderEmail,
          isIndictmentCase(theCase.type),
        )

        if (defenderWasNotified) {
          promises.push(
            this.sendRevokedEmailNotificationToDefender(
              theCase.type,
              defendant,
              defendant.defenderName,
              defendant.defenderEmail,
              theCase.courtDate,
              theCase.court?.name,
            ),
          )
        }
      }
    } else {
      const defenderWasNotified = await this.existsRevokableNotification(
        theCase.id,
        theCase.defenderEmail,
        isIndictmentCase(theCase.type),
      )
      if (defenderWasNotified && theCase.defendants) {
        promises.push(
          this.sendRevokedEmailNotificationToDefender(
            theCase.type,
            theCase.defendants[0],
            theCase.defenderName,
            theCase.defenderEmail,
            theCase.courtDate,
            theCase.court?.name,
          ),
        )
      }
    }

    const recipients = await Promise.all(promises)

    if (recipients.length === 0) {
      // Nothing to send
      return { notificationSent: true }
    }

    return this.recordNotification(
      theCase.id,
      NotificationType.REVOKED,
      recipients,
    )
  }

  /* DEFENDER_ASSIGNED notifications */

  private async shouldSendDefenderAssignedNotification(
    theCase: Case,
    defenderEmail?: string,
  ): Promise<boolean> {
    if (!defenderEmail) {
      return false
    }
    if (isIndictmentCase(theCase.type)) {
      const hasSentNotificationBefore = await this.hasReceivedNotification(
        theCase.id,
        NotificationType.DEFENDER_ASSIGNED,
        defenderEmail,
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
      const hasDefenderBeenNotified = await this.hasReceivedNotification(
        theCase.id,
        [
          NotificationType.READY_FOR_COURT,
          NotificationType.COURT_DATE,
          NotificationType.DEFENDER_ASSIGNED,
        ],
        theCase.defenderEmail,
      )
      if (hasDefenderBeenNotified) {
        return false
      }
    }

    return true
  }

  private sendDefenderAssignedNotification(
    theCase: Case,
    defenderNationalId?: string,
    defenderName?: string,
    defenderEmail?: string,
  ): Promise<Recipient> {
    const { subject, body } = formatDefenderAssignedEmailNotification(
      this.formatMessage,
      theCase,
      defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id),
    )

    return this.sendEmail(subject, body, defenderName, defenderEmail)
  }

  private async sendDefenderAssignedNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    const promises: Promise<Recipient>[] = []

    if (isIndictmentCase(theCase.type)) {
      const uniqDefendants = _uniqBy(
        theCase.defendants ?? [],
        (d: Defendant) => d.defenderEmail,
      )
      for (const defendant of uniqDefendants) {
        const { defenderEmail, defenderNationalId, defenderName } = defendant

        const shouldSend = await this.shouldSendDefenderAssignedNotification(
          theCase,
          defenderEmail,
        )

        if (shouldSend === true) {
          promises.push(
            this.sendDefenderAssignedNotification(
              theCase,
              defenderNationalId,
              defenderName,
              defenderEmail,
            ),
          )
        }
      }
    } else if (theCase.courtDate) {
      const shouldSend = await this.shouldSendDefenderAssignedNotification(
        theCase,
        theCase.defenderEmail,
      )

      if (shouldSend) {
        const recipient = await this.sendCourtDateEmailNotificationToDefender(
          theCase,
        )

        return this.recordNotification(
          theCase.id,
          NotificationType.DEFENDER_ASSIGNED,
          [recipient],
        )
      }
    }

    const recipients = await Promise.all(promises)

    if (recipients.length === 0) {
      // Nothing to send
      return { notificationSent: true }
    }

    return this.recordNotification(
      theCase.id,
      NotificationType.DEFENDER_ASSIGNED,
      recipients,
    )
  }

  /* DEFENDANTS_NOT_UPDATED_AT_COURT notifications */

  private async sendDefendantsNotUpdatedAtCourtNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    if (
      !theCase.registrar ||
      (await this.hasReceivedNotification(
        theCase.id,
        NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
        theCase.registrar?.email,
      ))
    ) {
      // Nothing to send
      return { notificationSent: true }
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
    )

    return this.recordNotification(
      theCase.id,
      NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
      [recipient],
    )
  }

  /* Appeals notifications */

  private async sendAppealToCourtOfAppealsNotifications(
    theCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
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
        ),
      )
    }

    const smsText = this.formatMessage(
      notifications.caseAppealedToCourtOfAppeals.text,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )

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

  private async sendAppealReceivedByCourtNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
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
        linkStart: `<a href="${this.config.clientUrl}${COURT_OF_APPEAL_OVERVIEW_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
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

    const statementDeadline =
      theCase.appealReceivedByCourtDate &&
      getStatementDeadline(theCase.appealReceivedByCourtDate)

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
        ),
      )
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      NotificationType.APPEAL_RECEIVED_BY_COURT,
      recipients,
    )
  }

  private async sendAppealStatementNotifications(
    theCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
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
        ),
      )
    }

    if (promises.length === 0) {
      // Nothing to send
      return { notificationSent: true }
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      NotificationType.APPEAL_STATEMENT,
      recipients,
    )
  }

  private async sendAppealCompletedNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    const subject = this.formatMessage(
      notifications.caseAppealCompleted.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCaseNumber,
      },
    )

    const html = this.formatMessage(notifications.caseAppealCompleted.body, {
      userHasAccessToRVG: true,
      courtCaseNumber: theCase.courtCaseNumber,
      appealCaseNumber: theCase.appealCaseNumber,
      linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
      linkEnd: '</a>',
    })

    const promises = [
      this.sendEmail(subject, html, theCase.judge?.name, theCase.judge?.email),
      this.sendEmail(
        subject,
        html,
        theCase.prosecutor?.name,
        theCase.prosecutor?.email,
      ),
    ]

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
        ),
      )
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      NotificationType.APPEAL_COMPLETED,
      recipients,
    )
  }

  /* Messages */

  private getNotificationMessage(
    type: MessageType,
    user: User,
    theCase: Case,
  ): CaseMessage {
    return { type, user, caseId: theCase.id }
  }

  private getReadyForCourtNotificationMessages(
    user: User,
    theCase: Case,
  ): CaseMessage[] {
    const messages = [
      this.getNotificationMessage(
        MessageType.SEND_READY_FOR_COURT_NOTIFICATION,
        user,
        theCase,
      ),
    ]

    if (theCase.state === CaseState.RECEIVED) {
      messages.push(
        this.getNotificationMessage(
          MessageType.DELIVER_REQUEST_TO_COURT,
          user,
          theCase,
        ),
      )
    }

    return messages
  }

  /* API */

  async getAllCaseNotifications(theCase: Case): Promise<Notification[]> {
    return this.notificationModel.findAll({
      where: { caseId: theCase.id },
      order: [['created', 'DESC']],
    })
  }

  async sendCaseNotification(
    type: NotificationType,
    theCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    await this.refreshFormatMessage()

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
      case NotificationType.DEFENDER_ASSIGNED:
        return this.sendDefenderAssignedNotifications(theCase)
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
    }
  }

  async addMessagesForNotificationToQueue(
    notification: SendNotificationDto,
    theCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    let messages: CaseMessage[]

    try {
      switch (notification.type) {
        case NotificationType.HEADS_UP:
          messages = [
            this.getNotificationMessage(
              MessageType.SEND_HEADS_UP_NOTIFICATION,
              user,
              theCase,
            ),
          ]
          break
        case NotificationType.READY_FOR_COURT:
          messages = this.getReadyForCourtNotificationMessages(user, theCase)
          break
        case NotificationType.RECEIVED_BY_COURT:
          messages = [
            this.getNotificationMessage(
              MessageType.SEND_RECEIVED_BY_COURT_NOTIFICATION,
              user,
              theCase,
            ),
          ]
          break
        case NotificationType.COURT_DATE:
          if (notification.eventOnly) {
            this.eventService.postEvent(
              CaseEvent.SCHEDULE_COURT_DATE,
              theCase,
              true,
            )
            // We still want to send the defender a link to the case even if
            // the judge chooses not to send a calendar invitation
            messages = [
              this.getNotificationMessage(
                MessageType.SEND_DEFENDER_ASSIGNED_NOTIFICATION,
                user,
                theCase,
              ),
            ]
          } else {
            messages = [
              this.getNotificationMessage(
                MessageType.SEND_COURT_DATE_NOTIFICATION,
                user,
                theCase,
              ),
            ]
          }
          break
        case NotificationType.REVOKED:
          messages = [
            this.getNotificationMessage(
              MessageType.SEND_REVOKED_NOTIFICATION,
              user,
              theCase,
            ),
          ]
          break
        case NotificationType.DEFENDER_ASSIGNED:
          messages = [
            this.getNotificationMessage(
              MessageType.SEND_DEFENDER_ASSIGNED_NOTIFICATION,
              user,
              theCase,
            ),
          ]
          break

        default:
          throw new InternalServerErrorException(
            `Invalid notification type ${notification.type}`,
          )
      }

      await this.messageService.sendMessagesToQueue(messages)

      return { notificationSent: true }
    } catch (error) {
      return { notificationSent: false }
    }
  }
}
