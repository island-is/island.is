import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { InjectModel } from '@nestjs/sequelize'
import { isValid as isValidKennitala } from 'kennitala'
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { paginate } from '@island.is/nest/pagination'
import type { User } from '@island.is/auth-nest-tools'
import { NoContentException } from '@island.is/nest/problem'
import { Notification } from './notification.model'
import { ActorNotification } from './actor-notification.model'
import { ArgumentDto } from './dto/createHnippNotification.dto'
import { HnippTemplate } from './dto/hnippTemplate.response'
import {
  PaginatedNotificationDto,
  PaginatedActorNotificationDto,
  UpdateNotificationDto,
  RenderedNotificationDto,
  ExtendedPaginationDto,
  UnseenNotificationsCountDto,
  UnreadNotificationsCountDto,
} from './dto/notification.dto'
import type { Locale } from '@island.is/shared/types'
import { mapToContentfulLocale, mapToLocale, cleanString } from './utils'
import {
  CmsService,
  GetTemplateByTemplateId,
  GetTemplates,
  GetOrganizationByNationalId,
} from '@island.is/clients/cms'
import { DocumentsScope } from '@island.is/auth/scopes'
import { Op } from 'sequelize'

/**
 * These are the properties that can be replaced in the template
 */
const ALLOWED_REPLACE_PROPS: Array<keyof HnippTemplate> = [
  'title',
  'externalBody',
  'internalBody',
  'clickActionUrl',
]

