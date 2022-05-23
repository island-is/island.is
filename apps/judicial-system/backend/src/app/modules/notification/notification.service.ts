import format from 'date-fns/format'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { ICalendar } from 'datebook'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { SmsService } from '@island.is/nova-sms'
import { EmailService } from '@island.is/email-service'
import {
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
  NotificationType,
  isRestrictionCase,
  isInvestigationCase,
  SessionArrangements,
  User,
} from '@island.is/judicial-system/types'
import { formatDate } from '@island.is/judicial-system/formatters'

import { environment } from '../../../environments'
import { nowFactory } from '../../factories'
import {
  formatProsecutorCourtDateEmailNotification,
  formatCourtHeadsUpSmsNotification,
  formatPrisonCourtDateEmailNotification,
  formatCourtReadyForCourtSmsNotification,
  formatDefenderCourtDateEmailNotification,
  stripHtmlTags,
  formatPrisonRulingEmailNotification,
  formatCourtRevokedSmsNotification,
  formatPrisonRevokedEmailNotification,
  formatDefenderRevokedEmailNotification,
  getRequestPdfAsBuffer,
  getCustodyNoticePdfAsString,
  formatProsecutorReceivedByCourtSmsNotification,
  formatCourtResubmittedToCourtSmsNotification,
  getCourtRecordPdfAsString,
  formatProsecutorReadyForCourtEmailNotification,
} from '../../formatters'
import { notifications } from '../../messages'
import { Case } from '../case'
import { CourtService } from '../court'
import { CaseEvent, EventService } from '../event'
import { SendNotificationDto } from './dto/sendNotification.dto'
import { Notification } from './models/notification.model'
import { SendNotificationResponse } from './models/sendNotification.resopnse'

