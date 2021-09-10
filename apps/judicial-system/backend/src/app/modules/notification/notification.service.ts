import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { IntlService } from '@island.is/cms-translations'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { SmsService } from '@island.is/nova-sms'
import { EmailService } from '@island.is/email-service'
import { IntegratedCourts } from '@island.is/judicial-system/consts'
import {
  CaseCustodyRestrictions,
  CaseDecision,
  CaseState,
  CaseType,
  NotificationType,
  isRestrictionCase,
  isInvestigationCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import {
  formatProsecutorCourtDateEmailNotification,
  formatCourtHeadsUpSmsNotification,
  formatPrisonCourtDateEmailNotification,
  formatCourtReadyForCourtSmsNotification,
  getRequestPdfAsString,
  formatDefenderCourtDateEmailNotification,
  stripHtmlTags,
  formatPrisonRulingEmailNotification,
  formatCourtRevokedSmsNotification,
  formatPrisonRevokedEmailNotification,
  formatDefenderRevokedEmailNotification,
  getRequestPdfAsBuffer,
  getCustodyNoticePdfAsString,
  formatProsecutorReceivedByCourtSmsNotification,
  getRulingPdfAsString,
} from '../../formatters'
import { Case } from '../case'
import { CourtService } from '../court'
import { CaseEvent, EventService } from '../event'
import { SendNotificationDto } from './dto'
import { Notification, SendNotificationResponse } from './models'

interface Recipient {
  address?: string
  success: boolean
}

interface Attachment {
  filename: string
  content: string
  encoding: string
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    private readonly courtService: CourtService,
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
    private readonly intlService: IntlService,
    private readonly eventService: EventService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async existsRevokableNotification(
    caseId: string,
    recipientAddress: string | undefined,
  ): Promise<boolean> {
    try {
      const notifications: Notification[] =
        await this.notificationModel.findAll({
          where: {
            caseId,
            type: [
              NotificationType.HEADS_UP,
              NotificationType.READY_FOR_COURT,
              NotificationType.COURT_DATE,
            ],
          },
        })

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
    } catch {
      return false
    }
  }

  private getCourtMobileNumber(courtId: string | undefined) {
    return (
      (courtId && environment.notifications.courtsMobileNumbers[courtId]) ??
      undefined
    )
  }

  private async sendSms(
    mobileNumbers: string | undefined,
    smsText: string,
  ): Promise<Recipient> {
    // Production or local development with judge mobile number
    if (environment.production || mobileNumbers) {
      try {
        await this.smsService.sendSms(mobileNumbers?.split(',') ?? '', smsText)
      } catch (error) {
        this.logger.error('Failed to send sms to court mobile number', error)

        return {
          address: mobileNumbers,
          success: false,
        }
      }
    }

    return {
      address: mobileNumbers,
      success: true,
    }
  }

  private async sendEmail(
    recipientName: string | undefined,
    recipientEmail: string | undefined,
    subject: string,
    html: string,
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
      this.logger.error('Failed to send email', error)

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

  private async uploadRequestPdfToCourt(existingCase: Case): Promise<void> {
    const intl = await this.intlService.useIntl(
      ['judicial.system.backend'],
      'is',
    )

    const requestPdf = await getRequestPdfAsBuffer(
      existingCase,
      intl.formatMessage,
    )

    try {
      const streamId = await this.courtService.uploadStream(
        existingCase.courtId,
        'Krafa.pdf',
        'application/pdf',
        requestPdf,
      )
      await this.courtService.createRequest(
        existingCase.courtId,
        existingCase.courtCaseNumber,
        'Krafa',
        'Krafa.pdf',
        streamId,
      )
    } catch (error) {
      this.logger.error('Failed to upload request pdf to court', error)
    }
  }

  /* HEADS_UP notifications */

  private sendHeadsUpSmsNotificationToCourt(
    existingCase: Case,
  ): Promise<Recipient> {
    const smsText = formatCourtHeadsUpSmsNotification(
      existingCase.type,
      existingCase.prosecutor?.name,
      existingCase.arrestDate,
      existingCase.requestedCourtDate,
    )

    return this.sendSms(
      this.getCourtMobileNumber(existingCase.courtId),
      smsText,
    )
  }

  private async sendHeadsUpNotifications(
    existingCase: Case,
  ): Promise<SendNotificationResponse> {
    const recipient = await this.sendHeadsUpSmsNotificationToCourt(existingCase)

    return this.recordNotification(existingCase.id, NotificationType.HEADS_UP, [
      recipient,
    ])
  }

  /* READY_FOR_COURT notifications */

  private sendReadyForCourtSmsNotificationToCourt(
    existingCase: Case,
  ): Promise<Recipient> {
    const smsText = formatCourtReadyForCourtSmsNotification(
      existingCase.type,
      existingCase.prosecutor?.name,
      existingCase.court?.name,
    )

    return this.sendSms(
      this.getCourtMobileNumber(existingCase.courtId),
      smsText,
    )
  }

  private async sendReadyForCourtEmailNotificationToProsecutor(
    existingCase: Case,
  ): Promise<Recipient> {
    const intl = await this.intlService.useIntl(
      ['judicial.system.backend'],
      'is',
    )
    const pdf = await getRequestPdfAsString(existingCase, intl.formatMessage)

    const subject = `Krafa í máli ${existingCase.policeCaseNumber}`
    const html = 'Sjá viðhengi'
    const attachments = [
      {
        filename: `Krafa um ${
          existingCase.type === CaseType.CUSTODY
            ? 'gæsluvarðhald'
            : existingCase.type === CaseType.TRAVEL_BAN
            ? 'farbann'
            : 'rannsóknarheimild'
        } ${existingCase.policeCaseNumber}.pdf`,
        content: pdf,
        encoding: 'binary',
      },
    ]

    return this.sendEmail(
      existingCase.prosecutor?.name,
      existingCase.prosecutor?.email,
      subject,
      html,
      attachments,
    )
  }

  private async sendReadyForCourtNotifications(
    existingCase: Case,
  ): Promise<SendNotificationResponse> {
    // TODO: Ignore failed notifications
    const notificaion = await this.notificationModel.findOne({
      where: {
        caseId: existingCase.id,
        type: NotificationType.READY_FOR_COURT,
      },
    })

    const promises: Promise<Recipient>[] = [
      this.sendReadyForCourtEmailNotificationToProsecutor(existingCase),
    ]

    // TODO: Find a better place for this
    if (
      existingCase.courtId &&
      IntegratedCourts.includes(existingCase.courtId) &&
      existingCase.courtCaseNumber
    ) {
      // No need to wait
      this.uploadRequestPdfToCourt(existingCase)
    }

    // Notify the court only once
    if (!notificaion) {
      promises.push(this.sendReadyForCourtSmsNotificationToCourt(existingCase))
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      existingCase.id,
      NotificationType.READY_FOR_COURT,
      recipients,
    )
  }

  /* RECEIVED_BY_COURT notifications */

  private sendReceivedByCourtSmsNotificationToProsecutor(
    existingCase: Case,
  ): Promise<Recipient> {
    const smsText = formatProsecutorReceivedByCourtSmsNotification(
      existingCase.type,
      existingCase.court?.name,
      existingCase.courtCaseNumber,
    )

    return this.sendSms(existingCase.prosecutor?.mobileNumber, smsText)
  }

  private async sendReceivedByCourtNotifications(
    existingCase: Case,
  ): Promise<SendNotificationResponse> {
    const recipient = await this.sendReceivedByCourtSmsNotificationToProsecutor(
      existingCase,
    )

    return this.recordNotification(
      existingCase.id,
      NotificationType.RECEIVED_BY_COURT,
      [recipient],
    )
  }

  /* COURT_DATE notifications */

  private sendCourtDateEmailNotificationToProsecutor(
    existingCase: Case,
  ): Promise<Recipient> {
    const subject = `Fyrirtaka í máli ${existingCase.policeCaseNumber}`
    const html = formatProsecutorCourtDateEmailNotification(
      existingCase.type,
      existingCase.court?.name,
      existingCase.courtDate,
      existingCase.courtRoom,
      existingCase.judge?.name,
      existingCase.registrar?.name,
      existingCase.defenderName,
      existingCase.defenderIsSpokesperson,
      existingCase.sessionArrangements,
    )

    return this.sendEmail(
      existingCase.prosecutor?.name,
      existingCase.prosecutor?.email,
      subject,
      html,
    )
  }

  private sendCourtDateEmailNotificationToPrison(
    existingCase: Case,
  ): Promise<Recipient> {
    const subject = 'Krafa um gæsluvarðhald í vinnslu' // Always custody
    const html = formatPrisonCourtDateEmailNotification(
      existingCase.creatingProsecutor?.institution?.name,
      existingCase.court?.name,
      existingCase.courtDate,
      existingCase.accusedName,
      existingCase.accusedGender,
      existingCase.requestedValidToDate,
      existingCase.requestedCustodyRestrictions?.includes(
        CaseCustodyRestrictions.ISOLATION,
      ),
      existingCase.defenderName,
      existingCase.defenderIsSpokesperson,
      existingCase.parentCase &&
        existingCase.parentCase?.decision === CaseDecision.ACCEPTING,
    )

    return this.sendEmail(
      'Gæsluvarðhaldsfangelsi',
      environment.notifications.prisonEmail,
      subject,
      html,
    )
  }

  private async sendCourtDateEmailNotificationToDefender(
    existingCase: Case,
  ): Promise<Recipient> {
    const subject = `Fyrirtaka í máli ${existingCase.courtCaseNumber}`
    const html = formatDefenderCourtDateEmailNotification(
      existingCase.court?.name,
      existingCase.courtCaseNumber,
      existingCase.courtDate,
      existingCase.courtRoom,
      existingCase.defenderIsSpokesperson,
    )

    let attachments: Attachment[] | undefined

    if (existingCase.sendRequestToDefender) {
      const intl = await this.intlService.useIntl(
        ['judicial.system.backend'],
        'is',
      )
      const pdf = await getRequestPdfAsString(existingCase, intl.formatMessage)

      attachments = [
        {
          filename: `${existingCase.policeCaseNumber}.pdf`,
          content: pdf,
          encoding: 'binary',
        },
      ]
    }

    return this.sendEmail(
      existingCase.defenderName,
      existingCase.defenderEmail,
      subject,
      html,
      attachments,
    )
  }

  private async sendCourtDateNotifications(
    existingCase: Case,
  ): Promise<SendNotificationResponse> {
    const promises: Promise<Recipient>[] = [
      this.sendCourtDateEmailNotificationToProsecutor(existingCase),
    ]

    if (
      (isRestrictionCase(existingCase.type) ||
        existingCase.sessionArrangements === SessionArrangements.ALL_PRESENT) &&
      existingCase.defenderEmail
    ) {
      promises.push(this.sendCourtDateEmailNotificationToDefender(existingCase))
    }

    if (existingCase.type === CaseType.CUSTODY) {
      promises.push(this.sendCourtDateEmailNotificationToPrison(existingCase))
    }

    const recipients = await Promise.all(promises)

    const result = await this.recordNotification(
      existingCase.id,
      NotificationType.COURT_DATE,
      recipients,
    )

    if (result.notificationSent) {
      this.eventService.postEvent(CaseEvent.COURT_DATE, existingCase)
    }

    return result
  }

  /* RULING notifications */

  private async sendRulingEmailNotificationToProsecutorAndPrison(
    existingCase: Case,
  ): Promise<Recipient[]> {
    const subject = 'Úrskurður um gæsluvarðhald' // Always custody
    const html = formatPrisonRulingEmailNotification(existingCase.courtEndTime)

    let attachments: Attachment[] | undefined

    if (existingCase.state === CaseState.ACCEPTED) {
      const pdf = await getCustodyNoticePdfAsString(existingCase)
      attachments = [
        {
          filename: `Vistunarseðill ${existingCase.courtCaseNumber}.pdf`,
          content: pdf,
          encoding: 'binary',
        },
      ]
    }

    return Promise.all([
      this.sendEmail(
        existingCase.prosecutor?.name,
        existingCase.prosecutor?.email,
        subject,
        html,
        attachments,
      ),
      this.sendEmail(
        'Gæsluvarðhaldsfangelsi',
        environment.notifications.prisonEmail,
        subject,
        html,
        attachments,
      ),
    ])
  }

  private async sendRulingEmailNotificationToPrisonAdministration(
    existingCase: Case,
  ): Promise<Recipient> {
    const intl = await this.intlService.useIntl(
      ['judicial.system.backend'],
      'is',
    )

    const pdf = await getRulingPdfAsString(
      existingCase,
      intl.formatMessage,
      true,
    )

    return this.sendEmail(
      'Fangelsismálastofnun',
      environment.notifications.prisonAdminEmail,
      existingCase.courtCaseNumber ?? '',
      'Sjá viðhengi',
      [
        {
          filename: `Þingbók án úrskurður ${existingCase.courtCaseNumber}.pdf`,
          content: pdf,
          encoding: 'binary',
        },
      ],
    )
  }

  private async sendRulingNotifications(
    existingCase: Case,
  ): Promise<SendNotificationResponse> {
    if (isInvestigationCase(existingCase.type)) {
      return {
        notificationSent: false,
      }
    }

<<<<<<< HEAD
    const recipients = [
      await this.sendRulingEmailNotificationToPrisonAdministration(
        existingCase,
      ),
    ]

    if (existingCase.type === CaseType.CUSTODY) {
      recipients.concat(
        await this.sendRulingEmailNotificationToProsecutorAndPrison(
          existingCase,
        ),
      )
    }
=======
    const recipients =
      await this.sendRulingEmailNotificationToProsecutorAndPrison(existingCase)
>>>>>>> d8cbe2b6e (yarn format)

    return this.recordNotification(
      existingCase.id,
      NotificationType.RULING,
      recipients,
    )
  }

  /* REVOKED notifications */

  private sendRevokedSmsNotificationToCourt(
    existingCase: Case,
  ): Promise<Recipient> {
    const smsText = formatCourtRevokedSmsNotification(
      existingCase.type,
      existingCase.prosecutor?.name,
      existingCase.requestedCourtDate,
      existingCase.courtDate,
    )

    return this.sendSms(
      this.getCourtMobileNumber(existingCase.courtId),
      smsText,
    )
  }

  private sendRevokedEmailNotificationToPrison(
    existingCase: Case,
  ): Promise<Recipient> {
    const subject = 'Gæsluvarðhaldskrafa afturkölluð' // Always custody
    const html = formatPrisonRevokedEmailNotification(
      existingCase.creatingProsecutor?.institution?.name,
      existingCase.court?.name,
      existingCase.courtDate,
      existingCase.accusedName,
      existingCase.defenderName,
      existingCase.parentCase &&
        existingCase.parentCase?.decision === CaseDecision.ACCEPTING,
    )

    return this.sendEmail(
      'Gæsluvarðhaldsfangelsi',
      environment.notifications.prisonEmail,
      subject,
      html,
    )
  }

  private sendRevokedEmailNotificationToDefender(
    existingCase: Case,
  ): Promise<Recipient> {
    const subject = `${
      existingCase.type === CaseType.CUSTODY
        ? 'Gæsluvarðhaldskrafa'
        : 'Farbannskrafa'
    } afturkölluð`
    const html = formatDefenderRevokedEmailNotification(
      existingCase.type,
      existingCase.accusedNationalId,
      existingCase.accusedName,
      existingCase.court?.name,
      existingCase.courtDate,
    )

    return this.sendEmail(
      existingCase.defenderName,
      existingCase.defenderEmail,
      subject,
      html,
    )
  }

  private async sendRevokedNotifications(
    existingCase: Case,
  ): Promise<SendNotificationResponse> {
    const promises: Promise<Recipient>[] = []

    const courtWasNotified = await this.existsRevokableNotification(
      existingCase.id,
      this.getCourtMobileNumber(existingCase.courtId),
    )

    if (courtWasNotified) {
      promises.push(this.sendRevokedSmsNotificationToCourt(existingCase))
    }

    const prisonWasNotified =
      existingCase.type === CaseType.CUSTODY &&
      (await this.existsRevokableNotification(
        existingCase.id,
        environment.notifications.prisonEmail,
      ))

    if (prisonWasNotified) {
      promises.push(this.sendRevokedEmailNotificationToPrison(existingCase))
    }

    const defenderWasNotified = await this.existsRevokableNotification(
      existingCase.id,
      existingCase.defenderEmail,
    )

    if (defenderWasNotified && existingCase.defenderEmail) {
      promises.push(this.sendRevokedEmailNotificationToDefender(existingCase))
    }

    const recipients = await Promise.all(promises)

    if (recipients.length > 0) {
      return this.recordNotification(
        existingCase.id,
        NotificationType.REVOKED,
        recipients,
      )
    }

    return {
      notificationSent: false,
    }
  }

  /* API */

  async getAllCaseNotifications(existingCase: Case): Promise<Notification[]> {
    this.logger.debug(`Getting all notifications for case ${existingCase.id}`)

    return this.notificationModel.findAll({
      where: { caseId: existingCase.id },
      order: [['created', 'DESC']],
    })
  }

  sendCaseNotification(
    notification: SendNotificationDto,
    existingCase: Case,
  ): Promise<SendNotificationResponse> {
    this.logger.debug(
      `Sending ${notification.type} notification for case ${existingCase.id}`,
    )

    switch (notification.type) {
      case NotificationType.HEADS_UP:
        return this.sendHeadsUpNotifications(existingCase)
      case NotificationType.READY_FOR_COURT:
        return this.sendReadyForCourtNotifications(existingCase)
      case NotificationType.RECEIVED_BY_COURT:
        return this.sendReceivedByCourtNotifications(existingCase)
      case NotificationType.COURT_DATE:
        return this.sendCourtDateNotifications(existingCase)
      case NotificationType.RULING:
        return this.sendRulingNotifications(existingCase)
      case NotificationType.REVOKED:
        return this.sendRevokedNotifications(existingCase)
    }
  }
}
