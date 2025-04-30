import _uniqBy from 'lodash/uniqBy'

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
  INDICTMENTS_OVERVIEW_ROUTE,
  ROUTE_HANDLER_ROUTE,
} from '@island.is/judicial-system/consts'
import { applyDativeCaseToCourtName } from '@island.is/judicial-system/formatters'
import {
  CaseIndictmentRulingDecision,
  IndictmentCaseNotificationType,
  User,
} from '@island.is/judicial-system/types'

import {
  formatArraignmentDateEmailNotification,
  formatCourtCalendarInvitation,
  formatDefenderRoute,
  formatPostponedCourtDateEmailNotification,
} from '../../../../formatters'
import { notifications } from '../../../../messages'
import { Case, DateLog } from '../../../case'
import { CourtService } from '../../../court'
import { Defendant } from '../../../defendant'
import { EventService } from '../../../event'
import { BaseNotificationService } from '../../baseNotification.service'
import { DeliverResponse } from '../../models/deliver.response'
import { Notification, Recipient } from '../../models/notification.model'
import { notificationModuleConfig } from '../../notification.config'
import { strings } from './indictmentCaseNotification.strings'

interface Attachment {
  filename: string
  content: string
  encoding?: string
}

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
    private readonly courtService: CourtService,
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

  // Note: identical to CaseNotification.service.uploadEmailToCourt
  private async uploadEmailToCourt(
    theCase: Case,
    user: User,
    subject: string,
    body: string,
    recipients?: string,
  ): Promise<void> {
    try {
      await this.courtService.createEmail(
        user,
        theCase.id,
        theCase.courtId ?? '',
        theCase.courtCaseNumber ?? '',
        subject,
        body,
        recipients ?? '',
        this.config.email.fromEmail,
        this.config.email.fromName,
      )
    } catch (error) {
      // Tolerate failure, but log warning - use warning instead of error to avoid monitoring alerts
      this.logger.warn(
        `Failed to upload email to court for indictment case ${theCase.id}`,
        { error },
      )
    }
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

  // Note: redundant in other services
  private getCourtDateCalendarInvite = (
    theCase: Case,
    targetDateLog: DateLog,
  ) => {
    const { date: scheduledDate, location: courtRoom } = targetDateLog
    const { title, location, eventOrganizer } = formatCourtCalendarInvitation(
      theCase,
      courtRoom,
    )
    const calendarInvite = this.createICalAttachment({
      eventOrganizer,
      scheduledDate,
      title,
      location,
    })
    return calendarInvite
  }

  private sendArraignmentDateEmailNotification({
    theCase,
    user,
    arraignmentDateLog,
    recipientName,
    recipientEmail,
  }: {
    theCase: Case
    user: User
    arraignmentDateLog: DateLog
    recipientName: string
    recipientEmail: string
  }): Promise<Recipient> {
    const { subject, body } = formatArraignmentDateEmailNotification({
      formatMessage: this.formatMessage,
      courtName: theCase.court?.name,
      courtCaseNumber: theCase.courtCaseNumber,
      judgeName: theCase.judge?.name,
      registrarName: theCase.registrar?.name,
      arraignmentDateLog,
    })

    const calendarInvite = this.getCourtDateCalendarInvite(
      theCase,
      arraignmentDateLog,
    )

    return this.sendEmail({
      subject,
      html: body,
      recipientName,
      recipientEmail,
      attachments: calendarInvite ? [calendarInvite] : undefined,
    }).then((recipient) => {
      if (recipient.success) {
        // No need to wait
        this.uploadEmailToCourt(theCase, user, subject, body, recipientEmail)
      }

      return recipient
    })
  }

  private async sendPostponedCourtDateEmailNotification(
    theCase: Case,
    user: User,
    courtDate: DateLog,
    calendarInvite: Attachment | undefined,
    overviewUrl?: string,
    email?: string,
    name?: string,
  ): Promise<Recipient> {
    const { subject, body } = formatPostponedCourtDateEmailNotification(
      this.formatMessage,
      theCase,
      courtDate,
      overviewUrl,
    )

    return this.sendEmail({
      subject,
      html: body,
      recipientName: name,
      recipientEmail: email,
      attachments: calendarInvite && [calendarInvite],
      skipTail: Boolean(overviewUrl) === false,
    }).then((recipient) => {
      if (recipient.success) {
        // No need to wait
        this.uploadEmailToCourt(theCase, user, subject, body, email)
      }

      return recipient
    })
  }

  private sendCourtDateEmailNotification(
    theCase: Case,
    user: User,
  ): Promise<Recipient>[] {
    const arraignmentDate = DateLog.arraignmentDate(theCase.dateLogs)
    const promises: Promise<Recipient>[] = []

    // get only confirmed defenders
    const defenders = _uniqBy(
      theCase.defendants ?? [],
      (d: Defendant) => d.defenderEmail,
    )
      .map(
        ({
          defenderName,
          defenderEmail,
          defenderNationalId,
          isDefenderChoiceConfirmed,
        }) => ({
          defenderName,
          defenderEmail,
          defenderNationalId,
          isDefenderChoiceConfirmed,
        }),
      )
      .filter(({ isDefenderChoiceConfirmed }) => isDefenderChoiceConfirmed)

    if (arraignmentDate) {
      if (theCase.prosecutor) {
        // PROSECUTOR
        promises.push(
          this.sendArraignmentDateEmailNotification({
            theCase,
            user,
            arraignmentDateLog: arraignmentDate,
            recipientName: theCase.prosecutor?.name,
            recipientEmail: theCase.prosecutor?.email,
          }),
        )
      }
      // DEFENDER(s)
      defenders.forEach(({ defenderName, defenderEmail }) => {
        if (defenderName && defenderEmail) {
          promises.push(
            this.sendArraignmentDateEmailNotification({
              theCase,
              user,
              arraignmentDateLog: arraignmentDate,
              recipientName: defenderName,
              recipientEmail: defenderEmail,
            }),
          )
        }
      })
      return promises
    }
    const courtDate = DateLog.courtDate(theCase.dateLogs)
    if (!courtDate) {
      return []
    }

    const calendarInvite = this.getCourtDateCalendarInvite(theCase, courtDate)

    // PROSECUTOR
    promises.push(
      this.sendPostponedCourtDateEmailNotification(
        theCase,
        user,
        courtDate,
        calendarInvite,
        `${this.config.clientUrl}${INDICTMENTS_OVERVIEW_ROUTE}/${theCase.id}`,
        theCase.prosecutor?.email,
        theCase.prosecutor?.name,
      ),
    )

    // DEFENDER(s)
    defenders.forEach(({ defenderName, defenderEmail, defenderNationalId }) => {
      if (defenderEmail) {
        promises.push(
          this.sendPostponedCourtDateEmailNotification(
            theCase,
            user,
            courtDate,
            calendarInvite,
            defenderNationalId &&
              formatDefenderRoute(
                this.config.clientUrl,
                theCase.type,
                theCase.id,
              ),
            defenderEmail,
            defenderName,
          ),
        )
      }
    })
    return promises
  }

  private async sendCourtDateNotifications(
    theCase: Case,
    user?: User,
  ): Promise<DeliverResponse> {
    if (!user) {
      // Nothing happens
      return { delivered: true }
    }
    this.eventService.postEvent('SCHEDULE_COURT_DATE', theCase)

    const promises: Promise<Recipient>[] = this.sendCourtDateEmailNotification(
      theCase,
      user,
    )

    const recipients = await Promise.all(promises)
    const result = await this.recordNotification(
      theCase.id,
      IndictmentCaseNotificationType.COURT_DATE,
      recipients,
    )

    return result
  }

  private sendNotification(
    notificationType: IndictmentCaseNotificationType,
    theCase: Case,
    user?: User,
  ): Promise<DeliverResponse> {
    switch (notificationType) {
      case IndictmentCaseNotificationType.COURT_DATE:
        return this.sendCourtDateNotifications(theCase, user)
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
    user?: User,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()
    try {
      return await this.sendNotification(type, theCase, user)
    } catch (error) {
      this.logger.error('Failed to send indictment case notification', error)

      return { delivered: false }
    }
  }
}
