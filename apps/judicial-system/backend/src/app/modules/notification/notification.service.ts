import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SmsService } from '@island.is/nova-sms'
import { EmailService } from '@island.is/email-service'
import {
  CaseCustodyRestrictions,
  NotificationType,
  User,
} from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import {
  formatProsecutorCourtDateEmailNotification,
  formatCourtDateNotificationCondition,
  formatHeadsUpSmsNotification,
  formatPrisonCourtDateEmailNotification,
  formatReadyForCourtSmsNotification,
  generateRequestPdf,
  formatDefenderCourtDateEmailNotification,
  stripHtmlTags,
  formatPrisonRulingEmailNotification,
} from '../../formatters'
import { Case } from '../case'
import { SendNotificationDto } from './dto'
import { Notification, SendNotificationResponse } from './models'

interface Recipient {
  address: string
  success: boolean
}

@Injectable()
export class NotificationService {
  constructor(
    @Inject(SmsService)
    private readonly smsService: SmsService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async sendSms(smsText: string): Promise<Recipient> {
    // Production or local development with judge mobile number
    if (environment.production || environment.notifications.judgeMobileNumber) {
      try {
        await this.smsService.sendSms(
          environment.notifications.judgeMobileNumber,
          smsText,
        )
      } catch (error) {
        this.logger.error(
          `Failed to send sms to ${environment.notifications.judgeMobileNumber}`,
          error,
        )
        return {
          address: environment.notifications.judgeMobileNumber,
          success: false,
        }
      }
    }

    return {
      address: environment.notifications.judgeMobileNumber,
      success: true,
    }
  }

  private async sendEmail(
    recipientName: string,
    recipientEmail: string,
    subject: string,
    html: string,
    attachments: {
      filename: string
      content: string
      encoding: string
    }[] = null,
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
      this.logger.error(`Failed to send email to ${recipientEmail}`, error)
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

  private async sendHeadsUpSmsToCourt(
    existingCase: Case,
    user: User,
  ): Promise<Recipient> {
    const smsText = formatHeadsUpSmsNotification(
      existingCase.prosecutor?.name || user?.name,
      existingCase.arrestDate,
      existingCase.requestedCourtDate,
    )

    return await this.sendSms(smsText)
  }

  private async sendHeadsUpNotifications(
    existingCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    const recipient = await this.sendHeadsUpSmsToCourt(existingCase, user)

    return this.recordNotification(existingCase.id, NotificationType.HEADS_UP, [
      recipient,
    ])
  }

  /* READY_FOR_COURT notifications */

  private sendReadyForCourtSmsToCourt(
    existingCase: Case,
    user: User,
  ): Promise<Recipient> {
    const smsText = formatReadyForCourtSmsNotification(
      existingCase.prosecutor?.name || user?.name,
      existingCase.court,
    )

    return this.sendSms(smsText)
  }

  private async sendReadyForCourtEmailToProsecutor(
    existingCase: Case,
    user: User,
  ): Promise<Recipient> {
    const pdf = await generateRequestPdf(existingCase, user)

    const subject = `Krafa í máli ${existingCase.policeCaseNumber}`
    const html = 'Sjá viðhengi'
    const attachments = [
      {
        filename: `${existingCase.policeCaseNumber}.pdf`,
        content: pdf,
        encoding: 'binary',
      },
    ]

    return this.sendEmail(
      existingCase.prosecutor?.name || user?.name,
      existingCase.prosecutor?.email || user?.email,
      subject,
      html,
      attachments,
    )
  }

  private async sendReadyForCourtNotifications(
    existingCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    const recipients = await Promise.all([
      this.sendReadyForCourtEmailToProsecutor(existingCase, user),
      this.sendReadyForCourtSmsToCourt(existingCase, user),
    ])

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
      existingCase.court,
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
    const subject = 'Krafa um gæsluvarðhald í vinnslu'
    const html = formatPrisonCourtDateEmailNotification(
      existingCase.court,
      existingCase.courtDate,
      existingCase.accusedGender,
      existingCase.requestedCustodyEndDate,
      existingCase.requestedCustodyRestrictions?.includes(
        CaseCustodyRestrictions.ISOLATION,
      ),
      existingCase.defenderName,
    )

    return this.sendEmail(
      'Gæsluvarðhaldsfangelsi',
      environment.notifications.prisonEmail,
      subject,
      html,
    )
  }

  private sendCourtDateEmailNotificationToDefender(
    existingCase: Case,
  ): Promise<Recipient> {
    if (!existingCase.defenderEmail) {
      return
    }

    const subject = 'Krafa um gæsluvarðhald í vinnslu'
    const html = formatDefenderCourtDateEmailNotification(
      existingCase.accusedNationalId,
      existingCase.accusedName,
      existingCase.court,
      existingCase.courtDate,
      existingCase.courtRoom,
    )

    return this.sendEmail(
      existingCase.defenderName,
      existingCase.defenderEmail,
      subject,
      html,
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

    const recipients = await Promise.all([
      this.sendCourtDateEmailNotificationToProsecutor(existingCase),
      this.sendCourtDateEmailNotificationToPrison(existingCase),
      this.sendCourtDateEmailNotificationToDefender(existingCase),
    ])

    return this.recordNotification(
      existingCase.id,
      NotificationType.COURT_DATE,
      recipients,
      condition,
    )
  }

  /* RULING notifications */

  private sendRulingEmailNotificationToPrison(
    existingCase: Case,
  ): Promise<Recipient> {
    const subject = 'Úrskurður um gæsluvarðhald'
    const html = formatPrisonRulingEmailNotification(
      existingCase.accusedNationalId,
      existingCase.accusedName,
      existingCase.court,
      existingCase.prosecutor?.name,
      existingCase.courtDate,
      existingCase.defenderName,
      existingCase.decision,
      existingCase.custodyEndDate,
      existingCase.custodyRestrictions,
      existingCase.accusedAppealDecision,
      existingCase.prosecutorAppealDecision,
      existingCase.judge?.name,
      existingCase.judge?.title,
    )

    return this.sendEmail(
      'Gæsluvarðhaldsfangelsi',
      environment.notifications.prisonEmail,
      subject,
      html,
    )
  }

  private async sendRulingNotifications(
    existingCase: Case,
  ): Promise<SendNotificationResponse> {
    const recipient = await this.sendRulingEmailNotificationToPrison(
      existingCase,
    )

    return this.recordNotification(existingCase.id, NotificationType.RULING, [
      recipient,
    ])
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
    user: User,
  ): Promise<SendNotificationResponse> {
    this.logger.debug(
      `Sending ${notification.type} notification for case ${existingCase.id}`,
    )

    switch (notification.type) {
      case NotificationType.HEADS_UP:
        return this.sendHeadsUpNotifications(existingCase, user)
      case NotificationType.READY_FOR_COURT:
        return this.sendReadyForCourtNotifications(existingCase, user)
      case NotificationType.COURT_DATE:
        return this.sendCourtDateNotifications(existingCase)
      case NotificationType.RULING:
        return this.sendRulingNotifications(existingCase)
    }
  }
}
