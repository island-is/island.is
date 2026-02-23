import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { isCompany } from 'kennitala'

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
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  InjectQueue,
  InjectWorker,
  QueueService,
  WorkerService,
} from '@island.is/message-queue'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import type { Locale } from '@island.is/shared/types'

import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import {
  CreateHnippNotificationDto,
  InternalCreateHnippNotificationDto,
} from '../dto/createHnippNotification.dto'
import { HnippTemplate } from '../dto/hnippTemplate.response'
import { MessageProcessorService } from '../messageProcessor.service'
import { Notification } from '../notification.model'
import { NotificationsService } from '../notifications.service'
import { ActorNotification } from '../actor-notification.model'
import { mapToLocale, SmsDelivery } from '../utils'
import { EmailQueueMessage } from './emailWorker.service'
import { SmsQueueMessage } from './smsWorker.service'
import { PushQueueMessage } from './pushWorker.service'

const createSmsContent = ({
  fullName,
  onBehalfOf,
  template,
}: {
  fullName: string
  onBehalfOf?: string
  template: HnippTemplate
}): string => {
  return `
      ${fullName} ${onBehalfOf ? `(${onBehalfOf})` : ''}: ${template.title}

      ${template.externalBody}

      ${
        template.clickActionUrl
          ? `Skoda a Island.is: 
            ${template.clickActionUrl}`
          : ''
      }
    `
}

@Injectable()
export class NotificationsWorkerService {
  constructor(
    private readonly messageProcessor: MessageProcessorService,
    private readonly notificationsService: NotificationsService,
    private readonly userProfileApi: V2UsersApi,
    private readonly delegationsApi: DelegationsApi,
    private readonly nationalRegistryService: NationalRegistryV3ClientService,
    private readonly companyRegistryService: CompanyRegistryClientService,
    private readonly featureFlagService: FeatureFlagService,

    @InjectWorker('notifications')
    private readonly worker: WorkerService,

    @InjectQueue('notifications')
    private readonly queue: QueueService,

    @InjectQueue('notifications-email')
    private readonly emailQueue: QueueService,

    @InjectQueue('notifications-sms')
    private readonly smsQueue: QueueService,

    @InjectQueue('notifications-push')
    private readonly pushQueue: QueueService,

    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,

    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,

    @InjectModel(ActorNotification)
    private readonly actorNotificationModel: typeof ActorNotification,
  ) {}

