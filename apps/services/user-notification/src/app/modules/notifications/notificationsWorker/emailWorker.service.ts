import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { join } from 'path'

import { Body, EmailService, Message } from '@island.is/email-service'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  InjectQueue,
  InjectWorker,
  QueueService,
  WorkerService,
} from '@island.is/message-queue'
import { type ConfigType } from '@island.is/nest/config'

import { UserNotificationsConfig } from '../../../../config'
import { HnippTemplate } from '../dto/hnippTemplate.response'
import { NotificationDelivery } from '../notification-delivery.model'

export type EmailQueueMessage = {
  messageId: string
  notificationId?: number
  recipientEmail: string
  fullName: string
  isEnglish: boolean
  formattedTemplate: HnippTemplate
  subjectId?: string
}

@Injectable()
export class EmailWorkerService {
  constructor(
    private readonly emailService: EmailService,

    @InjectWorker('notifications-email')
    private readonly worker: WorkerService,

    @InjectQueue('notifications-email')
    private readonly queue: QueueService,

    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,

    @Inject(UserNotificationsConfig.KEY)
    private readonly config: ConfigType<typeof UserNotificationsConfig>,

    @InjectModel(NotificationDelivery)
    private readonly notificationDeliveryModel: typeof NotificationDelivery,
  ) {}

  private getClickActionUrl(
    formattedTemplate: HnippTemplate,
    subjectId?: string,
  ): string {
    if (!formattedTemplate.clickActionUrl) {
      return ''
    }

    if (!subjectId) {
      return formattedTemplate.clickActionUrl
    }

    const shouldUseThirdPartyLogin = formattedTemplate.clickActionUrl.includes(
      this.config.servicePortalClickActionUrl,
    )

    return shouldUseThirdPartyLogin
      ? `${
          this.config.servicePortalBffLoginUrl
        }?login_hint=${subjectId}&target_link_uri=${encodeURI(
          formattedTemplate.clickActionUrl,
        )}`
      : formattedTemplate.clickActionUrl
  }

  private createEmail({
    isEnglish,
    recipientEmail,
    formattedTemplate,
    fullName,
    subjectId,
  }: {
    isEnglish: boolean
    recipientEmail: string
    formattedTemplate: HnippTemplate
    fullName: string
    subjectId?: string
  }): Message {
    const generateBody = (): Body[] => {
      return [
        {
          component: 'Image',
          context: {
            src: join(__dirname, `./assets/images/island-2x-logo.png`),
            alt: 'Ísland.is logo',
          },
        },
        {
          component: 'Tag',
          context: {
            label: fullName,
          },
        },
        {
          component: 'Heading',
          context: {
            copy: formattedTemplate.title,
          },
        },
        {
          component: 'Copy',
          context: {
            copy: formattedTemplate.externalBody,
          },
        },
        {
          component: 'Spacer',
        },
        ...(formattedTemplate.clickActionUrl
          ? [
              {
                component: 'ImageWithLink',
                context: {
                  src: join(
                    __dirname,
                    `./assets/images/${
                      isEnglish ? 'en' : 'is'
                    }-button-open.png`,
                  ),
                  alt: isEnglish ? 'Open mailbox' : 'Opna Pósthólf',
                  href: this.getClickActionUrl(formattedTemplate, subjectId),
                },
              },
              {
                component: 'Spacer',
              },
            ]
          : [null]),
        {
          component: 'TextWithLink',
          context: {
            small: true,
            preText: isEnglish ? 'In settings on ' : 'Í stillingum á ',
            linkHref: 'https://www.island.is/minarsidur/min-gogn/stillingar/',
            linkLabel: 'Ísland.is',
            postText: isEnglish
              ? ', you can decide if you want to be notified or not.'
              : ' getur þú ákveðið hvort hnippt er í þig.',
          },
        },
      ].filter((item) => item !== null) as Body[]
    }

    return {
      from: {
        name: 'Ísland.is',
        address: this.config.emailFromAddress,
      },
      to: {
        name: fullName,
        address: recipientEmail,
      },
      subject: formattedTemplate.title,
      template: {
        title: formattedTemplate.title,
        body: generateBody(),
      },
    }
  }

  public async run() {
    await this.worker.run<EmailQueueMessage>(
      async (message): Promise<void> => {
        const {
          messageId,
          recipientEmail,
          fullName,
          isEnglish,
          formattedTemplate,
          subjectId,
        } = message

        this.logger.info('Email worker received message', { messageId })

        const emailContent = this.createEmail({
          formattedTemplate,
          isEnglish,
          recipientEmail,
          fullName,
          subjectId,
        })

        await this.emailService.sendEmail(emailContent)

        this.logger.info('Email notification sent', { messageId })

        try {
          await this.notificationDeliveryModel.create({
            messageId,
            channel: 'email',
          })
        } catch (error) {
          this.logger.error('Error writing email delivery record to db', {
            error,
            messageId,
          })
        }
      },
    )
  }
}
