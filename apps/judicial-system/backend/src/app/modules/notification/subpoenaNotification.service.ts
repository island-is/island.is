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

import { CaseService } from '../case'
import { EventService } from '../event'
import { SubpoenaService } from '../subpoena'
import { DeliverResponse } from './models/deliver.response'
import { Notification, Recipient } from './models/notification.model'
import { BaseNotificationService } from './baseNotification.service'
import { notificationModuleConfig } from './notification.config'
import { strings } from './subpoenaNotification.strings'

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
    private readonly caseService: CaseService,
    private readonly subpoenaService: SubpoenaService,
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

  private async sendServiceSuccessfulNotification(
    subpoenaId?: string,
  ): Promise<unknown> {
    if (!subpoenaId) {
      return
    }

    const subpoena = await this.subpoenaService.findBySubpoenaId(subpoenaId)
    const theCase = await this.caseService.findById(subpoena.caseId)

    if (!theCase.id) {
      throw new InternalServerErrorException(`Case not found`)
    }

    if (!theCase.courtCaseNumber || !theCase.id) {
      throw new InternalServerErrorException(
        `Unable to find courtCaseNumber for case ${theCase.id}`,
      )
    }

    await this.refreshFormatMessage()

    const subject = this.formatMessage(strings.serviceSuccessfulSubject, {
      courtCaseNumber: theCase.courtCaseNumber,
    })

    const body = this.formatMessage(strings.serviceSuccessfulBody, {
      courtCaseNumber: theCase.courtCaseNumber,
      linkStart: `<a href="${this.config.clientUrl}${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${theCase.id}">`,
      linkEnd: '</a>',
    })

    return this.sendEmails(
      subject,
      body,
      theCase.judge?.name,
      theCase.judge?.email,
      theCase.registrar?.name,
      theCase.registrar?.email,
    )
  }

  private async sendServiceFailedNotification(
    subpoenaId?: string,
  ): Promise<unknown> {
    if (!subpoenaId) {
      return
    }

    const subpoena = await this.subpoenaService.findBySubpoenaId(subpoenaId)
    const theCase = await this.caseService.findById(subpoena.caseId)

    if (!theCase.id) {
      throw new InternalServerErrorException(`Case not found`)
    }

    if (!theCase.courtCaseNumber || !theCase.id) {
      throw new InternalServerErrorException(
        `Unable to find courtCaseNumber for case ${theCase.id}`,
      )
    }

    await this.refreshFormatMessage()

    const subject = this.formatMessage(strings.serviceFailedSubject, {
      courtCaseNumber: theCase.courtCaseNumber,
    })

    const body = this.formatMessage(strings.serviceFailedBody, {
      courtCaseNumber: theCase.courtCaseNumber,
      linkStart: `<a href="${this.config.clientUrl}${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${theCase.id}">`,
      linkEnd: '</a>',
    })

    return this.sendEmails(
      subject,
      body,
      theCase.judge?.name,
      theCase.judge?.email,
      theCase.registrar?.name,
      theCase.registrar?.email,
    )
  }

  private async sendDefendantSelectedDefenderNotification(
    subpoenaId?: string,
  ): Promise<unknown> {
    if (!subpoenaId) {
      return
    }

    const subpoena = await this.subpoenaService.findBySubpoenaId(subpoenaId)
    const theCase = await this.caseService.findById(subpoena.caseId)

    if (!theCase.id) {
      throw new InternalServerErrorException(`Case not found`)
    }

    if (!theCase.courtCaseNumber || !theCase.id) {
      throw new InternalServerErrorException(
        `Unable to find courtCaseNumber for case ${theCase.id}`,
      )
    }

    await this.refreshFormatMessage()

    const subject = this.formatMessage(
      strings.defendantSelectedDefenderSubject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )

    const body = this.formatMessage(strings.defendantSelectedDefenderBody, {
      courtCaseNumber: theCase.courtCaseNumber,
      linkStart: `<a href="${this.config.clientUrl}${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${theCase.id}">`,
      linkEnd: '</a>',
    })

    return this.sendEmails(
      subject,
      body,
      theCase.judge?.name,
      theCase.judge?.email,
      theCase.registrar?.name,
      theCase.registrar?.email,
    )
  }

  private sendEmails(
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

    return Promise.all(promises)
  }

  async sendNotification(
    type: NotificationType,
    subpoenaId?: string,
  ): Promise<DeliverResponse> {
    try {
      switch (type) {
        case NotificationType.SERVICE_SUCCESSFUL:
          await this.sendServiceSuccessfulNotification(subpoenaId)
          break
        case NotificationType.SERVICE_FAILED:
          await this.sendServiceFailedNotification(subpoenaId)
          break
        case NotificationType.DEFENDANT_SELECTED_DEFENDER:
          await this.sendDefendantSelectedDefenderNotification(subpoenaId)
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