  private async handleActorNotification(
    args: InternalCreateHnippNotificationDto & { messageId: string },
  ) {
    const { messageId } = args

    this.logger.info('Handling actor notification', { messageId })

    if (!args.onBehalfOf) {
      this.logger.error('onBehalfOf is required for actor notifications', {
        messageId,
      })
      return
    }

    const actorProfile =
      await this.userProfileApi.userProfileControllerGetActorProfile({
        xParamToNationalId: args.recipient,
        xParamFromNationalId: args.onBehalfOf.nationalId,
      })

    if (!actorProfile) {
      this.logger.info('No actor profile found for user', { messageId })
      return
    }

    const locale: Locale = actorProfile.locale
      ? mapToLocale(actorProfile.locale)
      : 'is'

    const template = await this.notificationsService.getTemplate(
      args.templateId,
      locale,
    )

    const dbRecord = await this.createActorNotificationDbRecord(args)

    const delegationsEnabled = await this.featureFlagService.getValue(
      Features.shouldSendEmailNotificationsToDelegations,
      false,
      { nationalId: args.onBehalfOf.nationalId } as User,
    )

    if (!delegationsEnabled) {
      this.logger.info(
        'Email notifications to delegations are disabled for user',
        { messageId, originalRecipient: args.onBehalfOf.nationalId },
      )
      return
    }

    // SMS uses the delegate's own phone number, not the actor profile's.
    // Fetch it independently — a missing delegate profile should only skip SMS,
    // not block email.
    const delegateProfile =
      await this.userProfileApi.userProfileControllerFindUserProfile({
        xParamNationalId: args.recipient,
      })

    if (!delegateProfile) {
      this.logger.info('No delegate user profile found, SMS will be skipped', {
        messageId,
        recipient: args.recipient,
      })
    }

    const formattedTemplate = await this.notificationsService.formatArguments(
      args.args,
      { ...template },
      args?.senderId,
      locale,
    )

    // Phase 1: collect all payloads (data fetching only, no queue side effects)
    const [emailPayload, smsPayload] = await Promise.all([
      this.buildEmailPayload({
        messageId,
        nationalId: args.recipient,
        email: actorProfile.email,
        emailNotifications: actorProfile.emailNotifications,
        formattedTemplate,
        locale,
        onBehalfOf: args.onBehalfOf,
      }),
      this.buildSmsPayload({
        messageId,
        nationalId: args.recipient,
        mobilePhoneNumber: delegateProfile?.mobilePhoneNumber,
        smsNotifications: delegateProfile?.smsNotifications,
        formattedTemplate,
        onBehalfOfNationalId: args.onBehalfOf?.nationalId,
      }),
    ])

    // Phase 2: enqueue everything together
    const notificationId = dbRecord?.id
    const enqueues: Promise<unknown>[] = []
    if (emailPayload)
      enqueues.push(this.emailQueue.add({ ...emailPayload, notificationId }))
    if (smsPayload)
      enqueues.push(this.smsQueue.add({ ...smsPayload, notificationId }))
    await Promise.all(enqueues)
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
    const nationalId = message.recipient

    let userProfile: UserProfileDto | undefined
    let locale: Locale = 'is'

    if (!isCompany(nationalId)) {
      userProfile =
        await this.userProfileApi.userProfileControllerFindUserProfile({
          xParamNationalId: nationalId,
        })

      if (!userProfile) {
        this.logger.info('No user profile found for user', { messageId })
        return
      }

      locale = userProfile.locale ? mapToLocale(userProfile.locale) : 'is'
    } else {
      const allowCompanyEmails = await this.featureFlagService.getValue(
        Features.shouldSendEmailNotificationsToCompanyUserProfiles,
        false,
        { nationalId } as User,
      )

      if (allowCompanyEmails) {
        userProfile =
          await this.userProfileApi.userProfileControllerFindUserProfile({
            xParamNationalId: nationalId,
          })

        if (userProfile?.locale) {
          locale = mapToLocale(userProfile.locale)
        }
      }
    }

    const template = await this.notificationsService.getTemplate(
      message.templateId,
      locale,
    )
    const scope = template.scope || DocumentsScope.main
    const dbRecord = await this.createUserNotificationDbRecord(args, scope)

    // Phase 1: collect all payloads (data fetching only, no queue side effects)
    let pushPayload: PushQueueMessage | null = null
    let emailPayload: EmailQueueMessage | null = null
    let smsPayload: SmsQueueMessage | null = null

    if (userProfile) {
      const formattedTemplate = await this.notificationsService.formatArguments(
        message.args,
        { ...template },
        message?.senderId,
        locale,
      )

      ;[pushPayload, emailPayload, smsPayload] = await Promise.all([
        this.buildPushPayload({
          messageId,
          nationalId,
          documentNotifications: userProfile.documentNotifications,
          message,
          locale,
        }),
        this.buildEmailPayload({
          messageId,
          nationalId,
          email: userProfile.email,
          emailNotifications: userProfile.emailNotifications,
          formattedTemplate,
          locale,
          onBehalfOf: message.onBehalfOf,
        }),
        this.buildSmsPayload({
          messageId,
          nationalId,
          mobilePhoneNumber: userProfile.mobilePhoneNumber,
          smsNotifications: userProfile.smsNotifications,
          formattedTemplate,
          onBehalfOfNationalId: message.onBehalfOf?.nationalId,
        }),
      ])
    }

    // Phase 2: enqueue everything together — only started after all data is collected
    const enqueues: Promise<unknown>[] = [
      this.handleSendingNotificationsToDelegations(
        args,
        scope,
        actorNationalId,
      ),
    ]
    if (pushPayload)
      enqueues.push(
        this.pushQueue.add({ ...pushPayload, notificationId: dbRecord?.id }),
      )
    if (emailPayload)
      enqueues.push(
        this.emailQueue.add({ ...emailPayload, notificationId: dbRecord?.id }),
      )
    if (smsPayload)
      enqueues.push(
        this.smsQueue.add({ ...smsPayload, notificationId: dbRecord?.id }),
      )
    await Promise.all(enqueues)
  }

