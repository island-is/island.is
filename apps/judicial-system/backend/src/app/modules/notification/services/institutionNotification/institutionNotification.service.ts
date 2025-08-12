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

import { InstitutionNotificationType } from '@island.is/judicial-system/types'

import { InternalCaseService } from '../../../case'
import { EventService } from '../../../event'
import { type User, UserService } from '../../../user'
import { BaseNotificationService } from '../../baseNotification.service'
import { DeliverResponse } from '../../models/deliver.response'
import { Notification } from '../../models/notification.model'
import { notificationModuleConfig } from '../../notification.config'
import { strings } from './institutionNotification.strings'

@Injectable()
export class InstitutionNotificationService extends BaseNotificationService {
  constructor(
    @InjectModel(Notification)
    notificationModel: typeof Notification,
    @Inject(notificationModuleConfig.KEY)
    config: ConfigType<typeof notificationModuleConfig>,
    @Inject(LOGGER_PROVIDER) logger: Logger,
    intlService: IntlService,
    emailService: EmailService,
    eventService: EventService,
    private readonly internalCaseService: InternalCaseService,
    private readonly userService: UserService,
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

  private async sendIndictmentsWaitingForConfirmationNotification(
    prosecutorsOfficeId: string,
  ): Promise<unknown> {
    const count =
      await this.internalCaseService.countIndictmentsWaitingForConfirmation(
        prosecutorsOfficeId,
      )

    if (count === 0) {
      return
    }

    const recipients = await this.userService.getUsersWhoCanConfirmIndictments(
      prosecutorsOfficeId,
    )

    if (recipients.length === 0) {
      return
    }

    await this.refreshFormatMessage()

    const subject = this.formatMessage(strings.waitingForConfirmation.subject)
    const body = this.formatMessage(strings.waitingForConfirmation.body, {
      count,
    })
    const tail = this.formatMessage(strings.tail, {
      linkStart: `<a href="${this.config.clientUrl}">`,
      linkEnd: '</a>',
    })

    return Promise.all(
      recipients.map((recipient: User) =>
        this.sendEmail({
          subject,
          html: `${body}<br /><br />${tail}`,
          recipientName: recipient.name,
          recipientEmail: recipient.email,
        }),
      ),
    )
  }

  async sendNotification(
    type: InstitutionNotificationType,
    prosecutorsOfficeId: string,
  ): Promise<DeliverResponse> {
    try {
      switch (type) {
        case InstitutionNotificationType.INDICTMENTS_WAITING_FOR_CONFIRMATION:
          await this.sendIndictmentsWaitingForConfirmationNotification(
            prosecutorsOfficeId,
          )
          break
        default:
          throw new InternalServerErrorException(
            `Invalid notification type ${type}`,
          )
      }
    } catch (error) {
      this.logger.error('Failed to send notification', error)

      return { delivered: false }
    }

    return { delivered: true }
  }
}
