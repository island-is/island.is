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
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

import { paginate } from '@island.is/nest/pagination'
import type { User } from '@island.is/auth-nest-tools'
import { NoContentException } from '@island.is/nest/problem'

import { Notification } from './notification.model'
import axios from 'axios'
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
import { mapToContentfulLocale, mapToLocale } from './utils'

const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN
const CONTENTFUL_GQL_ENDPOINT =
  'https://graphql.contentful.com/content/v1/spaces/8k0h54kbe6bj/environments/master'

/**
 * These are the properties that can be replaced in the template
 */
const ALLOWED_REPLACE_PROPS: Array<keyof HnippTemplate> = [
  'notificationTitle',
  'notificationBody',
  'notificationDataCopy',
  'clickAction',
  'clickActionWeb',
  'clickActionUrl',
]

type SenderOrganization = {
  title: string | undefined
}

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
  ) {}

  async performGraphQLRequest(query: string) {
    try {
      const response = await axios.post(
        CONTENTFUL_GQL_ENDPOINT,
        { query },
        {
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        },
      )
      return response.data
    } catch (error) {
      if (error.response) {
        throw new BadRequestException(error.response.data)
      } else {
        this.logger.error('GraphQL Request Failed', { error })
        throw new InternalServerErrorException('Internal Server Error')
      }
    }
  }

  async getSenderOrganization(
    senderId: string,
    locale?: Locale,
  ): Promise<SenderOrganization> {
    locale = mapToLocale(locale as Locale)
    const cacheKey = `org-${senderId}-${locale}`
    const cachedOrganization = await this.cacheManager.get<SenderOrganization>(
      cacheKey,
    )
    if (cachedOrganization) {
      this.logger.info(`Cache HIT for: ${cacheKey}`, cachedOrganization)
      return cachedOrganization
    } else {
      this.logger.warn(`Cache MISS for: ${cacheKey}`)
    }
    const contentfulOrganizationQuery = `{
      organizationCollection(where: {kennitala: "${senderId}"}, locale: "${mapToContentfulLocale(
      locale,
    )}") {
        items {
          title
        }
      }
    }`
    const res = await this.performGraphQLRequest(contentfulOrganizationQuery)
    const organizationTitle =
      res.data.organizationCollection.items[0]?.title ?? undefined
    const result: SenderOrganization = { title: organizationTitle }

    if (!organizationTitle) {
      this.logger.warn(`Organization title not found for senderId: ${senderId}`)
    }
    // always store the result in cache wether it is found or not to avoid multiple requests
    await this.cacheManager.set(cacheKey, result)
    return result
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

      // check for organization argument to fetch translated organization title
      const organizationArg = notification.args.find(
        (arg) => arg.key === 'organization',
      )

      // if senderId is set and args contains organization, fetch organizationtitle from senderId
      if (notification.senderId && organizationArg) {
        try {
          const sender = await this.getSenderOrganization(
            notification.senderId,
            locale,
          )

          if (sender.title) {
            organizationArg.value = sender.title
          } else {
            this.logger.warn('title not found ', {
              senderId: notification.senderId,
              locale,
            })
          }
        } catch (error) {
          this.logger.error('error trying to get org title', {
            senderId: notification.senderId,
            locale,
          })
        }
      }

      // Format the template with arguments from the notification
      const formattedTemplate = this.formatArguments(
        notification.args,
        template,
      )

      // Map to RenderedNotificationDto
      return {
        id: notification.id,
        messageId: notification.messageId,
        senderId: notification.senderId || '',
        title: formattedTemplate.notificationTitle,
        body: formattedTemplate.notificationBody,
        dataCopy: formattedTemplate.notificationDataCopy,
        clickAction: formattedTemplate.clickAction,
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
    const cacheKey = `templates-${locale}`

    // Try to retrieve the templates from cache first
    const cachedTemplates = await this.cacheManager.get<HnippTemplate[]>(
      cacheKey,
    )
    if (cachedTemplates) {
      this.logger.info(`Cache hit for templates: ${cacheKey}`)
      return cachedTemplates
    }

    // GraphQL query to fetch all templates for the specified locale
    const contentfulTemplatesQuery = `{
      hnippTemplateCollection(locale: "${mapToContentfulLocale(locale)}") {
        items {
          templateId
          notificationTitle
          notificationBody
          notificationDataCopy
          clickAction
          clickActionWeb
          clickActionUrl
          category
          args
        }
      }
    }`

    try {
      const res = await this.performGraphQLRequest(contentfulTemplatesQuery)
      const templates = res.data.hnippTemplateCollection.items

      if (templates.length === 0) {
        this.logger.warn(`No templates found for locale: ${locale}`)
        return []
      }

      // Cache the fetched templates before returning
      await this.cacheManager.set(cacheKey, templates)
      return templates
    } catch (error) {
      this.logger.error('Error fetching templates:', { locale, error })
      throw error // Rethrow the caught error
    }
  }

  async getTemplate(
    templateId: string,
    locale?: Locale,
  ): Promise<HnippTemplate> {
    locale = mapToLocale(locale as Locale)
    const cacheKey = `template-${templateId}-${locale}`

    // Try to retrieve the template from cache first
    const cachedTemplate = await this.cacheManager.get<HnippTemplate>(cacheKey)
    if (cachedTemplate) {
      this.logger.info(`Cache hit for template: ${cacheKey}`)
      return cachedTemplate
    }

    // Query to fetch a specific template by templateId
    const contentfulTemplateQuery = `{
      hnippTemplateCollection(where: {templateId: "${templateId}"}, locale: "${mapToContentfulLocale(
      locale,
    )}") {
        items {
          templateId
          notificationTitle
          notificationBody
          notificationDataCopy
          clickAction
          clickActionWeb
          clickActionUrl
          category
          args
        }
      }
    }`

    try {
      const res = await this.performGraphQLRequest(contentfulTemplateQuery)
      const template =
        res.data.hnippTemplateCollection.items.length > 0
          ? res.data.hnippTemplateCollection.items[0]
          : null

      if (!template) {
        throw new NotFoundException(`Template not found for ID: ${templateId}`)
      }

      // Cache the fetched template before returning
      await this.cacheManager.set(cacheKey, template)
      return template
    } catch (error) {
      this.logger.error('Error fetching template:', { templateId, error })
      throw error // Rethrow the caught error
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
  formatArguments(args: ArgumentDto[], template: HnippTemplate): HnippTemplate {
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

  async findMany(
    user: User,
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
      where: { recipient: user.nationalId },
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
}
