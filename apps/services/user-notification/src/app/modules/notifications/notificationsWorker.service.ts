import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { join } from 'path'
import { InjectModel } from '@nestjs/sequelize'

import { User } from '@island.is/auth-nest-tools'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { UserProfileDto, V2UsersApi } from '@island.is/clients/user-profile'
import { EmailService, Message } from '@island.is/email-service'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { InjectWorker, WorkerService } from '@island.is/message-queue'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

import { MessageProcessorService } from './messageProcessor.service'
import { NotificationDispatchService } from './notificationDispatch.service'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'
import { NotificationsService } from './notifications.service'
import { HnippTemplate } from './dto/hnippTemplate.response'
import { Notification } from './notification.model'

export const IS_RUNNING_AS_WORKER = Symbol('IS_NOTIFICATION_WORKER')
const WORK_STARTING_HOUR = 8 // 8 AM
const WORK_ENDING_HOUR = 23 // 11 PM

type HandleNotification = {
  profile: UserProfileDto
  messageId: string
  message: CreateHnippNotificationDto
}

@Injectable()
export class NotificationsWorkerService implements OnApplicationBootstrap {
  constructor(
    private readonly notificationDispatch: NotificationDispatchService,
    private readonly messageProcessor: MessageProcessorService,
    private readonly notificationsService: NotificationsService,
    private readonly userProfileApi: V2UsersApi,
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
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
  ) {}

  onApplicationBootstrap() {
    if (this.isRunningAsWorker) {
      console.log('onApplicationBootstrap..................')
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
    profile: UserProfileDto
    template: HnippTemplate
    formattedTemplate: HnippTemplate
    fullName: string
  }): Message {
    if (!profile.email) {
      throw new Error('User does not have email notifications enabled')
    }

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
              copy: `${isEnglish ? 'View on' : 'Skoða á'} island.is`,
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

    if (!profile.email && !profile.emailNotifications) {
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

  async sleepOutsideWorkingHours(messageId: string): Promise<void> {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()
    const currentSeconds = now.getSeconds()
    // Is it outside of working hours?
    if (currentHour >= WORK_ENDING_HOUR || currentHour < WORK_STARTING_HOUR) {
      // If it's past the end hour or before the start hour, sleep until the start hour.
      const sleepHours = (24 - currentHour + WORK_STARTING_HOUR) % 24
      const sleepDurationMilliSeconds =
        (sleepHours * 3600 - currentMinutes * 60 - currentSeconds) * 1000
      this.logger.info(
        `Worker will sleep until 8 AM. Sleep duration: ${sleepDurationMilliSeconds} ms`,
        { messageId },
      )
      await new Promise((resolve) =>
        setTimeout(resolve, sleepDurationMilliSeconds),
      )
      this.logger.info('Worker waking up after sleep.', { messageId })
    }
  }

  async run() {
    await this.worker.run<CreateHnippNotificationDto>(
      async (message, job): Promise<void> => {
        const messageId = job.id
        this.logger.info('Message received by worker', { messageId })

        // check if we are within operational hours or wait until we are
        await this.sleepOutsideWorkingHours(messageId)

        const notification = { messageId, ...message }
        const messageIdExists = await this.notificationModel.count({
          where: { messageId },
        })

        if (messageIdExists > 0) {
          // messageId exists do nothing
          this.logger.info('notification with messageId already exists in db', {
            messageId,
          })
        } else {
          // messageId does not exist
          // write to db
          try {
            const res = await this.notificationModel.create(notification)
            if (res) {
              this.logger.info('notification written to db', {
                notification,
                messageId,
              })
            }
          } catch (e) {
            this.logger.error('error writing notification to db', {
              e,
              messageId,
            })
          }
        }

        const profile =
          await this.userProfileApi.userProfileControllerFindUserProfile({
            xParamNationalId: message.recipient,
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