interface Recipient {
  address?: string
  success: boolean
}

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
    private readonly courtService: CourtService,
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
    private readonly eventService: EventService,
    private readonly intlService: IntlService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private formatMessage: FormatMessage = () => {
    throw new InternalServerErrorException('Format message not initialized')
  }

  private refreshFormatMessage: () => Promise<void> = async () =>
    this.intlService
      .useIntl(['judicial.system.backend'], 'is')
      .then((res) => {
        this.formatMessage = res.formatMessage
      })
      .catch((reason) => {
        this.logger.error('Unable to refresh format messages', { reason })
      })

  private async existsRevokableNotification(
    caseId: string,
    recipientAddress?: string,
  ): Promise<boolean> {
    try {
      const notifications: Notification[] = await this.notificationModel.findAll(
        {
          where: {
            caseId,
            type: [
              NotificationType.HEADS_UP,
              NotificationType.READY_FOR_COURT,
              NotificationType.COURT_DATE,
            ],
          },
        },
      )

      return notifications.some((notification) => {
        if (!notification.recipients) {
          return false
        }

        const recipients: Recipient[] = JSON.parse(notification.recipients)

        return recipients.some(
          (recipient) =>
            recipient.address === recipientAddress && recipient.success,
        )
      })
    } catch (error) {
      // Tolerate failure, but log error
      this.logger.error(
        `Error while looking up revokable notifications for case ${caseId}`,
        { error },
      )

      return false
    }
  }

  private getCourtMobileNumbers(courtId?: string) {
    return (
      (courtId && environment.notifications.courtsMobileNumbers[courtId]) ??
      undefined
    )
  }

  private async sendSms(
    smsText: string,
    mobileNumbers?: string,
  ): Promise<Recipient> {
    if (!environment.production && !mobileNumbers) {
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
      await this.emailService.sendEmail({
        from: {
          name: environment.email.fromName,
          address: environment.email.fromEmail,
        },
        replyTo: {
          name: environment.email.replyToName,
          address: environment.email.replyToEmail,
        },
        to: [
          {
            name: recipientName ?? '',
            address: recipientEmail ?? '',
          },
        ],
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
              ? attachments
                  .reduce(
                    (acc, attachment) => `${acc}, ${attachment.filename}`,
                    '',
                  )
                  .slice(2)
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
    const notification = await this.notificationModel.create({
      caseId,
      type,
      recipients: JSON.stringify(recipients),
    })

    return {
      notificationSent: recipients.reduce(
        (sent, recipient) => sent || recipient?.success,
        false as boolean,
      ),
      notification,
    }
  }

  private async uploadRequestPdfToCourt(
    theCase: Case,
    user: User,
  ): Promise<void> {
    try {
      const requestPdf = await getRequestPdfAsBuffer(
        theCase,
        this.formatMessage,
      )

      await this.courtService.createRequest(
        user,
        theCase.id,
        theCase.courtId ?? '',
        theCase.courtCaseNumber ?? '',
        `Krafa ${theCase.policeCaseNumber}-${format(
          nowFactory(),
          'yyyy-MM-dd-HH:mm',
        )}`,
        requestPdf,
      )
    } catch (error) {
      this.logger.error(
        `Failed to upload request pdf to court for case ${theCase.id}`,
        { error },
      )
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
      theCase.court?.name,
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

  private async sendReadyForCourtEmailNotificationToProsecutor(
    theCase: Case,
  ): Promise<Recipient> {
    const { type, court, policeCaseNumber } = theCase

    const overviewUrl = `${
      isRestrictionCase(theCase.type)
        ? environment.deepLinks.prosecutorRestrictionCaseOverviewUrl
        : environment.deepLinks.prosecutorInvestigationCaseOverviewUrl
    }${theCase.id}`

    const { subject, body } = formatProsecutorReadyForCourtEmailNotification(
      this.formatMessage,
      type,
      court?.name,
      policeCaseNumber,
      overviewUrl,
    )

    return this.sendEmail(
      subject,
      body,
      theCase.prosecutor?.name,
      theCase.prosecutor?.email,
    )
  }

  private async sendReadyForCourtNotifications(
    theCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    // TODO: Ignore failed notifications
    const notification = await this.notificationModel.findOne({
      where: {
        caseId: theCase.id,
        type: NotificationType.READY_FOR_COURT,
      },
    })

    const promises: Promise<Recipient>[] = [
      this.sendReadyForCourtEmailNotificationToProsecutor(theCase),
    ]

    // TODO: Find a better place for this
    // TODO: Check state instead of court case number
    if (theCase.courtCaseNumber) {
      // No need to wait
      this.uploadRequestPdfToCourt(theCase, user)
    }

    if (notification) {
      // TODO: Check state instead of court case number
      if (theCase.courtCaseNumber) {
        promises.push(
          this.sendResubmittedToCourtSmsNotificationToCourt(theCase),
        )
      }

      this.eventService.postEvent(CaseEvent.RESUBMIT, theCase)
    } else {
      promises.push(this.sendReadyForCourtSmsNotificationToCourt(theCase))
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
        environment.email.fromEmail,
        environment.email.fromName,
      )
    } catch (error) {
      // Tolerate failure, but log error
      // TODO: Log as error when implemented in the court system
      this.logger.info(
        `Failed to upload email to court for case ${theCase.id}`,
        { error },
      )
    }
  }

  private async sendCourtDateEmailNotificationToProsecutor(
    theCase: Case,
    user: User,
  ): Promise<Recipient> {
    const subject = `Fyrirtaka í máli ${theCase.policeCaseNumber}`
    const html = formatProsecutorCourtDateEmailNotification(
      this.formatMessage,
      theCase.type,
      theCase.court?.name,
      theCase.courtDate,
      theCase.courtRoom,
      theCase.judge?.name,
      theCase.registrar?.name,
      theCase.defenderName,
      theCase.sessionArrangements,
    )
    const calendarInvite = this.createICalAttachment(theCase)

    const recipient = await this.sendEmail(
      subject,
      html,
      theCase.prosecutor?.name,
      theCase.prosecutor?.email,
      calendarInvite ? [calendarInvite] : undefined,
    )

    if (recipient.success) {
      // No need to wait
      this.uploadEmailToCourt(
        theCase,
        user,
        subject,
        html,
        theCase.prosecutor?.email,
      )
    }

    return recipient
  }

  private async sendCourtDateEmailNotificationToPrison(
    theCase: Case,
    user: User,
  ): Promise<Recipient> {
    const subject = this.formatMessage(
      notifications.prisonCourtDateEmail.subject,
      {
        caseType: theCase.type,
      },
    )
    // Assume there is at most one defendant
    const html = formatPrisonCourtDateEmailNotification(
      this.formatMessage,
      theCase.type,
      theCase.creatingProsecutor?.institution?.name,
      theCase.court?.name,
      theCase.courtDate,
      theCase.defendants && theCase.defendants.length > 0
        ? theCase.defendants[0].name
        : undefined,
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
    )

    const recipient = await this.sendEmail(
      subject,
      html,
      'Gæsluvarðhaldsfangelsi',
      environment.notifications.prisonEmail,
    )

    if (recipient.success) {
      // No need to wait
      this.uploadEmailToCourt(
        theCase,
        user,
        subject,
        html,
        environment.notifications.prisonEmail,
      )
    }

    return recipient
  }

  private async sendCourtDateEmailNotificationToDefender(
    theCase: Case,
    user: User,
  ): Promise<Recipient> {
    const subject = `Fyrirtaka í máli ${theCase.courtCaseNumber}`
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
      theCase.sendRequestToDefender,
      theCase.defenderNationalId &&
        `${environment.deepLinks.defenderCompletedCaseOverviewUrl}${theCase.id}`,
    )
    const calendarInvite = this.createICalAttachment(theCase)
    const attachments: Attachment[] = calendarInvite ? [calendarInvite] : []

    const recipient = await this.sendEmail(
      subject,
      html,
      theCase.defenderName,
      theCase.defenderEmail,
      attachments,
    )

    if (recipient.success) {
      // No need to wait
      this.uploadEmailToCourt(
        theCase,
        user,
        subject,
        html,
        theCase.defenderEmail,
      )
    }

    return recipient
  }

  private async sendCourtDateNotifications(
    theCase: Case,
    user: User,
    eventOnly?: boolean,
  ): Promise<SendNotificationResponse> {
    this.eventService.postEvent(CaseEvent.SCHEDULE_COURT_DATE, theCase)

    if (eventOnly) {
      return { notificationSent: false }
    }

    const promises: Promise<Recipient>[] = [
      this.sendCourtDateEmailNotificationToProsecutor(theCase, user),
    ]

    if (
      (isRestrictionCase(theCase.type) ||
        theCase.sessionArrangements === SessionArrangements.ALL_PRESENT ||
        theCase.sessionArrangements ===
          SessionArrangements.ALL_PRESENT_SPOKESPERSON) &&
      theCase.defenderEmail
    ) {
      promises.push(
        this.sendCourtDateEmailNotificationToDefender(theCase, user),
      )
    }

    if (
      theCase.type === CaseType.CUSTODY ||
      theCase.type === CaseType.ADMISSION_TO_FACILITY
    ) {
      promises.push(this.sendCourtDateEmailNotificationToPrison(theCase, user))
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

  private async sendRulingEmailNotificationToPrison(
    theCase: Case,
    courtRecordPdf: string,
  ): Promise<Recipient> {
    const subject = this.formatMessage(
      notifications.prisonRulingEmail.subject,
      {
        caseType: theCase.type,
      },
    )
    const html = formatPrisonRulingEmailNotification(
      this.formatMessage,
      theCase.type,
      theCase.rulingDate,
    )
    const custodyNoticePdf = await getCustodyNoticePdfAsString(
      theCase,
      this.formatMessage,
    )

    const attachments = [
      {
        filename: `Vistunarseðill ${theCase.courtCaseNumber}.pdf`,
        content: custodyNoticePdf,
        encoding: 'binary',
      },
      {
        filename: this.formatMessage(
          notifications.signedRuling.courtRecordAttachment,
          { courtCaseNumber: theCase.courtCaseNumber },
        ),
        content: courtRecordPdf,
        encoding: 'binary',
      },
    ]

    return this.sendEmail(
      subject,
      html,
      'Gæsluvarðhaldsfangelsi',
      environment.notifications.prisonEmail,
      attachments,
    )
  }

  private async sendRulingEmailNotificationToPrisonAdministration(
    theCase: Case,
    courtRecordPdf: string,
  ): Promise<Recipient> {
    return this.sendEmail(
      theCase.courtCaseNumber ?? '',
      'Sjá viðhengi',
      'Fangelsismálastofnun',
      environment.notifications.prisonAdminEmail,
      [
        {
          filename: this.formatMessage(
            notifications.signedRuling.courtRecordAttachment,
            { courtCaseNumber: theCase.courtCaseNumber },
          ),
          content: courtRecordPdf,
          encoding: 'binary',
        },
      ],
    )
  }

  private async sendRulingNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    if (isInvestigationCase(theCase.type)) {
      return {
        notificationSent: false,
      }
    }

    const courtRecordPdf = await getCourtRecordPdfAsString(
      theCase,
      this.formatMessage,
    )

    const recipients = [
      await this.sendRulingEmailNotificationToPrisonAdministration(
        theCase,
        courtRecordPdf,
      ),
    ]

    if (
      (theCase.type === CaseType.CUSTODY ||
        theCase.type === CaseType.ADMISSION_TO_FACILITY) &&
      (theCase.decision === CaseDecision.ACCEPTING ||
        theCase.decision === CaseDecision.ACCEPTING_PARTIALLY)
    ) {
      recipients.concat(
        await this.sendRulingEmailNotificationToPrison(theCase, courtRecordPdf),
      )
    }

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
    const html = `${
      theCase.isCustodyIsolation
        ? this.formatMessage(notifications.modified.isolationHtml, {
            caseType: theCase.type,
            actorInstitution: user.institution?.name,
            actorName: user.name,
            actorTitle: user.title,
            courtCaseNumber: theCase.courtCaseNumber,
            linkStart: `<a href="${environment.deepLinks.completedCaseOverviewUrl}${theCase.id}">`,
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
            linkStart: `<a href="${environment.deepLinks.completedCaseOverviewUrl}${theCase.id}">`,
            linkEnd: '</a>',
            validToDate: formatDate(theCase.validToDate, 'PPPp'),
          })
    }`
    const custodyNoticePdf = await getCustodyNoticePdfAsString(
      theCase,
      this.formatMessage,
    )

    const attachments = [
      {
        filename: `Vistunarseðill ${theCase.courtCaseNumber}.pdf`,
        content: custodyNoticePdf,
        encoding: 'binary',
      },
    ]

    const recipients = [
      await this.sendEmail(
        subject,
        html,
        'Fangelsismálastofnun',
        environment.notifications.prisonAdminEmail,
      ),
      await this.sendEmail(
        subject,
        html,
        'Gæsluvarðhaldsfangelsi',
        environment.notifications.prisonEmail,
        attachments,
      ),
    ]

    if (user.id !== theCase.prosecutorId) {
      recipients.push(
        await this.sendEmail(
          subject,
          html,
          theCase.prosecutor?.name,
          theCase.prosecutor?.email,
        ),
      )
    }

    if (user.id !== theCase.judgeId) {
      recipients.push(
        await this.sendEmail(
          subject,
          html,
          theCase.judge?.name,
          theCase.judge?.email,
        ),
      )
    }

    if (theCase.registrar && user.id !== theCase.registrarId) {
      recipients.push(
        await this.sendEmail(
          subject,
          html,
          theCase.registrar.name,
          theCase.registrar.email,
        ),
      )
    }

    return this.recordNotification(
      theCase.id,
      NotificationType.MODIFIED,
      recipients,
    )
  }

  /* REVOKED notifications */

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
      {
        caseType: theCase.type,
      },
    )
    // Assume there is at most one defendant
    const html = formatPrisonRevokedEmailNotification(
      this.formatMessage,
      theCase.type,
      theCase.creatingProsecutor?.institution?.name,
      theCase.court?.name,
      theCase.courtDate,
      theCase.defendants && theCase.defendants.length > 0
        ? theCase.defendants[0].name
        : undefined,
      theCase.defenderName,
      Boolean(theCase.parentCase),
    )

    return this.sendEmail(
      subject,
      html,
      'Gæsluvarðhaldsfangelsi',
      environment.notifications.prisonEmail,
    )
  }

  private sendRevokedEmailNotificationToDefender(
    theCase: Case,
  ): Promise<Recipient> {
    const subject = this.formatMessage(
      notifications.defenderRevokedEmail.subject,
      {
        caseType: theCase.type,
      },
    )

    // Assume there is at most one defendant
    const html = formatDefenderRevokedEmailNotification(
      this.formatMessage,
      theCase.type,
      theCase.defendants && theCase.defendants.length > 0
        ? theCase.defendants[0].nationalId
        : undefined,
      theCase.defendants && theCase.defendants.length > 0
        ? theCase.defendants[0].name
        : undefined,
      theCase.defendants && theCase.defendants.length > 0
        ? theCase.defendants[0].noNationalId
        : undefined,
      theCase.court?.name,
      theCase.courtDate,
    )

    return this.sendEmail(
      subject,
      html,
      theCase.defenderName,
      theCase.defenderEmail,
    )
  }

  private async sendRevokedNotifications(
    theCase: Case,
  ): Promise<SendNotificationResponse> {
    const promises: Promise<Recipient>[] = []

    const courtWasNotified = await this.existsRevokableNotification(
      theCase.id,
      this.getCourtMobileNumbers(theCase.courtId),
    )

    if (courtWasNotified) {
      promises.push(this.sendRevokedSmsNotificationToCourt(theCase))
    }

    const prisonWasNotified =
      (theCase.type === CaseType.CUSTODY ||
        theCase.type === CaseType.ADMISSION_TO_FACILITY) &&
      (await this.existsRevokableNotification(
        theCase.id,
        environment.notifications.prisonEmail,
      ))

    if (prisonWasNotified) {
      promises.push(this.sendRevokedEmailNotificationToPrison(theCase))
    }

    const defenderWasNotified = await this.existsRevokableNotification(
      theCase.id,
      theCase.defenderEmail,
    )

    if (defenderWasNotified && theCase.defenderEmail) {
      promises.push(this.sendRevokedEmailNotificationToDefender(theCase))
    }

    const recipients = await Promise.all(promises)

    if (recipients.length > 0) {
      return this.recordNotification(
        theCase.id,
        NotificationType.REVOKED,
        recipients,
      )
    }

    return {
      notificationSent: false,
    }
  }

  /* API */

  async getAllCaseNotifications(theCase: Case): Promise<Notification[]> {
    return this.notificationModel.findAll({
      where: { caseId: theCase.id },
      order: [['created', 'DESC']],
    })
  }

  async sendCaseNotification(
    notification: SendNotificationDto,
    theCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    await this.refreshFormatMessage()

    switch (notification.type) {
      case NotificationType.HEADS_UP:
        return this.sendHeadsUpNotifications(theCase)
      case NotificationType.READY_FOR_COURT:
        return this.sendReadyForCourtNotifications(theCase, user)
      case NotificationType.RECEIVED_BY_COURT:
        return this.sendReceivedByCourtNotifications(theCase)
      case NotificationType.COURT_DATE:
        return this.sendCourtDateNotifications(
          theCase,
          user,
          notification.eventOnly,
        )
      case NotificationType.RULING:
        return this.sendRulingNotifications(theCase)
      case NotificationType.MODIFIED:
        return this.sendModifiedNotifications(theCase, user)
      case NotificationType.REVOKED:
        return this.sendRevokedNotifications(theCase)
    }
  }
}
