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

import { ROUTE_HANDLER_ROUTE } from '@island.is/judicial-system/consts'
import { applyDativeCaseToCourtName } from '@island.is/judicial-system/formatters'
import {
  CaseIndictmentRulingDecision,
  IndictmentCaseNotificationType,
} from '@island.is/judicial-system/types'

import { notifications } from '../../../../messages'
import { Case } from '../../../case'
import { EventService } from '../../../event'
import { BaseNotificationService } from '../../baseNotification.service'
import { DeliverResponse } from '../../models/deliver.response'
import { Notification, Recipient } from '../../models/notification.model'
import { notificationModuleConfig } from '../../notification.config'
import { strings } from './indictmentCaseNotification.strings'

@Injectable()
export class IndictmentCaseNotificationService extends BaseNotificationService {
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

  private async sendEmails(
    theCase: Case,
    notificationType: IndictmentCaseNotificationType,
    subject: string,
    body: string,
    to: { name?: string; email?: string }[],
  ) {
    const promises: Promise<Recipient>[] = []

    for (const recipient of to) {
      if (recipient.email && recipient.name) {
        promises.push(
          this.sendEmail({
            subject,
            html: body,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            attachments: undefined,
            skipTail: true,
          }),
        )
      }
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(theCase.id, notificationType, recipients)
  }

  private async sendVerdictInfoNotification(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const institutionId = theCase.prosecutor?.institution?.id
    const institutionEmail =
      (institutionId &&
        this.config.email.policeInstitutionEmails[institutionId]) ??
      undefined

    const hasRuling =
      theCase.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING

    if (!institutionEmail || !hasRuling) {
      // institution does not want to receive these emails or the case does not have a ruling
      return { delivered: true }
    }

    const formattedSubject = this.formatMessage(
      strings.indictmentCompletedWithRuling.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )

    const formattedBody = this.formatMessage(
      strings.indictmentCompletedWithRuling.body,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        policeCaseNumber:
          theCase.policeCaseNumbers.length > 0
            ? theCase.policeCaseNumbers[0]
            : '',
        courtName: applyDativeCaseToCourtName(theCase.court?.name || ''),
        serviceRequirement:
          theCase.defendants && theCase.defendants[0].serviceRequirement,
        caseOrigin: theCase.origin,
      },
    )

    return this.sendEmails(
      theCase,
      IndictmentCaseNotificationType.INDICTMENT_VERDICT_INFO,
      formattedSubject,
      formattedBody,
      [
        {
          name: theCase.prosecutor?.institution?.name,
          email: institutionEmail,
        },
      ],
    )
  }

  private async sendCriminalRecordFilesUploadedNotification(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const formattedSubject = this.formatMessage(
      strings.criminalRecordFilesUploadedEmail.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )
    const courtName =
      theCase.court && theCase.court.name ? theCase.court.name : undefined

    const formattedBody = this.formatMessage(
      strings.criminalRecordFilesUploadedEmail.body,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        courtName: applyDativeCaseToCourtName(courtName || 'héraðsdómi'),
        linkStart: `<a href="${this.config.clientUrl}${ROUTE_HANDLER_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    return this.sendEmails(
      theCase,
      IndictmentCaseNotificationType.CRIMINAL_RECORD_FILES_UPLOADED,
      formattedSubject,
      formattedBody,
      [
        {
          name: this.formatMessage(
            notifications.emailNames.publicProsecutorCriminalRecords,
          ),
          email: this.config.email.publicProsecutorCriminalRecordsEmail,
        },
      ],
    )
  }

  private sendNotification(
    notificationType: IndictmentCaseNotificationType,
    theCase: Case,
  ): Promise<DeliverResponse> {
    switch (notificationType) {
      case IndictmentCaseNotificationType.INDICTMENT_VERDICT_INFO:
        return this.sendVerdictInfoNotification(theCase)
      case IndictmentCaseNotificationType.CRIMINAL_RECORD_FILES_UPLOADED:
        return this.sendCriminalRecordFilesUploadedNotification(theCase)

      default:
        throw new InternalServerErrorException(
          `Invalid indictment notification type: ${notificationType}`,
        )
    }
  }

  async sendIndictmentCaseNotification(
    type: IndictmentCaseNotificationType,
    theCase: Case,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()
    try {
      return await this.sendNotification(type, theCase)
    } catch (error) {
      this.logger.error('Failed to send indictment case notification', error)

      return { delivered: false }
    }
  }
}
