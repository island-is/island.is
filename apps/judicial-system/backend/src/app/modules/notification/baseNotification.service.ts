import _uniqBy from 'lodash/uniqBy'

import { Injectable, InternalServerErrorException } from '@nestjs/common'

import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { EmailService } from '@island.is/email-service'
import type { Logger } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { NotificationType } from '@island.is/judicial-system/types'

import { stripHtmlTags } from '../../formatters'
import { notifications } from '../../messages'
import { EventService } from '../event'
import { DeliverResponse } from './models/deliver.response'
import { Notification, Recipient } from './models/notification.model'
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
    protected readonly config: ConfigType<typeof notificationModuleConfig>,
    protected readonly eventService: EventService,
    protected readonly logger: Logger,
  ) {
    this.logger.warn('IntlService ', {
      intlService,
      thisIntlService: this.intlService,
    })
  }

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

  protected async sendEmail(
    subject: string,
    html: string,
    recipientName?: string,
    recipientEmail?: string,
    attachments?: Attachment[],
    skipTail?: boolean,
  ): Promise<Recipient> {
    try {
      // This is to handle a comma separated list of emails
      // We use the first one as the main recipient and the rest as CC
      const recipients = recipientEmail ? recipientEmail.split(',') : undefined

      html =
        html.match(/<a/g) || skipTail
          ? html
          : `${html} ${this.formatMessage(notifications.emailTail)}`

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
    type: NotificationType,
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
}