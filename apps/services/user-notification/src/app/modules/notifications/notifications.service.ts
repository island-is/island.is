import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'
import { HnippTemplate } from './dto/hnippTemplate.response'
import { Cache } from 'cache-manager'
import axios from 'axios'
import { Notification } from './notification.model'
import { InjectModel } from '@nestjs/sequelize'

import { paginate } from '@island.is/nest/pagination'

import { User } from '@island.is/auth-nest-tools'
import {
  PaginatedNotificationDto,
  UpdateNotificationDto,
  NotificationStatus,
  RenderedNotificationDto,
} from './dto/notification.dto'

const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
const contentfulGqlUrl =
  'https://graphql.contentful.com/content/v1/spaces/8k0h54kbe6bj/environments/master'

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
  ) {}

  async addToCache(key: string, item: object) {
    return await this.cacheManager.set(key, item)
  }

  async getFromCache(key: string) {
    return await this.cacheManager.get(key)
  }

  mapLocale(locale: string | null | undefined): string {
    if (locale === 'en') {
      return 'en'
    }
    return 'is-IS'
  }
  async getTemplates(
    locale?: string | null | undefined,
  ): Promise<HnippTemplate[]> {
    locale = this.mapLocale(locale)

    this.logger.info(
      'Fetching templates from Contentful GQL for locale: ' + locale,
    )

    const contentfulHnippTemplatesQuery = {
      query: ` {
      hnippTemplateCollection(locale: "${locale}") {
        items {
          templateId
          notificationTitle
          notificationBody
          notificationDataCopy
          clickAction
          category
          args
        }
      }
    }
    `,
    }

    const res = await axios
      .post(contentfulGqlUrl, contentfulHnippTemplatesQuery, {
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer ' + accessToken,
        },
      })
      .then((response) => {
        for (const item of response.data.data.hnippTemplateCollection.items) {
          // contentful returns null for empty arrays
          if (item.args == null) item.args = []
        }
        return response.data
      })
      .catch((error) => {
        if (error.response) {
          throw new BadRequestException(error.response.data)
        } else {
          throw new BadRequestException('Bad Request')
        }
      })
    return res.data.hnippTemplateCollection.items
  }

  async getTemplate(
    templateId: string,
    locale?: string | null | undefined,
  ): Promise<HnippTemplate> {
    locale = this.mapLocale(locale)
    //check cache
    const cacheKey = templateId + '-' + locale
    const cachedTemplate = await this.getFromCache(cacheKey)
    if (cachedTemplate) {
      this.logger.info('cache hit for: ' + cacheKey)
      return cachedTemplate as HnippTemplate
    }

    try {
      for (const template of await this.getTemplates(locale)) {
        if (template.templateId == templateId) {
          await this.addToCache(cacheKey, template)
          return template
        }
      }
      throw new NotFoundException(`Template: ${templateId} not found`)
    } catch {
      throw new NotFoundException(`Template: ${templateId} not found`)
    }
  }

  validateArgCounts(
    body: CreateHnippNotificationDto,
    template: HnippTemplate,
  ): boolean {
    return body.args.length == template.args.length
  }

  formatArguments(
    body: CreateHnippNotificationDto,
    template: HnippTemplate,
  ): HnippTemplate {
    if (template.args.length > 0) {
      const allowedReplaceProperties = [
        'notificationTitle',
        'notificationBody',
        'notificationDataCopy',
        'clickAction',
      ]
      // find {{arg.key}} in string and replace with arg.value
      const regex = new RegExp(/{{[^{}]*}}/)
      Object.keys(template).forEach((key) => {
        if (allowedReplaceProperties.includes(key)) {
          let value = template[key as keyof HnippTemplate] as string
          if (value) {
            if (regex.test(value)) {
              for (const arg of body.args) {
                const regexTarget = new RegExp('{{' + arg.key + '}}', 'g')
                value = value.replace(regexTarget, arg.value)
                template[key as keyof Omit<HnippTemplate, 'args'>] = value
              }
            }
          }
        }
      })
    }
    return template
  }

  async findOne(
    user: User,
    id: number,
    locale: string,
  ): Promise<RenderedNotificationDto> {
    const notification = await this.notificationModel.findOne({
      where: {
        id: id,
        recipient: user.nationalId,
      },
    })

    if (!notification) {
      throw new NotFoundException(
        'Notification not found or does not belong to the user',
      )
    } else {
      const template = await this.getTemplate(notification.templateId, locale)
      const formattedTemplate = this.formatArguments(notification, template)
      return {
        id: notification.id,
        messageId: notification.messageId,
        sender: 'Hnipp Stofnun',
        title: formattedTemplate.notificationTitle,
        body: formattedTemplate.notificationBody,
        dataCopy: formattedTemplate.notificationDataCopy,
        clickAction: formattedTemplate.clickAction,
        created: notification.created,
        updated: notification.updated,
        status: notification.status,
      }
    }
  }

  async findMany(user: User, query: any): Promise<PaginatedNotificationDto> {
    const templates = await this.getTemplates(query.locale)
    const paginatedListResponse = await paginate({
      Model: this.notificationModel,
      limit: query.limit || 10,
      after: query.after,
      before: query.before,
      primaryKeyField: 'id',
      orderOption: [['id', 'DESC']],
      where: { recipient: user.nationalId },
    })
    // loop through notifications and format them as a new property like in the method above
    const formattedNotifications = paginatedListResponse.data.map(
      (notification) => {
        const template = templates.find(
          (template) => template.templateId === notification.templateId,
        )
        if (template) {
          const formattedTemplate = this.formatArguments(notification, template)
          return {
            id: notification.id,
            messageId: notification.messageId,
            sender: 'Hnipp Stofnun',
            title: formattedTemplate.notificationTitle,
            body: formattedTemplate.notificationBody,
            dataCopy: formattedTemplate.notificationDataCopy,
            clickAction: formattedTemplate.clickAction,
            created: notification.created,
            updated: notification.updated,
            status: notification.status,
          }
        }
      },
    )
    paginatedListResponse.data = formattedNotifications
    return paginatedListResponse
  }

  async update(
    user: User,
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<RenderedNotificationDto> {
    const notification = await this.notificationModel.findOne({
      where: {
        id: id,
        recipient: user.nationalId, // Check if the recipient matches the nationalId
      },
    })

    if (!notification) {
      throw new NotFoundException(
        'Notification not found or does not belong to the user',
      )
    } else {
      notification.status = updateNotificationDto.status
      const res = await notification.save()
      const template = await this.getTemplate(notification.templateId)
      const formattedTemplate = this.formatArguments(notification, template)
      return {
        id: notification.id,
        messageId: notification.messageId,
        sender: 'Hnipp Stofnun',
        title: formattedTemplate.notificationTitle,
        body: formattedTemplate.notificationBody,
        dataCopy: formattedTemplate.notificationDataCopy,
        clickAction: formattedTemplate.clickAction,
        created: notification.created,
        updated: notification.updated,
        status: notification.status,
      }
    }
  }

  // Just a test function for easy creating WHILE DEVELOPING
  async create(user: any): Promise<any> {
    //user: User temp change for db bypassauth testing
    const exampleNotificationData = {
      recipient: '0101302989', // temp hardfix // user.nationalId,
      templateId: 'HNIPP.POSTHOLF.NEW_DOCUMENT',
      args: [
        {
          key: 'organization',
          value: 'Hnipp Test Crew',
        },
        {
          key: 'documentId',
          value: 'abcd-abcd-abcd-abcd',
        },
      ],
      status: NotificationStatus.UNREAD,
    }

    try {
      return this.notificationModel.create(exampleNotificationData as any)
    } catch (error) {
      this.logger.debug(error)
      return Error
    }
  }

  async getAll(): Promise<Notification[]> {
    return await this.notificationModel.findAll()
  }
}
