import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SmsService } from '@island.is/nova-sms'
import { EmailService } from '@island.is/email-service'
import { NotificationType } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import { User } from '../user'
import { Case } from '../case/models'
import { SendNotificationDto } from './sendNotification.dto'
import { Notification } from './notification.model'

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
  ) {
    // Production or local development with judge mobile number
    if (environment.production || environment.notifications.judgeMobileNumber) {
      await this.smsService.sendSms(
        environment.notifications.judgeMobileNumber,
        smsText,
      )
    }

    return this.notificationModel.create({
      caseId: caseId,
      type: notificationType,
      message: smsText,
    })
  }

  private sendHeadsUpNotification(
    existingCase: Case,
    user: User,
  ): Promise<Notification> {
    // Prosecutor
    const prosecutorText = ` Ákærandi: ${
      existingCase.prosecutor?.name || user.name
    }.`

    // Arrest date
    const arrestDate = existingCase.arrestDate?.toISOString()
    const arrestDateText = arrestDate
      ? ` Viðkomandi handtekinn ${arrestDate.substring(
          8,
          10,
        )}.${arrestDate.substring(5, 7)}.${arrestDate.substring(
          0,
          4,
        )} kl. ${arrestDate.substring(11, 13)}:${arrestDate.substring(14, 16)}.`
      : ''

    // Court date
    const courtDate = existingCase.requestedCourtDate?.toISOString()
    const courtDateText = courtDate
      ? ` ÓE fyrirtöku ${courtDate.substring(8, 10)}.${courtDate.substring(
          5,
          7,
        )}.${courtDate.substring(0, 4)} eftir kl. ${courtDate.substring(
          11,
          13,
        )}:${courtDate.substring(14, 16)}.`
      : ''

    const smsText = `Ný gæsluvarðhaldskrafa í vinnslu.${prosecutorText}${arrestDateText}${courtDateText}`

    return this.sendSms(existingCase.id, NotificationType.HEADS_UP, smsText)
  }

  private sendReadyForCourtNotification(
    existingCase: Case,
    user: User,
  ): Promise<Notification> {
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

  private sendCourtDateNotification(
    existingCase: Case,
    user: User,
  ): Promise<Notification> {
    return null
  }

  getAllCaseNotifications(existingCase: Case): Promise<Notification[]> {
    this.logger.debug(`Getting all notifications for case ${existingCase.id}`)

    return this.notificationModel.findAll({
      where: { caseId: existingCase.id },
      order: [['created', 'DESC']],
    })
  }

  async sendCaseNotification(
    notification: SendNotificationDto,
    existingCase: Case,
    user: User,
  ): Promise<Notification> {
    this.logger.debug(
      `Sending ${notification.type} notification for case ${existingCase.id}`,
    )

    switch (notification.type) {
      case NotificationType.HEADS_UP:
        return this.sendHeadsUpNotification(existingCase, user)
      case NotificationType.READY_FOR_COURT:
        return this.sendReadyForCourtNotification(existingCase, user)
      case NotificationType.COURT_DATE:
        return this.sendCourtDateNotification(existingCase, user)
    }
  }
}
