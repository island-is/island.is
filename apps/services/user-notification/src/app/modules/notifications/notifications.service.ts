import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'
import { HnippTemplate } from './dto/hnippTemplate.response'
import { Cache } from 'cache-manager'

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async addToCache(key: string, item: any) {
    // item = JSON.stringify(item)
    const res = await this.cacheManager.set(key, item)
    console.log(res)
  }

  async getFromCache(key: string) {
    const item = await this.cacheManager.get(key)
    return item
  }

  async getTemplates(locale?: string): Promise<HnippTemplate[]> {
    if (locale == 'is' || locale === undefined) {
      locale = 'is-IS'
    }

    this.logger.info(
      'Fetching templates from Contentful GQL for locale: ' + locale,
    )
    const contentfulGqlUrl =
      'https://graphql.contentful.com/content/v1/spaces/8k0h54kbe6bj/environments/master'
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
    try {
      const results = await fetch(contentfulGqlUrl, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + process.env.CONTENTFUL_ACCESS_TOKEN,
        },

        body: JSON.stringify(contentfulHnippTemplatesQuery),
      })
      const templates = await results.json()

      for (const item of templates.data.hnippTemplateCollection.items) {
        //cache check
        item.date = new Date().toISOString()
        if (item.args == null) {
          item.args = []
        }
      }
      return templates.data.hnippTemplateCollection.items
    } catch {
      throw new BadRequestException('Error fetching templates from Contentful')
    }
  }

  async getTemplate(
    templateId: string,
    locale?: string,
  ): Promise<HnippTemplate> {
    if (locale == 'is') {
      locale = 'is-IS'
    }
    //check cache
    const cacheKey = templateId + '-' + locale
    const cachedTemplate = await this.getFromCache(cacheKey)
    if (cachedTemplate) {
      console.log('cache hit')
      return cachedTemplate as HnippTemplate
    }

    const templates = await this.getTemplates(locale)
    try {
      for (const template of templates) {
        if (template.templateId == templateId) {
          await this.addToCache(cacheKey, template)
          return template
        }
      }
      throw new BadRequestException(
        `Requested template ${templateId} not found`,
      )
    } catch {
      throw new BadRequestException(
        `Requested template ${templateId} not found ***`,
      )
    }
  }

  validateArgCounts(
    body: CreateHnippNotificationDto,
    template: HnippTemplate,
  ): boolean {
    return template.args.length == body.args.length
  }

  formatArguments(
    body: CreateHnippNotificationDto,
    template: HnippTemplate,
  ): HnippTemplate {
    if (template.args.length != body.args.length) {
      throw new BadRequestException('Argument count mismatch')
    }
    if (template.args.length > 0) {
      const allowedReplaceProperties = [
        'notificationTitle',
        'notificationBody',
        'notificationDataCopy',
        'clickAction',
      ]
      const regex = /{{[^{}]*}}/ // "finds {{placholder}} in string"
      Object.keys(template).forEach((key) => {
        if (allowedReplaceProperties.includes(key)) {
          if (template[key as keyof HnippTemplate]) {
            if (regex.test(template[key as keyof HnippTemplate] as string)) {
              const element = body.args.shift()
              if (element) {
                template[key as keyof Omit<HnippTemplate, 'args'>] = (template[
                  key as keyof Omit<HnippTemplate, 'args'>
                ] as string).replace(regex, element)
              }
            }
          }
        }
      })
    }
    return template
  }
}
