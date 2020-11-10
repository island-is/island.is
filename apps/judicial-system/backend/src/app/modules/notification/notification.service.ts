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
  generateRequestPdf,
} from '../../formatters'

import { User } from '../user'
import { Case } from '../case/models'
import { SendNotificationDto } from './dto'
import { Notification, SendNotificationResponse } from './models'
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

  private async sendSms(
    caseId: string,
    notificationType: NotificationType,
    smsText: string,
  ): Promise<SendNotificationResponse> {
    // Production or local development with judge mobile number
    if (environment.production || environment.notifications.judgeMobileNumber) {
      try {
        await this.smsService.sendSms(
          environment.notifications.judgeMobileNumber,
          smsText,
        )
      } catch (error) {
        return { notificationSent: false }
      }
    }

    const notification = await this.notificationModel.create({
      caseId: caseId,
      type: notificationType,
      message: smsText,
    })

    return { notificationSent: true, notification }
  }

  private sendEmail(
    name: string,
    email: string,
    subject: string,
    text: string,
    attachments: {
      filename: string
      content: string
      encoding: string
    }[] = null,
  ): Promise<string> {
    return this.emailService.sendEmail({
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
  }

  private sendHeadsUpSms(
    existingCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    const smsText = formatHeadsUpNotification(
      existingCase.prosecutor?.name || user.name,
      existingCase.arrestDate,
      existingCase.requestedCourtDate,
    )

    return this.sendSms(existingCase.id, NotificationType.HEADS_UP, smsText)
  }

  private sendReadyForCourtSms(
    existingCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    // Prosecutor
    const prosecutorText = ` Ákærandi: ${
      existingCase.prosecutor?.name || user.name
    }.`

    // Court
    const courtText = ` Dómstóll: ${existingCase.court}.`

    const smsText = `Gæsluvarðhaldskrafa tilbúin til afgreiðslu.${prosecutorText}${courtText}`

    return this.sendSms(
      existingCase.id,
      NotificationType.READY_FOR_COURT,
      smsText,
    )
  }

  private async sendReadyForCourtEmail(existingCase: Case): Promise<void> {
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

    await this.sendEmail(
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
    await this.sendReadyForCourtEmail(existingCase)

    return this.sendReadyForCourtSms(existingCase, user)
  }

  private async sendCourtDateEmail(
    existingCase: Case,
    user: User,
  ): Promise<SendNotificationResponse> {
    const subject = `Fyrirtaka í máli ${existingCase.policeCaseNumber}`
    const text = formatCourtDateNotification(
      existingCase.court,
      existingCase.courtDate,
      existingCase.courtRoom,
    )

    await this.sendEmail(
      existingCase.prosecutor?.name,
      existingCase.prosecutor?.email,
      subject,
      text,
    )

    return { notificationSent: true }
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
        return this.sendCourtDateEmail(existingCase, user)
    }
  }
}
