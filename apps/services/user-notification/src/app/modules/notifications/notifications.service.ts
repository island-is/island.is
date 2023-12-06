import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { InjectQueue, QueueService } from '@island.is/message-queue'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  ArgumentDto,
  CreateHnippNotificationDto,
} from './dto/createHnippNotification.dto'
import { HnippTemplate } from './dto/hnippTemplate.response'
import { Cache } from 'cache-manager'
import axios from 'axios'

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
    @InjectQueue('notifications') private queue: QueueService,
  ) {}

  async addToCache(key: string, item: object) {
    return await this.cacheManager.set(key, item)
  }

  async getFromCache(key: string) {
    return await this.cacheManager.get(key)
  }

  async mapLocale(locale?: string | null): Promise<string> {
    return locale === 'en' ? locale : 'is-IS'
  }

  async getTemplates(
    locale?: string | null | undefined,
  ): Promise<HnippTemplate[]> {
    const mappedLocale = await this.mapLocale(locale)

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
    locale = await this.mapLocale(locale)
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

  async addToQueue(body: CreateHnippNotificationDto): Promise<{ id: string }> {
    const id = await this.queue.add(body)
    this.logger.info('Message queued ... ...', { messageId: id, ...body })

    return { id }
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
}
