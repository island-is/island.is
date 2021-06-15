import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SmsService } from '@island.is/nova-sms'
import { EmailService } from '@island.is/email-service'
import {
  CaseCustodyRestrictions,
  CaseDecision,
  CaseState,
  CaseType,
  IntegratedCourts,
  NotificationType,
  SessionArrangements,
} from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import {
  formatProsecutorCourtDateEmailNotification,
  formatCourtDateNotificationCondition,
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
} from '../../formatters'
import { Case } from '../case'
import { CourtService } from '../court'
import { SendNotificationDto } from './dto'
import { Notification, SendNotificationResponse } from './models'

interface Recipient {
  address: string
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
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async existsRevokableNotification(
    caseId: string,
    recipientAddress: string,
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
    } catch {
      return false
    }
  }

  private async sendSms(
    mobileNumbers: string,
    smsText: string,
  ): Promise<Recipient> {
    // Production or local development with judge mobile number
    if (environment.production || mobileNumbers) {
      try {
        await this.smsService.sendSms(mobileNumbers.split(','), smsText)
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
    recipientName: string,
    recipientEmail: string,
    subject: string,
    html: string,
    attachments: Attachment[] = null,
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
            name: recipientName,
            address: recipientEmail,
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
    condition: string = undefined,
  ): Promise<SendNotificationResponse> {
    const notification = await this.notificationModel.create({
      caseId,
      type,
      condition,
      recipients: JSON.stringify(recipients),
    })

    return {
      notificationSent: recipients.reduce(
        (sent, recipient) => sent || recipient?.success,
        false,
      ),
      notification,
    }
  }

  /* HEADS_UP notifications */

  private async sendHeadsUpSmsNotificationToCourt(
    existingCase: Case,
  ): Promise<Recipient> {
    const smsText = formatCourtHeadsUpSmsNotification(
      existingCase.type,
      existingCase.prosecutor?.name,
      existingCase.arrestDate,
      existingCase.requestedCourtDate,
    )

    return await this.sendSms(
      environment.notifications.courtsMobileNumbers[existingCase.courtId],
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
      environment.notifications.courtsMobileNumbers[existingCase.courtId],
      smsText,
    )
  }

  private async sendReadyForCourtEmailNotificationToProsecutor(
    existingCase: Case,
  ): Promise<Recipient> {
    const pdf = await getRequestPdfAsString(existingCase)

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

  private async uploadRequestPdfToCourt(existingCase: Case): Promise<void> {
    const pdf = await getRequestPdfAsBuffer(existingCase)

    try {
      const streamId = await this.courtService.uploadStream(
        existingCase.courtId,
        pdf,
      )
      await this.courtService.createDocument(
        existingCase.courtId,
        existingCase.courtCaseNumber,
        streamId,
      )
    } catch (error) {
      this.logger.error('Failed to upload request to court', error)
    }
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
      existingCase.defenderName,
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
      existingCase.prosecutor?.institution?.name,
      existingCase.court?.name,
      existingCase.courtDate,
      existingCase.accusedName,
      existingCase.accusedGender,
      existingCase.requestedValidToDate,
      existingCase.requestedCustodyRestrictions?.includes(
        CaseCustodyRestrictions.ISOLATION,
      ),
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

  private async sendCourtDateEmailNotificationToDefender(
    existingCase: Case,
  ): Promise<Recipient> {
    if (!existingCase.defenderEmail) {
      return
    }

    const subject = `Fyrirtaka í máli ${existingCase.courtCaseNumber}`
    const html = formatDefenderCourtDateEmailNotification(
      existingCase.court?.name,
      existingCase.courtCaseNumber,
      existingCase.courtDate,
      existingCase.courtRoom,
    )

    let attachments: Attachment[]

    if (existingCase.sendRequestToDefender) {
      const pdf = await getRequestPdfAsString(existingCase)

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
    const condition = formatCourtDateNotificationCondition(
      existingCase.courtDate,
      existingCase.defenderEmail,
    )

    const notifications = await this.notificationModel.findAll({
      where: {
        caseId: existingCase.id,
        type: NotificationType.COURT_DATE,
      },
      order: [['created', 'DESC']],
    })

    if (notifications?.length > 0 && notifications[0].condition === condition) {
      return {
        notificationSent: false,
        notification: notifications[0],
      }
    }

    const promises: Promise<Recipient>[] = [
      this.sendCourtDateEmailNotificationToProsecutor(existingCase),
    ]

    if (
      existingCase.type === CaseType.CUSTODY ||
      existingCase.type === CaseType.TRAVEL_BAN ||
      existingCase.sessionArrangements === SessionArrangements.ALL_PRESENT
    ) {
      promises.push(this.sendCourtDateEmailNotificationToDefender(existingCase))
    }

    if (existingCase.type === CaseType.CUSTODY) {
      promises.push(this.sendCourtDateEmailNotificationToPrison(existingCase))
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      existingCase.id,
      NotificationType.COURT_DATE,
      recipients,
      condition,
    )
  }

  /* RULING notifications */

  private async sendRulingEmailNotificationToPrison(
    existingCase: Case,
  ): Promise<Recipient> {
    const subject = 'Úrskurður um gæsluvarðhald' // Always custody
    const html = formatPrisonRulingEmailNotification(
      existingCase.accusedNationalId,
      existingCase.accusedName,
      existingCase.accusedGender,
      existingCase.court?.name,
      existingCase.prosecutor?.name,
      existingCase.courtEndTime,
      existingCase.defenderName,
      existingCase.defenderEmail,
      existingCase.decision,
      existingCase.validToDate,
      existingCase.custodyRestrictions,
      existingCase.accusedAppealDecision,
      existingCase.prosecutorAppealDecision,
      existingCase.judge?.name,
      existingCase.judge?.title,
      existingCase.parentCase !== null,
      existingCase.parentCase?.decision,
      existingCase.conclusion,
    )

    let attachments: Attachment[]

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

    // TODO: Consider adding the prosecutor as cc to the prison email
    await this.sendEmail(
      existingCase.prosecutor?.name,
      existingCase.prosecutor?.email,
      subject,
      html,
      attachments,
    )

    return this.sendEmail(
      'Gæsluvarðhaldsfangelsi',
      environment.notifications.prisonEmail,
      subject,
      html,
      attachments,
    )
  }

  private async sendRulingNotifications(
    existingCase: Case,
  ): Promise<SendNotificationResponse> {
    if (existingCase.type !== CaseType.CUSTODY) {
      return {
        notificationSent: false,
      }
    }

    const recipient = await this.sendRulingEmailNotificationToPrison(
      existingCase,
    )

    return this.recordNotification(existingCase.id, NotificationType.RULING, [
      recipient,
    ])
  }

  /* REVOKED notifications */

  private async sendRevokedSmsNotificationToCourt(
    existingCase: Case,
  ): Promise<Recipient> {
    const smsText = formatCourtRevokedSmsNotification(
      existingCase.type,
      existingCase.prosecutor?.name,
      existingCase.requestedCourtDate,
      existingCase.courtDate,
    )

    return await this.sendSms(
      environment.notifications.courtsMobileNumbers[existingCase.courtId],
      smsText,
    )
  }

  private sendRevokedEmailNotificationToPrison(
    existingCase: Case,
  ): Promise<Recipient> {
    const subject = 'Gæsluvarðhaldskrafa afturkölluð' // Always custody
    const html = formatPrisonRevokedEmailNotification(
      existingCase.prosecutor?.institution?.name,
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
    if (!existingCase.defenderEmail) {
      return
    }

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
      environment.notifications.courtsMobileNumbers[existingCase.courtId],
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

    if (defenderWasNotified) {
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

  getAllCaseNotifications(existingCase: Case): Promise<Notification[]> {
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
      case NotificationType.COURT_DATE:
        return this.sendCourtDateNotifications(existingCase)
      case NotificationType.RULING:
        return this.sendRulingNotifications(existingCase)
      case NotificationType.REVOKED:
        return this.sendRevokedNotifications(existingCase)
    }
  }
}
