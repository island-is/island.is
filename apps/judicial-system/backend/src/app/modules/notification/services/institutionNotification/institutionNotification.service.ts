import addDays from 'date-fns/addDays'

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

import {
  CLOSED_INDICTMENT_OVERVIEW_ROUTE,
  INDICTMENTS_TO_REVIEW,
} from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { InstitutionNotificationType } from '@island.is/judicial-system/types'

import { nowFactory } from '../../../../factories'
import { InternalCaseService } from '../../../case'
import { EventService } from '../../../event'
import { Notification, type User } from '../../../repository'
import { UserService } from '../../../user'
import { BaseNotificationService } from '../../baseNotification.service'
import { DeliverResponse } from '../../models/deliver.response'
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

  private async sendPublicProsecutorVerdictAppealDeadlineReminderNotification(
    prosecutorsOfficeId: string,
  ) {
    const users = await this.userService.getProsecutorUsers(prosecutorsOfficeId)
    const targetDate = addDays(nowFactory(), 7)

    const emailPromises: Promise<unknown>[] = []
    for (const prosecutorUser of users) {
      const cases =
        await this.internalCaseService.getIndictmentCasesWithVerdictAppealDeadlineOnTargetDate(
          prosecutorUser.id,
          targetDate,
        )

      if (!cases.length) {
        continue
      }
      const areMultipleCases = cases.length > 1
      const courtCaseNumbers = cases
        .map((theCase) => theCase.courtCaseNumber)
        .join(', ')

      const redirectUrl = areMultipleCases
        ? INDICTMENTS_TO_REVIEW
        : `${CLOSED_INDICTMENT_OVERVIEW_ROUTE}/${cases[0].id}`
      const subject = 'Áminning um yfirlestur'
      const html = `Áminning um yfirlestur á mál${
        areMultipleCases ? 'um:' : 'i'
      } ${courtCaseNumbers}. Áfrýjunarfrestur er til ${formatDate(
        targetDate,
      )}. Sjá nánar í <a href="${
        this.config.clientUrl
      }${redirectUrl}">Réttarvörslugátt.</a>`

      const recipient = this.sendEmail({
        subject,
        html,
        recipientName: prosecutorUser.name,
        recipientEmail: prosecutorUser.email,
      })
      this.logger.info(
        `Public prosecutor verdict review reminder sent to ${prosecutorUser.id} for ${cases.length} cases`,
      )
      emailPromises.push(recipient)
    }
    return Promise.all(emailPromises)
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
        case InstitutionNotificationType.PUBLIC_PROSECUTOR_VERDICT_APPEAL_DEADLINE_REMINDER:
          await this.sendPublicProsecutorVerdictAppealDeadlineReminderNotification(
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
