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
} from './dto/notification.dto'

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
]

/**
 * Finds {{key}} in string
 */
const ARG_REPLACE_REGEX = new RegExp(/{{[^{}]*}}/)

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
  ) {}

  private async formatAndMapNotification(
    notification: Notification,
    templateId: string,
    locale: string,
    template?: HnippTemplate,
  ): Promise<RenderedNotificationDto> {
    try {
      // If template is not provided, fetch it
      if (!template) {
        template = await this.getTemplate(templateId, locale)
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
        title: formattedTemplate.notificationTitle,
        body: formattedTemplate.notificationBody,
        dataCopy: formattedTemplate.notificationDataCopy,
        clickAction: formattedTemplate.clickAction,
        created: notification.created,
        updated: notification.updated,
        status: notification.status,
      }
    } catch (error) {
      this.logger.error('Error formatting notification:', error)
      throw new InternalServerErrorException('Error processing notification')
    }
  }

  async addToCache(key: string, item: object) {
    return await this.cacheManager.set(key, item)
  }

  async getFromCache(key: string) {
    return await this.cacheManager.get(key)
  }

  mapLocale(locale?: string | null | undefined): string {
    return locale === 'en' ? locale : 'is-IS'
  }

  async getTemplates(
    locale?: string | null | undefined,
  ): Promise<HnippTemplate[]> {
    const mappedLocale = this.mapLocale(locale)

    this.logger.info(
      'Fetching templates from Contentful GQL for locale: ' + mappedLocale,
    )

    const contentfulHnippTemplatesQuery = {
      query: ` {
      hnippTemplateCollection(locale: "${mappedLocale}") {
        items {
          templateId
          notificationTitle
          notificationBody
          notificationDataCopy
          clickAction
          clickActionWeb
          category
          args
        }
      }
    }
    `,
    }

    const res = await axios
      .post(CONTENTFUL_GQL_ENDPOINT, contentfulHnippTemplatesQuery, {
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${ACCESS_TOKEN}`,
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
    const cacheKey = `${templateId}-${locale}`
    const cachedTemplate = await this.getFromCache(cacheKey)

    if (cachedTemplate) {
      this.logger.info(`cache hit for: ${cacheKey}`)

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

  formatArguments(args: ArgumentDto[], template: HnippTemplate): HnippTemplate {
    if (args.length > 0) {
      Object.keys(template).forEach((key) => {
        const templateKey = key as keyof HnippTemplate

        if (
          ALLOWED_REPLACE_PROPS.includes(templateKey) &&
          templateKey !== 'args'
        ) {
          const value = template[templateKey] as string

          if (value && ARG_REPLACE_REGEX.test(value)) {
            for (const arg of args) {
              const regexTarget = new RegExp(`{{${arg.key}}}`, 'g')
              const newValue = value.replace(regexTarget, arg.value)

              if (newValue !== value) {
                // finds {{key}} in string and replace with value
                template[templateKey] = value.replace(regexTarget, arg.value)
                break
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
      where: { id: id, recipient: user.nationalId },
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
    const templates = await this.getTemplates(query.locale)
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
            query.locale,
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
    locale: string,
  ): Promise<RenderedNotificationDto> {
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

 
}
