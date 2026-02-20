import { SmsService } from '@island.is/nova-sms'
import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { isCompany } from 'kennitala'
import { join } from 'path'

import { User } from '@island.is/auth-nest-tools'
import { DocumentsScope, notificationScopes } from '@island.is/auth/scopes'
import {
  DelegationsApi,
  DelegationsControllerGetDelegationRecordsDirectionEnum,
} from '@island.is/clients/auth/delegation-api'
import {
  EinstaklingurDTONafnItar,
  NationalRegistryV3ClientService,
} from '@island.is/clients/national-registry-v3'
import { UserProfileDto, V2UsersApi } from '@island.is/clients/user-profile'
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
import {
  CreateHnippNotificationDto,
  InternalCreateHnippNotificationDto,
} from '../dto/createHnippNotification.dto'
import { HnippTemplate } from '../dto/hnippTemplate.response'
import { MessageProcessorService } from '../messageProcessor.service'
import { Notification } from '../notification.model'
import { NotificationDispatchService } from '../notificationDispatch.service'
import { NotificationsService } from '../notifications.service'
import { ActorNotification } from '../actor-notification.model'
import { mapToLocale, SmsDelivery } from '../utils'

type HandleNotification = {
  profile: {
    nationalId: string
    email?: string | null
    documentNotifications: boolean
    emailNotifications: boolean
    locale?: string
    mobilePhoneNumber?: string | null
    smsNotifications?: boolean | null
  }
  notificationId?: number | null
  messageId: string
  rootMessageId?: string
  message: InternalCreateHnippNotificationDto
  template: HnippTemplate
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
    private readonly smsService: SmsService,
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

    @InjectModel(ActorNotification)
    private readonly actorNotificationModel: typeof ActorNotification,
  ) {}

  async handlePushNotifications(args: HandleNotification) {
    const { profile, messageId, notificationId, message } = args
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
  }: {
    isEnglish: boolean
    recipientEmail: string | null
    formattedTemplate: HnippTemplate
    fullName: string
    subjectId?: string
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
      subject: formattedTemplate.title,
      template: {
        title: formattedTemplate.title,
        body: generateBody(),
      },
    }
  }

  private createSmsContent({
    fullName,
    onBehalfOf,
    template,
  }: {
    fullName: string
    onBehalfOf?: string
    template: HnippTemplate
  }): string {
    return `
      ${fullName} ${onBehalfOf ? `(${onBehalfOf})` : ''}: ${template.title}
     
      ${template.externalBody}
     
      Skoda a Island.is:
     
      ${template.clickActionUrl}  
    `
  }

  private async handleSmsNotification({
    profile,
    message,
    messageId,
    template,
  }: HandleNotification): Promise<void> {
    const { nationalId } = profile

    const allowSmsNotification = await this.featureFlagService.getValue(
      Features.isSendSmsNotificationsEnabled,
      false,
      { nationalId } as User,
    )

    if (!allowSmsNotification) {
      this.logger.info(
        'SMS notification feature flag is not enabled for user',
        {
          messageId,
          nationalId,
        },
      )
      return
    }

    if (
      template.smsDelivery !== SmsDelivery.ALWAYS &&
      template.smsDelivery !== SmsDelivery.OPT_IN
    ) {
      this.logger.info('SMS delivery is not enabled for template', {
        messageId,
        templateId: template.templateId,
        smsDelivery: template.smsDelivery,
      })
      return
    }

    if (!template.smsPayer) {
      this.logger.error('SMS payer is required for template', {
        messageId,
        templateId: template.templateId,
      })
      return
    }

    if (!profile.mobilePhoneNumber) {
      this.logger.error('Phone number is required for template', {
        messageId,
        templateId: template.templateId,
      })
      return
    }

    if (
      template.smsDelivery === SmsDelivery.OPT_IN &&
      !profile.smsNotifications
    ) {
      this.logger.info('SMS notification is not enabled for user', {
        messageId,
        templateId: template.templateId,
      })
      return
    }

    const fullName = await this.getShortName(nationalId)
    const onBehalfOf = message.onBehalfOf?.nationalId
      ? await this.getShortName(message.onBehalfOf?.nationalId)
      : undefined

    try {
      const smsContent = this.createSmsContent({
        fullName,
        onBehalfOf,
        template: await this.notificationsService.formatArguments(
          message.args,
          { ...template },
          message?.senderId,
          profile.locale as Locale,
        ),
      })
      await this.smsService.sendSms(profile.mobilePhoneNumber, smsContent)

      this.logger.info('SMS notification sent', {
        messageId,
      })
    } catch (error) {
      this.logger.error('SMS notification error', {
        error,
        messageId,
      })
    }
  }

  private async handleEmailNotification({
    profile,
    message,
    messageId,
    template,
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

  private async handleActorNotification(
    args: InternalCreateHnippNotificationDto & { messageId: string },
  ) {
    this.logger.info('Handling actor notification', {
      messageId: args.messageId,
    })

    // Get actor profile (which includes their preferred locale)
    if (!args.onBehalfOf) {
      this.logger.error('onBehalfOf is required for actor notifications', {
        messageId: args.messageId,
      })
      return
    }

    const actorProfile =
      await this.userProfileApi.userProfileControllerGetActorProfile({
        xParamToNationalId: args.recipient,
        xParamFromNationalId: args.onBehalfOf.nationalId,
      })

    if (!actorProfile) {
      this.logger.info('No actor profile found for user', {
        messageId: args.messageId,
      })
      return
    }

    const locale: Locale = actorProfile.locale
      ? mapToLocale(actorProfile.locale)
      : 'is'

    const template = await this.notificationsService.getTemplate(
      args.templateId,
      locale,
    )

    const dbNotification = await this.createActorNotificationDbRecord(args)

    // Check if delegation email notifications are enabled for the original recipient
    const shouldSendToDelegations = await this.featureFlagService.getValue(
      Features.shouldSendEmailNotificationsToDelegations,
      false,
      { nationalId: args.onBehalfOf.nationalId } as User,
    )

    if (!shouldSendToDelegations) {
      this.logger.info(
        'Email notifications to delegations are disabled for user',
        {
          messageId: args.messageId,
          originalRecipient: args.onBehalfOf.nationalId,
        },
      )
      return
    }

    const handleNotificationArgs: HandleNotification = {
      profile: { nationalId: args.recipient, ...actorProfile },
      messageId: args.messageId,
      rootMessageId: args.rootMessageId,
      notificationId: dbNotification?.id,
      message: args,
      template,
    }

    // We send email and SMS notifications to actors, not push notifications
    await this.handleEmailNotification(handleNotificationArgs)

    // For SMS we use the delegate's own mobilePhoneNumber from their user profile
    // (not a per-delegation phone number like emails support)
    const delegateUserProfile =
      await this.userProfileApi.userProfileControllerFindUserProfile({
        xParamNationalId: args.recipient,
      })

    if (delegateUserProfile) {
      await this.handleSmsNotification({
        ...handleNotificationArgs,
        profile: {
          ...handleNotificationArgs.profile,
          mobilePhoneNumber: delegateUserProfile.mobilePhoneNumber,
          smsNotifications: delegateUserProfile.smsNotifications,
        },
      })
    } else {
      this.logger.error('No delegate user profile found for user', {
        messageId: args.messageId,
        recipient: args.recipient,
      })
    }
  }

  private async createActorNotificationDbRecord(
    args: InternalCreateHnippNotificationDto & { messageId: string },
  ) {
    const { messageId, ...message } = args

    const existing = await this.actorNotificationModel.findOne({
      where: { messageId },
      attributes: ['id'],
    })

    if (existing) {
      this.logger.info(
        'actor notification with messageId already exists in db',
        {
          messageId,
        },
      )
      return existing
    }

    // find user notification by rootMessageId
    const userNotification = await this.notificationModel.findOne({
      where: {
        messageId: message.rootMessageId,
      },
    })

    if (!userNotification) {
      this.logger.error('Could not find user notification by messageId', {
        messageId,
      })
      return null
    }

    if (!message.onBehalfOf) {
      this.logger.error('onBehalfOf is required for actor notifications', {
        messageId,
      })
      return null
    }

    try {
      const created = await this.actorNotificationModel.create({
        messageId,
        userNotificationId: userNotification.id,
        recipient: message.recipient,
      })
      this.logger.info('actor notification written to db', {
        messageId,
      })
      return created
    } catch (e) {
      this.logger.error('error writing actor notification to db', {
        e,
        messageId,
      })
      return null
    }
  }

  private async handleUserNotification(
    args: CreateHnippNotificationDto & { messageId: string },
    actorNationalId?: string,
  ) {
    const { messageId, ...message } = args

    const isCompanyRecipient = isCompany(message.recipient)

    let locale: Locale = 'is' // Default locale
    let userProfile: UserProfileDto | undefined
    let allowCompanyUserProfileEmails = false

    if (!isCompanyRecipient) {
      userProfile =
        await this.userProfileApi.userProfileControllerFindUserProfile({
          xParamNationalId: message.recipient,
        })

      if (!userProfile) {
        this.logger.info('No user profile found for user', {
          messageId: args.messageId,
        })
        return
      }

      locale = userProfile.locale ? mapToLocale(userProfile.locale) : 'is'
    } else {
      allowCompanyUserProfileEmails = await this.featureFlagService.getValue(
        Features.shouldSendEmailNotificationsToCompanyUserProfiles,
        false,
        { nationalId: message.recipient } as User,
      )

      if (allowCompanyUserProfileEmails) {
        userProfile =
          await this.userProfileApi.userProfileControllerFindUserProfile({
            xParamNationalId: message.recipient,
          })

        if (userProfile) {
          locale = userProfile.locale ? mapToLocale(userProfile.locale) : 'is'
        }
      }
    }

    const template = await this.notificationsService.getTemplate(
      message.templateId,
      locale,
    )

    const scope = template.scope || DocumentsScope.main
    const notification = await this.createUserNotificationDbRecord(args, scope)

    const shouldSendNotifications =
      (!isCompanyRecipient && userProfile) ||
      (isCompanyRecipient && userProfile && allowCompanyUserProfileEmails)

    if (shouldSendNotifications && userProfile) {
      const handleNotificationArgs: HandleNotification = {
        profile: userProfile,
        messageId: args.messageId,
        notificationId: notification?.id,
        message: args,
        template,
      }
      await this.handleEmailNotification(handleNotificationArgs)
      await this.handlePushNotifications(handleNotificationArgs)
      await this.handleSmsNotification(handleNotificationArgs)
    }

    await this.handleSendingNotificationsToDelegations(
      args,
      scope,
      actorNationalId,
    )
  }

  private async handleSendingNotificationsToDelegations(
    args: InternalCreateHnippNotificationDto & { messageId: string },
    templateScope: string,
    actorNationalId?: string,
  ) {
    const { messageId, ...message } = args

    // Only proceed if the template scope is in the allowed notification scopes
    if (!notificationScopes.includes(templateScope)) {
      this.logger.info('Template scope is not in allowed notification scopes', {
        templateScope,
        messageId,
      })
      return
    }

    try {
      const delegations =
        await this.delegationsApi.delegationsControllerGetDelegationRecords({
          xQueryNationalId: message.recipient,
          scopes: templateScope,
          direction:
            DelegationsControllerGetDelegationRecordsDirectionEnum.outgoing,
        })

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

      const delegationsToSend = actorNationalId
        ? delegations.data.filter(
            (delegation) => actorNationalId === delegation.toNationalId,
          )
        : delegations.data

      await Promise.all(
        delegationsToSend.map((delegation) =>
          this.queue.add({
            ...message,
            recipient: delegation.toNationalId,
            rootMessageId: messageId,
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

  private async createUserNotificationDbRecord(
    args: CreateHnippNotificationDto & { messageId: string },
    scope: string,
  ) {
    const { messageId, ...message } = args
    const existing = await this.notificationModel.findOne({
      where: { messageId },
      attributes: ['id'],
    })

    if (existing) {
      this.logger.info('notification with messageId already exists in db', {
        messageId,
      })
      return existing
    }

    try {
      const created = await this.notificationModel.create({
        messageId: args.messageId,
        recipient: message.recipient,
        senderId: message.senderId,
        templateId: message.templateId,
        args: message.args,
        scope,
      })
      this.logger.info('notification written to db', {
        messageId,
      })
      return created
    } catch (e) {
      this.logger.error('error writing notification to db', {
        e,
        messageId,
      })
      return null
    }
  }

  private async getPersonIdentity(
    nationalId: string,
  ): Promise<EinstaklingurDTONafnItar | null> {
    try {
      return await this.nationalRegistryService.getName(nationalId)
    } catch (error) {
      this.logger.error('Error getting name from national registry', {
        error,
      })
      return null
    }
  }

  private async getCompanyName(nationalId: string): Promise<string> {
    try {
      const company = await this.companyRegistryService.getCompany(nationalId)
      return company?.name || ''
    } catch (error) {
      this.logger.error('Error getting name from company registry', {
        error,
      })
      return ''
    }
  }

  private async getName(nationalId: string): Promise<string> {
    if (isCompany(nationalId)) {
      return this.getCompanyName(nationalId)
    }
    const identity = await this.getPersonIdentity(nationalId)
    return identity?.birtNafn || identity?.fulltNafn || ''
  }

  private async getShortName(nationalId: string): Promise<string> {
    if (isCompany(nationalId)) {
      return this.getCompanyName(nationalId)
    }
    const identity = await this.getPersonIdentity(nationalId)
    return (
      identity?.eiginNafn || identity?.birtNafn || identity?.fulltNafn || ''
    )
  }

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

  public async run() {
    await this.worker.run<InternalCreateHnippNotificationDto>(
      async (message, job): Promise<void> => {
        const messageId = job.id
        this.logger.info('Message received by worker', { messageId })

        const notification = { messageId, ...message }

        if (message.onBehalfOf && message.rootMessageId) {
          return await this.handleActorNotification(notification)
        } else if (message.onBehalfOf && !message.rootMessageId) {
          return await this.handleUserNotification(
            {
              recipient: message.onBehalfOf.nationalId,
              templateId: message.templateId,
              args: message.args,
              senderId: message.senderId,
              messageId: messageId,
            },
            message.recipient,
          )
        }

        await this.handleUserNotification(notification)
      },
    )
  }
}
