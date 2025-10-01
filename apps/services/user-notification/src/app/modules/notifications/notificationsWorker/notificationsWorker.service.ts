import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { isCompany } from 'kennitala'
import { join } from 'path'

import { User } from '@island.is/auth-nest-tools'
import { DocumentsScope } from '@island.is/auth/scopes'
import { ArgumentDto } from '../dto/createHnippNotification.dto'
import { DelegationsApi } from '@island.is/clients/auth/delegation-api'
import {
  EinstaklingurDTONafnItar,
  NationalRegistryV3ClientService,
} from '@island.is/clients/national-registry-v3'
import {
  ActorProfileDto,
  UserProfileDto,
  V2UsersApi,
} from '@island.is/clients/user-profile'
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
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import type { Locale } from '@island.is/shared/types'

import {
  CompanyExtendedInfo,
  CompanyRegistryClientService,
} from '@island.is/clients/rsk/company-registry'
import { UserNotificationsConfig } from '../../../../config'
import { CreateHnippNotificationDto } from '../dto/createHnippNotification.dto'
import { HnippTemplate } from '../dto/hnippTemplate.response'
import { MessageProcessorService } from '../messageProcessor.service'
import { Notification } from '../notification.model'
import { NotificationDispatchService } from '../notificationDispatch.service'
import { NotificationsService } from '../notifications.service'

type HandleNotification = {
  profile: {
    nationalId: string
    email?: string | null
    documentNotifications: boolean
    emailNotifications: boolean
    locale?: string
  }
  notificationId?: number | null
  messageId: string
  message: CreateHnippNotificationDto
}

@Injectable()
export class NotificationsWorkerService {
  constructor(
    private readonly notificationDispatch: NotificationDispatchService,
    private readonly messageProcessor: MessageProcessorService,
    private readonly notificationsService: NotificationsService,
    private readonly userProfileApi: V2UsersApi,
    private readonly delegationsApi: DelegationsApi,
    private readonly nationalRegistryService: NationalRegistryV3ClientService,
    private readonly companyRegistryService: CompanyRegistryClientService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly emailService: EmailService,

    @InjectWorker('notifications')
    private readonly worker: WorkerService,

    @InjectQueue('notifications')
    private readonly queue: QueueService,

    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,

    @Inject(UserNotificationsConfig.KEY)
    private readonly config: ConfigType<typeof UserNotificationsConfig>,

    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
  ) {}

  async handleDocumentNotification({
    profile,
    messageId,
    notificationId,
    message,
  }: HandleNotification) {
    // don't send message unless user wants this type of notification and national id is a person.
    if (isCompany(profile.nationalId)) {
      this.logger.info(
        'User is not a person and will not receive document notifications',
        { messageId },
      )

      return
    }
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
      profile.locale as Locale,
    )

