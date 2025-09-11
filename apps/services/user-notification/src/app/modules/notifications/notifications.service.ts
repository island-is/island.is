import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { InjectModel } from '@nestjs/sequelize'
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
import { ArgumentDto } from './dto/createHnippNotification.dto'
import { HnippTemplate } from './dto/hnippTemplate.response'
import {
  PaginatedNotificationDto,
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
    private readonly cmsService: CmsService,
  ) {}

  async getSenderOrganizationTitle(
    senderId: string,
    locale?: Locale,
  ): Promise<SenderOrganization | undefined> {
    locale = mapToLocale(locale as Locale)
    const queryVariables = {
      nationalId: senderId,
      locale: mapToContentfulLocale(locale),
    }
    const res = (await this.cmsService.fetchData(
      GetOrganizationByNationalId,
      queryVariables,
    )) as any
    const items = res.organizationCollection.items
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
    )) as any

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
    )) as any
    const items = res.hnippTemplateCollection.items
    if (items.length > 0) {
      const template = items[0]
      return { ...template, args: template.args || [] } // Ensure args is an array
    } else {
      throw new NotFoundException(`Template not found for ID: ${templateId}`)
    }
  }
  /**
   * Checks if the arguments provided in the request body are valid for the template and checks if the number of arguments match
   */
  async validate(templateId: string, args: ArgumentDto[]) {
    const template = await this.getTemplate(templateId)

    if (!this.validateArgCounts(args, template)) {
      throw new BadRequestException(
        `Number of arguments doesn't match, template requires ${template.args.length} arguments but ${args.length} were provided`,
      )
    }

    const validArgs = this.validateArgs(args, template)

    if (!validArgs.isValid && validArgs.message) {
      throw new BadRequestException(validArgs.message)
    }
  }

  validateArgCounts(args: ArgumentDto[], template: HnippTemplate): boolean {
    return args.length == template.args.length
  }

  /**
   * Checks if the arguments provided in the request body are valid for the template
   */
  validateArgs(args: ArgumentDto[], template: HnippTemplate) {
    for (const arg of args) {
      if (!template.args.includes(arg.key)) {
        return {
          isValid: false,
          message: `${arg.key} is not a valid argument for template: ${template.templateId}`,
        }
      }
    }

    return {
      isValid: true,
    }
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
  ): Promise<PaginatedNotificationDto> {
    return paginate({
      Model: this.notificationModel,
      limit: query.limit || 10,
      after: query.after || '',
      before: query.before,
      primaryKeyField: 'id',
      orderOption: [['id', 'DESC']],
      where: { recipient: nationalId },
      attributes: ['id', 'messageId', 'senderId', 'created', 'updated'],
    })
  }

  async findManyWithTemplate(
    nationalId: string,
    query: ExtendedPaginationDto,
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
      where: { recipient: nationalId },
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
}
