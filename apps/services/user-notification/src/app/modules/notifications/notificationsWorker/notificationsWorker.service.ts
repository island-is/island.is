import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { join } from 'path'
import { InjectModel } from '@nestjs/sequelize'

import { User } from '@island.is/auth-nest-tools'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { UserProfileDto, V2UsersApi } from '@island.is/clients/user-profile'
import { DelegationsApi } from '@island.is/clients/auth/delegation-api'
import { EmailService, Message, Body } from '@island.is/email-service'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  InjectQueue,
  InjectWorker,
  QueueService,
  WorkerService,
} from '@island.is/message-queue'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { DocumentsScope } from '@island.is/auth/scopes'

import { MessageProcessorService } from '../messageProcessor.service'
import { NotificationDispatchService } from '../notificationDispatch.service'
import { CreateHnippNotificationDto } from '../dto/createHnippNotification.dto'
import { NotificationsService } from '../notifications.service'
import { HnippTemplate } from '../dto/hnippTemplate.response'
import { Notification } from '../notification.model'
import { mapStringToLocale } from '../utils'

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
    private readonly delegationsApi: DelegationsApi,
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
    @InjectQueue('notifications') private readonly queue: QueueService,
  ) {}

  onApplicationBootstrap() {
    if (this.isRunningAsWorker) {
      void this.run()
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
    recipientEmail,
    template,
    formattedTemplate,
    fullName,
  }: {
    isEnglish: boolean
    recipientEmail: string | null
    template: HnippTemplate
    formattedTemplate: HnippTemplate
    fullName: string
  }): Message {
    if (!recipientEmail) {
      throw new Error('User does not have email notifications enabled')
    }

    const generateBody = (): Body[] => {
      return [
        {
          component: 'Image',
          context: {
            src: join(__dirname, `./assets/images/logo.jpg`),
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
            copy: formattedTemplate.notificationTitle,
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
        ...(formattedTemplate.clickActionUrl
          ? [
              {
                component: 'Button',
                context: {
                  copy: `${isEnglish ? 'View on' : 'Skoða á'} island.is`,
                  href: formattedTemplate.clickActionUrl,
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
        address: 'no-reply@island.is',
      },
      to: {
        name: fullName,
        address: recipientEmail,
      },
      subject: template.notificationTitle,
      template: {
        title: template.notificationTitle,
        body: generateBody(),
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
      this.notificationsService.getTemplate(
        message.templateId,
        mapStringToLocale(profile.locale),
      ),
      this.nationalRegistryService.getName(profile.nationalId),
    ])

    const fullName = individual?.fulltNafn ?? ''
    const isEnglish = profile.locale === 'en'

    const formattedTemplate = this.notificationsService.formatArguments(
      message.args,
      // We need to shallow copy the template here so that the
      // in-memory cache is not modified.
      {
        ...template,
      },
    )

    try {
      const emailContent = this.createEmail({
        isEnglish,
        recipientEmail: profile.email ?? null,
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
    // Is it outside working hours?
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

        // should always send email notification
        const notificationPromises: Promise<void>[] = [
          this.handleEmailNotification(handleNotificationArgs),
        ]

        // If the message is not on behalf of anyone, we look up delegations for the recipient and add messages to the queue for each delegation
        if (!message.onBehalfOf) {
          // Only send push notifications for the main recipient
          notificationPromises.push(
            this.handleDocumentNotification(handleNotificationArgs),
          )

          const shouldSendEmailToDelegations =
            await this.featureFlagService.getValue(
              Features.shouldSendEmailNotificationsToDelegations,
              false,
              { nationalId: message.recipient } as User,
            )

          if (shouldSendEmailToDelegations) {
            // don't fail if we can't get delegations
            try {
              const delegations =
                await this.delegationsApi.delegationsControllerGetDelegationRecords(
                  {
                    xQueryFromNationalId: message.recipient,
                    scope: DocumentsScope.main,
                  },
                )

              await Promise.all(
                delegations.data.map((delegation) =>
                  this.queue.add({
                    ...message,
                    recipient: delegation.toNationalId,
                    onBehalfOf: message.recipient,
                  }),
                ),
              )
            } catch (error) {
              this.logger.error('Error adding delegations to message queue', {
                error,
              })
            }
          }
        }

        await Promise.all(notificationPromises)
      },
    )
  }
}
