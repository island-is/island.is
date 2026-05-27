import { ICalendar } from 'datebook'

import { Injectable, InternalServerErrorException } from '@nestjs/common'

import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { EmailService } from '@island.is/email-service'
import type { Logger } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import {
  TrackedNotificationType,
  UserDescriptor,
} from '@island.is/judicial-system/types'

import {
  filterWhitelistEmails,
  formatArraignmentDateEmailNotification,
  formatCourtCalendarInvitation,
  stripHtmlTags,
} from '../../formatters'
import { notifications } from '../../messages'
import { CourtService } from '../court'
import { EventService } from '../event'
import { Case, DateLog, Notification, Recipient } from '../repository'
import { DeliverResponse } from './models/deliver.response'
import { notificationModuleConfig } from './notification.config'

interface Attachment {
  filename: string
  content: string
  encoding?: string
}

@Injectable()
export abstract class BaseNotificationService {
  constructor(
    private readonly notificationModel: typeof Notification,
    private readonly emailService: EmailService,
    private readonly intlService: IntlService,
    private readonly courtService: CourtService,
    protected readonly config: ConfigType<typeof notificationModuleConfig>,
    protected readonly eventService: EventService,
    protected readonly logger: Logger,
  ) {}

  protected formatMessage: FormatMessage = () => {
    throw new InternalServerErrorException('Format message not initialized')
  }

  protected async refreshFormatMessage(): Promise<void> {
    return this.intlService
      .useIntl(['judicial.system.backend'], 'is')
      .then((res) => {
        this.formatMessage = res.formatMessage
      })
      .catch((reason) => {
        this.logger.error('Unable to refresh format messages', { reason })
      })
  }

  private async handleWhitelist(recipients: string[]): Promise<string[]> {
    const whitelist = this.formatMessage(notifications.emailWhitelist)
    const whitelistDomains = this.formatMessage(
      notifications.emailWhitelistDomains,
    )

    const whitelistedEmails = filterWhitelistEmails(
      recipients,
      whitelistDomains,
      whitelist,
    )

    if (whitelistedEmails.length === 0) {
      this.logger.warn('No whitelisted emails found in recipients')
    }

    if (whitelistedEmails.length !== recipients?.length) {
      this.logger.warn('Some emails missing from whitelist')
    }

    return whitelistedEmails
  }

  protected async sendEmail({
    subject,
    html,
    recipientName,
    recipientEmail,
    attachments,
    skipTail,
  }: {
    subject: string
    html: string
    recipientName?: string
    recipientEmail?: string
    attachments?: Attachment[]
    skipTail?: boolean
  }): Promise<Recipient> {
    try {
      // This is to handle a comma separated list of emails
      // We use the first one as the main recipient and the rest as CC
      let recipients = recipientEmail ? recipientEmail.split(',') : undefined

      if (this.config.shouldUseWhitelist && recipients) {
        recipients = await this.handleWhitelist(recipients)
      }

      html =
        html.match(/<a/g) || skipTail
          ? html
          : `${html} ${this.formatMessage(notifications.emailTail, {
              linkStart: `<a href="${this.config.clientUrl}">`,
              linkEnd: '</a>',
            })}`

      await this.emailService.sendEmail({
        from: {
          name: this.config.email.fromName,
          address: this.config.email.fromEmail,
        },
        replyTo: {
          name: this.config.email.replyToName,
          address: this.config.email.replyToEmail,
        },
        to: [
          {
            name: recipientName ?? '',
            address: recipients ? recipients[0] : '',
          },
        ],
        cc:
          recipients && recipients.length > 1 ? recipients.slice(1) : undefined,
        subject,
        text: stripHtmlTags(html),
        html: html,
        attachments,
      })
    } catch (error) {
      this.logger.error('Failed to send email', { error })

      this.eventService.postErrorEvent(
        'Failed to send email',
        {
          subject,
          to: `${recipientName} (${recipientEmail})`,
          attachments:
            attachments && attachments.length > 0
              ? attachments.reduce(
                  (acc, attachment, index) =>
                    index > 0
                      ? `${acc}, ${attachment.filename}`
                      : `${attachment.filename}`,
                  '',
                )
              : undefined,
        },
        error as Error,
      )

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

  protected async recordNotification(
    caseId: string,
    type: TrackedNotificationType,
    recipients: Recipient[],
  ): Promise<DeliverResponse> {
    await this.notificationModel.create({
      caseId,
      type,
      recipients,
    })

    return {
      delivered: recipients.reduce(
        (sent, recipient) => sent || recipient.success,
        false as boolean,
      ),
    }
  }

  protected hasSentNotification(
    type: TrackedNotificationType,
    notifications?: Notification[],
  ) {
    return notifications?.some((notification) => notification.type === type)
  }

  protected hasReceivedNotification(
    type?: TrackedNotificationType | TrackedNotificationType[],
    address?: string,
    notifications?: Notification[],
  ) {
    const types = type ? [type].flat() : Object.values(TrackedNotificationType)

    return notifications?.some((notification) => {
      return (
        types.includes(notification.type) &&
        notification.recipients.some(
          (recipient) => recipient.address === address && recipient.success,
        )
      )
    })
  }

  protected createICalAttachment({
    scheduledDate,
    eventOrganizer,
    location,
    title,
  }: {
    scheduledDate: Date
    eventOrganizer: { name: string; email: string }
    location: string
    title: string
  }): Attachment | undefined {
    const start = new Date(scheduledDate.toString().split('.')[0])
    const end = new Date(scheduledDate.getTime() + 30 * 60000)

    const icalendar = new ICalendar({
      title,
      location,
      start,
      end,
    })

    return {
      filename: 'court-date.ics',
      content: icalendar
        .addProperty(
          `ORGANIZER;CN=${eventOrganizer.name}`,
          `MAILTO:${eventOrganizer.email}`,
        )
        .render(),
    }
  }

  protected getCourtDateCalendarInvite = (
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

  protected async uploadEmailToCourt(
    theCase: Case,
    user: UserDescriptor,
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
        `Failed to upload email to court for case ${theCase.id}`,
        { error },
      )
    }
  }

  protected async sendArraignmentDateEmailNotification({
    theCase,
    user,
    arraignmentDateLog,
    recipientName,
    recipientEmail,
  }: {
    theCase: Case
    user: UserDescriptor
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
}