type SenderOrganization = {
  title: string
}

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    @InjectModel(ActorNotification)
    private readonly actorNotificationModel: typeof ActorNotification,
    private readonly cmsService: CmsService,
  ) {}

  async getSenderOrganizationTitle(
    senderId: string,
    locale?: Locale,
  ): Promise<SenderOrganization | undefined> {
    locale = mapToLocale(locale as Locale)

    let res = (await this.cmsService.fetchData(GetOrganizationByNationalId, {
      nationalId: senderId,
      locale: mapToContentfulLocale(locale),
    })) as unknown as {
      organizationCollection: { items: Array<{ title: string }> }
    }

    let items = res.organizationCollection.items

    // Second attempt: if no results, try with the alternative format
    // This handles inconsistent kennitala field format in Contentful (with/without dash)
    if (items.length === 0) {
      const sanitizedNationalId = senderId.replace(/\D/g, '')

      // Only proceed if we have a valid kennitala
      if (isValidKennitala(sanitizedNationalId)) {
        // Try the opposite format: if senderId had dash, try without; if not, try with
        const alternativeFormat = senderId.includes('-')
          ? sanitizedNationalId
          : `${sanitizedNationalId.slice(0, 6)}-${sanitizedNationalId.slice(6)}`

        res = (await this.cmsService.fetchData(GetOrganizationByNationalId, {
          nationalId: alternativeFormat,
          locale: mapToContentfulLocale(locale),
        })) as unknown as {
          organizationCollection: { items: Array<{ title: string }> }
        }

        items = res.organizationCollection.items
      }
    }

    if (items.length > 0) {
      const [item] = items
      item.title = cleanString(item.title)
      return item
    } else {
      this.logger.warn(`No org found for senderId: ${senderId}`, { senderId })
    }
  }

  async formatAndMapNotification(
    notification: Notification,
    templateId: string,
    locale?: Locale,
    template?: HnippTemplate,
  ): Promise<RenderedNotificationDto> {
    locale = mapToLocale(locale as Locale)
    try {
      // If template is not provided, fetch it
      if (!template) {
        template = await this.getTemplate(templateId, locale)
      }

      // Format the template with arguments from the notification
      const formattedTemplate = await this.formatArguments(
        notification.args,
        template,
        notification.senderId,
        locale,
      )

      // Map to RenderedNotificationDto
      return {
        id: notification.id,
        messageId: notification.messageId,
        senderId: notification.senderId || '',
        title: formattedTemplate.title,
        externalBody: formattedTemplate.externalBody,
        internalBody: formattedTemplate.internalBody,
        clickActionUrl: formattedTemplate.clickActionUrl,
        scope: notification.scope,
        created: notification.created,
        updated: notification.updated,
        read: notification.read,
        seen: notification.seen,
      }
    } catch (error) {
      this.logger.error('Error formatting notification:', error)
      throw new InternalServerErrorException('Error processing notification')
    }
  }

  async getTemplates(locale?: Locale): Promise<HnippTemplate[]> {
    locale = mapToLocale(locale as Locale)
    const queryVariables = { locale: mapToContentfulLocale(locale) }
    const res = (await this.cmsService.fetchData(
      GetTemplates,
      queryVariables,
    )) as unknown as {
      hnippTemplateCollection: { items: HnippTemplate[] }
    }

    return res.hnippTemplateCollection.items.map((template: HnippTemplate) => ({
      ...template,
      args: template.args || [], // Ensure args is an array
    }))
  }

  async getTemplate(
    templateId: string,
    locale?: Locale,
  ): Promise<HnippTemplate> {
    locale = mapToLocale(locale as Locale)
    const queryVariables = {
      templateId,
      locale: mapToContentfulLocale(locale),
    }
    const res = (await this.cmsService.fetchData(
      GetTemplateByTemplateId,
      queryVariables,
    )) as unknown as {
      hnippTemplateCollection: { items: HnippTemplate[] }
    }
    const items = res.hnippTemplateCollection.items
    if (items.length > 0) {
      const template = items[0]

      return { ...template, args: template.args || [] } // Ensure args is an array
    } else {
      throw new NotFoundException(`Template not found for ID: ${templateId}`)
    }
  }

  /**
   * Validates that all required arguments are provided for the template.
   * Throws BadRequestException if any required arguments are missing.
   */
  validate(template: HnippTemplate, args: ArgumentDto[]): void {
    const providedKeys = args.map((arg) => arg.key)

    const missingArgs = template.args.filter(
      (requiredKey) => !providedKeys.includes(requiredKey),
    )
    if (missingArgs.length > 0) {
      throw new BadRequestException(
        `Missing required arguments for template '${
          template.templateId
        }': ${missingArgs.join(', ')}. Required args are: ${template.args.join(
          ', ',
        )}`,
      )
    }
  }

  /**
   * Sanitizes arguments by filtering out any that don't exist in the template.
   * Logs warnings for invalid args and returns only valid ones.
   */
  sanitize(template: HnippTemplate, args: ArgumentDto[]): ArgumentDto[] {
    const validArgs: ArgumentDto[] = []

    // Filter args and log warnings for invalid ones
    for (const arg of args) {
      if (template.args.includes(arg.key)) {
        validArgs.push(arg)
      } else {
        this.logger.warn(
          `Filtering out invalid argument '${arg.key}' for template '${
            template.templateId
          }'. Valid args are: ${template.args.join(', ')}`,
        )
      }
    }

    return validArgs
  }

  /**
   * Replaces the placeholders in the template with the values provided in the request body
   */
  async formatArguments(
    args: ArgumentDto[],
    template: HnippTemplate,
    senderId?: string,
    locale?: Locale,
  ): Promise<HnippTemplate> {
    // Fetch and update organization name if needed
    if (senderId && args.some((arg) => arg.key === 'organization')) {
      try {
        const sender = await this.getSenderOrganizationTitle(senderId, locale)
        if (sender?.title) {
          args = args.map((arg) =>
            arg.key === 'organization' ? { ...arg, value: sender.title } : arg,
          )
        }
      } catch (error) {
        this.logger.error('Error fetching sender organization title:', {
          senderId,
          locale,
        })
      }
    }

    // Deep clone the template to avoid modifying the original
    const formattedTemplate = JSON.parse(JSON.stringify(template))

    args.forEach((arg) => {
      Object.keys(formattedTemplate).forEach((key) => {
        const templateKey = key as keyof HnippTemplate

        if (
          ALLOWED_REPLACE_PROPS.includes(templateKey) &&
          typeof formattedTemplate[templateKey] === 'string'
        ) {
          formattedTemplate[templateKey] = formattedTemplate[
            templateKey
          ].replace(new RegExp(`{{${arg.key}}}`, 'g'), arg.value)
        }
      })
    })

    return formattedTemplate
  }

  async findOne(
    user: User,
    id: number,
    locale?: Locale,
  ): Promise<RenderedNotificationDto> {
    locale = mapToLocale(locale as Locale)
    const notification = await this.notificationModel.findOne({
      where: { id, recipient: user.nationalId },
    })

    if (!notification) {
      throw new NoContentException()
    }

    return this.formatAndMapNotification(
      notification,
      notification.templateId,
      locale,
    )
  }

  findMany(
    nationalId: string,
    query: ExtendedPaginationDto,
    scopes: string[],
  ): Promise<PaginatedNotificationDto> {
    return paginate({
      Model: this.notificationModel,
      limit: query.limit || 10,
      after: query.after || '',
      before: query.before,
      primaryKeyField: 'id',
      orderOption: [['id', 'DESC']],
      where: {
        recipient: nationalId,
        scope: {
          [Op.in]: scopes || [DocumentsScope.main],
        },
      },
      attributes: [
        'id',
        'messageId',
        'senderId',
        'scope',
        'created',
        'updated',
      ],
    })
  }

  async findManyWithTemplate(
    nationalId: string,
    query: ExtendedPaginationDto,
    scopes: string[],
  ): Promise<PaginatedNotificationDto> {
    const locale = mapToLocale(query.locale as Locale)
    const templates = await this.getTemplates(locale)

    const paginatedListResponse = await paginate({
      Model: this.notificationModel,
      limit: query.limit || 10,
      after: query.after || '',
      before: query.before,
      primaryKeyField: 'id',
      orderOption: [['id', 'DESC']],
      where: {
        recipient: nationalId,
        scope: {
          [Op.in]: scopes || [DocumentsScope.main],
        },
      },
    })

    const formattedNotifications = await Promise.all(
      paginatedListResponse.data.map(async (notification) => {
        const template = templates.find(
          (t) => t.templateId === notification.templateId,
        )

        if (template) {
          return this.formatAndMapNotification(
            notification,
            notification.templateId,
            locale,
            template,
          )
        } else {
          this.logger.warn(
            'Template not found for notification: ' + notification.id,
          )
          return null
        }
      }),
    )
    paginatedListResponse.data = formattedNotifications.filter((n) => n) // Filter out nulls if any
    return paginatedListResponse
  }

  async update(
    user: User,
    id: number,
    updateNotificationDto: UpdateNotificationDto,
    locale?: Locale,
  ): Promise<RenderedNotificationDto> {
    locale = mapToLocale(locale as Locale)
    const [numberOfAffectedRows, [updatedNotification]] =
      await this.notificationModel.update(updateNotificationDto, {
        where: {
          id: id,
          recipient: user.nationalId,
        },
        returning: true,
      })

    if (numberOfAffectedRows === 0) {
      throw new NoContentException()
    } else {
      return this.formatAndMapNotification(
        updatedNotification,
        updatedNotification.templateId,
        locale,
      )
    }
  }

  async getUnreadNotificationsCount(
    user: User,
  ): Promise<UnreadNotificationsCountDto> {
    try {
      const unreadCount = await this.notificationModel.count({
        where: {
          recipient: user.nationalId,
          read: false,
        },
      })
      return { unreadCount }
    } catch (error) {
      this.logger.error('Error getting unread notifications count:', error)
      throw new InternalServerErrorException(
        'Error getting unread notifications count',
      )
    }
  }

  async getUnseenNotificationsCount(
    user: User,
  ): Promise<UnseenNotificationsCountDto> {
    try {
      const unseenCount = await this.notificationModel.count({
        where: {
          recipient: user.nationalId,
          seen: false,
        },
      })
      return { unseenCount }
    } catch (error) {
      this.logger.error('Error getting unseen notifications count:', error)
      throw new InternalServerErrorException(
        'Error getting unseen notifications count',
      )
    }
  }

  async markAllAsSeen(user: User): Promise<void> {
    try {
      await this.notificationModel.update(
        { seen: true },
        { where: { recipient: user.nationalId, seen: false } },
      )
    } catch (error) {
      this.logger.error('Error marking all notifications as seen:', error)
      throw new InternalServerErrorException(
        'Error marking all notifications as seen',
      )
    }
  }

  async markAllAsRead(user: User): Promise<void> {
    try {
      await this.notificationModel.update(
        { read: true },
        { where: { recipient: user.nationalId, read: false } },
      )
    } catch (error) {
      this.logger.error('Error marking all notifications as read:', error)
      throw new InternalServerErrorException(
        'Error marking all notifications as read',
      )
    }
  }

  /**
   * Finds actor notifications for a specific recipient
   */
  async findActorNotifications(
    recipient: string,
    query?: ExtendedPaginationDto,
  ): Promise<PaginatedActorNotificationDto> {
    const result = await paginate({
      Model: this.actorNotificationModel,
      limit: query?.limit || 10,
      after: query?.after || '',
      before: query?.before,
      primaryKeyField: 'id',
      orderOption: [['id', 'DESC']],
      where: { recipient },
      include: [
        {
          model: this.notificationModel,
          as: 'userNotification',
          attributes: ['messageId', 'recipient', 'scope'],
          required: true,
        },
      ],
      attributes: [
        'id',
        'messageId',
        'userNotificationId',
        'recipient',
        'created',
      ],
    })

    // Map results to include fields from joined user_notification
    const mappedData = result.data.map((item) => {
      const actorNotification = item as ActorNotification & {
        userNotification: {
          messageId: string
          recipient: string
          scope: string
        }
      }
      return {
        ...actorNotification.toJSON(),
        rootMessageId: actorNotification.userNotification.messageId,
        onBehalfOfNationalId: actorNotification.userNotification.recipient,
        scope: actorNotification.userNotification.scope,
      }
    })

    return {
      ...result,
      data: mappedData,
    }
  }
}
