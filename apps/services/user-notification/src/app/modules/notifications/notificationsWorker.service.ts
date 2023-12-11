import { User } from '@island.is/auth-nest-tools'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { UserProfile, UserProfileApi } from '@island.is/clients/user-profile'
import { EmailService, Message } from '@island.is/email-service'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { InjectWorker, WorkerService } from '@island.is/message-queue'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { join } from 'path'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'
import { MessageProcessorService } from './messageProcessor.service'
import { NotificationDispatchService } from './notificationDispatch.service'
import { NotificationsService } from './notifications.service'
import { HnippTemplate } from './dto/hnippTemplate.response'

export const IS_RUNNING_AS_WORKER = Symbol('IS_NOTIFICATION_WORKER')

type HandleNotification = {
  profile: UserProfile
  messageId: string
  message: CreateHnippNotificationDto
}

@Injectable()
export class NotificationsWorkerService implements OnApplicationBootstrap {
  constructor(
    private readonly notificationDispatch: NotificationDispatchService,
    private readonly messageProcessor: MessageProcessorService,
    private readonly notificationsService: NotificationsService,
    private readonly userProfileApi: UserProfileApi,
    private readonly nationalRegistryService: NationalRegistryV3ClientService,
    private readonly featureFlagService: FeatureFlagService,

    @InjectWorker('notifications')
    private readonly worker: WorkerService,

    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,

    @Inject(IS_RUNNING_AS_WORKER)
    private readonly isRunningAsWorker: boolean,

    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) {}

  onApplicationBootstrap() {
    if (this.isRunningAsWorker) {
      this.run()
    }
  }

  async handleDocumentNotification({
    profile,
    messageId,
    message,
  }: HandleNotification) {
    // don't send message unless user wants this type of notification
    if (!profile.documentNotifications) {
      this.logger.info(
        'User does not have notifications enabled this message type',
        { messageId },
      )

      return
    }

    this.logger.info('User has notifications enabled this message type', {
      messageId,
    })

    const notification = await this.messageProcessor.convertToNotification(
      message,
      profile,
    )

    await this.notificationDispatch.sendPushNotification({
      nationalId: profile.nationalId,
      notification,
      messageId,
    })
  }

  createEmail({
    isEnglish,
    profile,
    template,
    formattedTemplate,
    fullName,
  }: {
    isEnglish: boolean
    profile: UserProfile
    template: HnippTemplate
    formattedTemplate: HnippTemplate
    fullName: string
  }): Message {
    return {
      from: {
        name: 'Ísland.is',
        address: 'no-reply@island.is',
      },
      to: {
        name: fullName,
        address: profile.email,
      },
      subject: template.notificationTitle,
      template: {
        title: template.notificationTitle,
        body: [
          {
            component: 'Image',
            context: {
              src: join(__dirname, `./assets/images/logo.jpg`),
              alt: 'Ísland.is logo',
            },
          },
          {
            component: 'Spacer',
          },
          {
            component: 'Heading',
            context: {
              copy: fullName
                ? isEnglish
                  ? `Hi ${fullName}`
                  : `Hæ ${fullName}`
                : formattedTemplate.notificationTitle,
            },
          },
          {
            component: 'Copy',
            context: {
              copy: formattedTemplate.notificationBody,
            },
          },
          {
            component: 'Spacer',
          },
          {
            component: 'Button',
            context: {
              copy: isEnglish ? 'Open mailbox' : 'Opna pósthólf',
              href:
                formattedTemplate.clickActionWeb ??
                'https://www.island.is/minarsidur/postholf',
            },
          },
          {
            component: 'Spacer',
          },
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
        ],
      },
    }
  }

  async handleEmailNotification({
    profile,
    message,
    messageId,
  }: HandleNotification): Promise<void> {
    const { nationalId } = profile

    const allowEmailNotification = await this.featureFlagService.getValue(
      Features.isNotificationEmailWorkerEnabled,
      false,
      { nationalId } as User,
    )

    if (!allowEmailNotification) {
      this.logger.info('Email notification worker is not enabled for user', {
        messageId,
      })

      return
    }

    // TODO: Add emailNotification check when ready
    if (!profile.email) {
      this.logger.info('User does not have email notifications enabled', {
        messageId,
      })

      return
    }

    const [template, individual] = await Promise.all([
      this.notificationsService.getTemplate(message.templateId, profile.locale),
      this.nationalRegistryService.getName(profile.nationalId),
    ])

    const fullName = individual?.fulltNafn ?? ''
    const isEnglish = profile.locale === 'en'

    const formattedTemplate = this.notificationsService.formatArguments(
      message.args,
      template,
    )

    try {
      const emailContent = this.createEmail({
        isEnglish,
        profile,
        template,
        formattedTemplate,
        fullName,
      })
      await this.emailService.sendEmail(emailContent)

      this.logger.info('Email notification sent', {
        messageId,
      })
    } catch (error) {
      this.logger.error('Email notification error', {
        error,
        messageId,
      })
    }
  }

  async run() {
    await this.worker.run<CreateHnippNotificationDto>(
      async (message, job): Promise<void> => {
        const messageId = job.id
        this.logger.info('Message received by worker ... ...', { messageId })

        const profile =
          await this.userProfileApi.userTokenControllerFindOneByNationalId({
            nationalId: message.recipient,
          })

        // can't send message if user has no user profile
        if (!profile) {
          this.logger.info('No user profile found for user', { messageId })

          return
        }

        this.logger.info('User found for message', { messageId })

        const handleNotificationArgs = {
          profile,
          messageId,
          message,
        }

        await Promise.all([
          this.handleDocumentNotification(handleNotificationArgs),
          this.handleEmailNotification(handleNotificationArgs),
        ])
      },
    )
  }
}
