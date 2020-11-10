import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SmsService } from '@island.is/nova-sms'
import { EmailService } from '@island.is/email-service'
import { NotificationType } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import {
  formatCourtDateNotification,
  formatHeadsUpNotification,
  formatReadyForCourtSmsNotification,
  generateRequestPdf,
} from '../../formatters'
import { User } from '../user'
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
    name: string,
    email: string,
    subject: string,
    text: string,
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
            name: name,
            address: email,
          },
        ],
        subject: subject,
        text: text,
        html: text,
        attachments: attachments,
      })
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error)
      return {
        address: email,
        success: false,
      }
    }

    return {
      address: email,
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
        (sent, recipient) => sent || recipient.success,
        false,
      ),
      notification,
    }
  }

  private async sendHeadsUpSms(
    existingCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    const smsText = formatHeadsUpNotification(
      existingCase.prosecutor?.name || user.name,
      existingCase.arrestDate,
      existingCase.requestedCourtDate,
    )

    const recipient = await this.sendSms(smsText)

    return this.recordNotification(existingCase.id, NotificationType.HEADS_UP, [
      recipient,
    ])
  }

  private sendReadyForCourtSms(
    existingCase: Case,
    user: User,
  ): Promise<Recipient> {
    const smsText = formatReadyForCourtSmsNotification(
      existingCase.prosecutor?.name || user.name,
      existingCase.court,
    )

    return this.sendSms(smsText)
  }

  private async sendReadyForCourtEmail(existingCase: Case): Promise<Recipient> {
    const pdf = await generateRequestPdf(existingCase)

    const subject = `Krafa í máli ${existingCase.policeCaseNumber}`
    const text = 'Sjá viðhengi'
    const attachments = [
      {
        filename: `${existingCase.policeCaseNumber}.pdf`,
        content: pdf,
        encoding: 'binary',
      },
    ]

    return this.sendEmail(
      existingCase.prosecutor?.name,
      existingCase.prosecutor?.email,
      subject,
      text,
      attachments,
    )
  }

  private async sendReadyForCourtNotifications(
    existingCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    const recipients = await Promise.all([
      this.sendReadyForCourtEmail(existingCase),
      this.sendReadyForCourtSms(existingCase, user),
    ])

    return this.recordNotification(
      existingCase.id,
      NotificationType.READY_FOR_COURT,
      recipients,
    )
  }

  private async sendCourtDateEmail(
    existingCase: Case,
  ): Promise<SendNotificationResponse> {
    const subject = `Fyrirtaka í máli ${existingCase.policeCaseNumber}`
    const text = formatCourtDateNotification(
      existingCase.court,
      existingCase.courtDate,
      existingCase.courtRoom,
    )

    const recipient = await this.sendEmail(
      existingCase.prosecutor?.name,
      existingCase.prosecutor?.email,
      subject,
      text,
    )

    return this.recordNotification(
      existingCase.id,
      NotificationType.COURT_DATE,
      [recipient],
    )
  }

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
        return this.sendHeadsUpSms(existingCase, user)
      case NotificationType.READY_FOR_COURT:
        return this.sendReadyForCourtNotifications(existingCase, user)
      case NotificationType.COURT_DATE:
        return this.sendCourtDateEmail(existingCase)
    }
  }
}