  private async buildPushPayload({
    messageId,
    nationalId,
    documentNotifications,
    message,
    locale,
  }: {
    messageId: string
    nationalId: string
    documentNotifications?: boolean | null
    message: CreateHnippNotificationDto
    locale: Locale
  }): Promise<Omit<PushQueueMessage, 'notificationId'> | null> {
    if (isCompany(nationalId) || !documentNotifications) {
      this.logger.info('Skipping push notification', { messageId })
      return null
    }

    const notification = await this.messageProcessor.convertToNotification(
      message,
      locale,
    )
    return { messageId, nationalId, notification }
  }

  private async buildEmailPayload({
    messageId,
    nationalId,
    email,
    emailNotifications,
    formattedTemplate,
    locale,
    onBehalfOf,
  }: {
    messageId: string
    nationalId: string
    email?: string | null
    emailNotifications?: boolean | null
    formattedTemplate: HnippTemplate
    locale: Locale
    onBehalfOf?: { nationalId?: string; name?: string; subjectId?: string }
  }): Promise<Omit<EmailQueueMessage, 'notificationId'> | null> {
    const enabled = await this.featureFlagService.getValue(
      Features.isNotificationEmailWorkerEnabled,
      false,
      { nationalId } as User,
    )

    if (!enabled || !email || !emailNotifications) {
      this.logger.info('Skipping email notification', { messageId })
      return null
    }

    const fullName =
      onBehalfOf?.name ||
      (await this.getName(onBehalfOf?.nationalId ?? nationalId))

    return {
      messageId,
      recipientEmail: email,
      fullName,
      isEnglish: locale === 'en',
      formattedTemplate,
      subjectId: onBehalfOf?.subjectId,
    }
  }

  private async buildSmsPayload({
    messageId,
    nationalId,
    mobilePhoneNumber,
    smsNotifications,
    formattedTemplate,
    onBehalfOfNationalId,
  }: {
    messageId: string
    nationalId: string
    mobilePhoneNumber?: string | null
    smsNotifications?: boolean | null
    formattedTemplate: HnippTemplate
    onBehalfOfNationalId?: string
  }): Promise<Omit<SmsQueueMessage, 'notificationId'> | null> {
    const enabled = await this.featureFlagService.getValue(
      Features.isSendSmsNotificationsEnabled,
      false,
      { nationalId } as User,
    )

    if (!enabled) {
      this.logger.info('Skipping SMS notification: feature flag disabled', {
        messageId,
      })
      return null
    }

    if (
      formattedTemplate.smsDelivery !== SmsDelivery.ALWAYS &&
      formattedTemplate.smsDelivery !== SmsDelivery.OPT_IN
    ) {
      this.logger.info('Skipping SMS notification: delivery not configured', {
        messageId,
      })
      return null
    }

    if (!formattedTemplate.smsPayer) {
      this.logger.error('SMS payer is required for template', {
        messageId,
        templateId: formattedTemplate.templateId,
      })
      return null
    }

    if (!mobilePhoneNumber) {
      return null
    }

    if (
      formattedTemplate.smsDelivery === SmsDelivery.OPT_IN &&
      !smsNotifications
    ) {
      this.logger.info('Skipping SMS notification: user has not opted in', {
        messageId,
      })
      return null
    }

    const fullName = await this.getShortName(nationalId)
    const onBehalfOf = onBehalfOfNationalId
      ? await this.getShortName(onBehalfOfNationalId)
      : undefined

    return {
      messageId,
      mobilePhoneNumber,
      smsContent: createSmsContent({
        fullName,
        onBehalfOf,
        template: formattedTemplate,
      }),
    }
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
