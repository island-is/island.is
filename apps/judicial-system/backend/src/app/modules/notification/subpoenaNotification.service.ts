import { MessageDescriptor } from 'react-intl'

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

import { INDICTMENTS_COURT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import { NotificationType } from '@island.is/judicial-system/types'

import { EventService } from '../event'
import { Subpoena } from '../subpoena'
import { DeliverResponse } from './models/deliver.response'
import { Notification, Recipient } from './models/notification.model'
import { BaseNotificationService } from './baseNotification.service'
import { notificationModuleConfig } from './notification.config'
import { strings } from './subpoenaNotification.strings'

type SubpoenaNotificationType =
  | NotificationType.SERVICE_SUCCESSFUL
  | NotificationType.SERVICE_FAILED
  | NotificationType.DEFENDANT_SELECTED_DEFENDER

@Injectable()
export class SubpoenaNotificationService extends BaseNotificationService {
  constructor(
    @InjectModel(Notification)
    notificationModel: typeof Notification,
    @Inject(notificationModuleConfig.KEY)
    config: ConfigType<typeof notificationModuleConfig>,
    @Inject(LOGGER_PROVIDER) logger: Logger,
    intlService: IntlService,
    emailService: EmailService,
    eventService: EventService,
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

  private getEmailContents(notificationType: SubpoenaNotificationType): {
    subject: MessageDescriptor
    body: MessageDescriptor
  } {
    switch (notificationType) {
      case NotificationType.SERVICE_SUCCESSFUL:
        return {
          subject: strings.serviceSuccessfulSubject,
          body: strings.serviceSuccessfulBody,
        }
      case NotificationType.SERVICE_FAILED:
        return {
          subject: strings.serviceFailedSubject,
          body: strings.serviceFailedBody,
        }
      case NotificationType.DEFENDANT_SELECTED_DEFENDER:
        return {
          subject: strings.defendantSelectedDefenderSubject,
          body: strings.defendantSelectedDefenderBody,
        }
      default:
        throw new InternalServerErrorException('Email contents not found')
    }
  }

  private async sendSubpoenaNotification(
    notificationType: SubpoenaNotificationType,
    subpoena: Subpoena,
  ): Promise<unknown> {
    const theCase = subpoena.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    const hasSentSuccessfulServiceNotification = Boolean(
      this.hasSentNotification(
        NotificationType.SERVICE_SUCCESSFUL,
        theCase.notifications,
      ) && notificationType === NotificationType.SERVICE_SUCCESSFUL,
    )

    const hasSentFailedServiceNotification = Boolean(
      this.hasSentNotification(
        NotificationType.SERVICE_FAILED,
        theCase.notifications,
      ) && notificationType === NotificationType.SERVICE_FAILED,
    )

    const hasSendDefendantSelectedDefenderNotification = Boolean(
      this.hasSentNotification(
        NotificationType.DEFENDANT_SELECTED_DEFENDER,
        theCase.notifications,
      ) && notificationType === NotificationType.DEFENDANT_SELECTED_DEFENDER,
    )

    if (
      hasSentSuccessfulServiceNotification ||
      hasSentFailedServiceNotification ||
      hasSendDefendantSelectedDefenderNotification
    ) {
      return
    }

    await this.refreshFormatMessage()

    const emailContents = this.getEmailContents(notificationType)

    const formattedSubject = this.formatMessage(emailContents.subject, {
      courtCaseNumber: theCase.courtCaseNumber,
    })

    const formattedBody = this.formatMessage(emailContents.body, {
      courtCaseNumber: theCase.courtCaseNumber,
      linkStart: `<a href="${this.config.clientUrl}${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${theCase.id}">`,
      linkEnd: '</a>',
    })

    return this.sendEmails(
      theCase.id,
      notificationType,
      formattedSubject,
      formattedBody,
      theCase.judge?.name,
      theCase.judge?.email,
      theCase.registrar?.name,
      theCase.registrar?.email,
    )
  }

  private async sendEmails(
    caseId: string,
    notificationType: SubpoenaNotificationType,
    subject: string,
    body: string,
    judgeName?: string,
    judgeEmail?: string,
    registrarName?: string,
    registrarEmail?: string,
  ) {
    const promises: Promise<Recipient>[] = []

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

    return this.recordNotification(caseId, notificationType, recipients)
  }

  async sendNotification(
    type: NotificationType,
    subpoena: Subpoena,
  ): Promise<DeliverResponse> {
    try {
      await this.sendSubpoenaNotification(
        type as SubpoenaNotificationType,
        subpoena,
      )
    } catch (error) {
      this.logger.error('Failed to send notification', error)

      return { delivered: false }
    }

    return { delivered: true }
  }
}