    await this.notificationDispatch.sendPushNotification({
      nationalId: profile.nationalId,
      notification,
      messageId,
      notificationId,
    })
  }

  createEmail({
    isEnglish,
    recipientEmail,
    formattedTemplate,
    fullName,
    subjectId,
    processedArgs,
  }: {
    isEnglish: boolean
    recipientEmail: string | null
    formattedTemplate: HnippTemplate
    fullName: string
    subjectId?: string
    processedArgs: ArgumentDto[]
  }): Message {
    if (!recipientEmail) {
      throw new Error('Missing recipient email address')
    }

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
      subject:
        processedArgs.find((arg) => arg.key === 'subject')?.value ||
        formattedTemplate.title,
      template: {
        title: formattedTemplate.title,
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

    if (!profile.email || !profile.emailNotifications) {
      this.logger.info(
        'User does not have registered email or email notifications enabled',
        {
          messageId,
        },
      )

      return
    }

    const template = await this.notificationsService.getTemplate(
      message.templateId,
      profile.locale as Locale,
    )

    let fullName = message.onBehalfOf?.name ?? ''

    // if we don't have a full name, we try to get it from the national registry
    if (!fullName) {
      // we always use the name of the original recipient in the email
      const nationalIdOfOriginalRecipient =
        message.onBehalfOf?.nationalId ?? profile.nationalId

      fullName = await this.getName(nationalIdOfOriginalRecipient)
    }

    const isEnglish = profile.locale === 'en'

    const formattedTemplate = await this.notificationsService.formatArguments(
      message.args,
      // We need to shallow copy the template here so that the
      // in-memory cache is not modified.
      {
        ...template,
      },
      message?.senderId,
      profile.locale as Locale,
    )

    try {
      const emailContent = this.createEmail({
        formattedTemplate,
        isEnglish,
        recipientEmail: profile.email ?? null,
        fullName,
        subjectId: message.onBehalfOf?.subjectId,
        processedArgs: message.args,
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

  public async run() {
    await this.worker.run<CreateHnippNotificationDto>(
      async (message, job): Promise<void> => {
        const messageId = job.id
        this.logger.info('Message received by worker', { messageId })

        const notification = { messageId, ...message }
        let dbNotification = null

        // Only save notifications for the main recipient, delegation notifications are not saved since they should not show up under the user's notifications
        if (!message.onBehalfOf) {
          dbNotification = await this.notificationModel.findOne({
            where: { messageId },
            attributes: ['id'],
          })

          if (dbNotification) {
            // messageId exists in db, do nothing
            this.logger.info(
              'notification with messageId already exists in db',
              {
                messageId,
              },
            )
          } else {
            // messageId does not exist
            // write to db
            try {
              dbNotification = await this.notificationModel.create(notification)
              if (dbNotification) {
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
        }

        // get actor profile if sending to delegation holder, else get user profile
        let profile: UserProfileDto | ActorProfileDto

        if (message.onBehalfOf) {
          profile =
            await this.userProfileApi.userProfileControllerGetActorProfile({
              xParamToNationalId: message.recipient,
              xParamFromNationalId: message.onBehalfOf.nationalId,
            })
        } else {
          profile =
            await this.userProfileApi.userProfileControllerFindUserProfile({
              xParamNationalId: message.recipient,
            })
        }

        // can't send message if user has no user profile
        if (!profile) {
          this.logger.info('No user profile found for user', { messageId })

          return
        }

        this.logger.info('User found for message', { messageId })

        const handleNotificationArgs: HandleNotification = {
          profile: { ...profile, nationalId: message.recipient },
          messageId,
          notificationId: dbNotification?.id,
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
                    xQueryNationalId: message.recipient,
                    scope: DocumentsScope.main,
                  },
                )

              let recipientName = ''

              if (delegations.data.length > 0) {
                recipientName = await this.getName(message.recipient)
              }

              // Filter out duplicate delegations that have the same fromNationalId and toNationalId
              delegations.data = delegations.data.filter(
                (delegation, index, self) =>
                  index ===
                  self.findIndex(
                    (d) =>
                      d.fromNationalId === delegation.fromNationalId &&
                      d.toNationalId === delegation.toNationalId,
                  ),
              )

              await Promise.all(
                delegations.data.map((delegation) =>
                  this.queue.add({
                    ...message,
                    recipient: delegation.toNationalId,
                    onBehalfOf: {
                      nationalId: message.recipient,
                      name: recipientName,
                      subjectId: delegation.subjectId,
                    },
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

  private async getName(nationalId: string): Promise<string> {
    try {
      let identity: CompanyExtendedInfo | EinstaklingurDTONafnItar | null

      if (isCompany(nationalId)) {
        identity = await this.companyRegistryService.getCompany(nationalId)
        return identity?.name || ''
      }

      identity = await this.nationalRegistryService.getName(nationalId)
      return identity?.birtNafn || identity?.fulltNafn || ''
    } catch (error) {
      this.logger.error('Error getting name from national registry', {
        error,
      })
      return ''
    }
  }

  /* Private methods */

  // When sending email to delegation holder we want to use third party login if we have a subjectId and are sending to a service portal url
  private getClickActionUrl(
    formattedTemplate: HnippTemplate,
    subjectId?: string,
  ) {
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
}
