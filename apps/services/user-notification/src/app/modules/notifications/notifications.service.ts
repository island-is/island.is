import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'
import { HnippTemplate } from './dto/hnippTemplate.response'
// import { getTemplates } from './queries/getTemplates'
@Injectable()
export class NotificationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  // MOVE QUERY TO THE SOMETHING SOEMTHIGN ..................................................................
  async getTemplates(locale: string): Promise<any> {
    if (locale == 'is') {
      locale = 'is-IS'
    }
    this.logger.info(
      'Fetching templates from Contentful GQL for locale: ' + locale,
    )
    try {
      const results = await fetch(
        'https://graphql.contentful.com/content/v1/spaces/8k0h54kbe6bj/environments/master',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + process.env.CONTENTFUL_DELIVERY_KEY, // TODO check for other envs
          },

          body: JSON.stringify({
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
          }),
        },
      )
      const templates = await results.json()

      // date temp check for cache
      for (const item of templates.data.hnippTemplateCollection.items) {
        item.date = new Date() // temp during cache testing
        // check for null args - can this be done in contentful?
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
    locale: string,
  ): Promise<HnippTemplate> {
    if (locale == 'is') {
      locale = 'is-IS'
    }
    const templates = await this.getTemplates(locale)
    try {
      for (const template of templates) {
        if (template.templateId == templateId) {
          return template
        }
      }
      throw new BadRequestException(
        `Requested template ${templateId} not found`,
      )
    } catch {
      throw new BadRequestException(
        `Requested template ${templateId} not found`,
      ) // ??
    }
  }

  async validateArgs(body: CreateHnippNotificationDto) {
    // check for template
    const template = await this.getTemplate(body.templateId) // cache ????????????????????????
    // check for args
    if (template.args?.length != body.args.length) {
      throw new BadRequestException(
        "Number of arguments doesn't match - template requires " +
          template.args?.length +
          ' arguments but ' +
          body.args?.length +
          ' were provided',
      )
    }
  }

  // shorten repetitive code................................
  async formatArguments(
    body: CreateHnippNotificationDto,
    template: HnippTemplate,
  ): Promise<any> {
    const re = /{{[^{}]*}}/
    if (body.args?.length == template.args?.length) {
      // scan object for {{}} for counts
      if (re.test(template.notificationBody)) {
        console.log('######## found')
        const element = body.args.shift()
        if (element) {
          template.notificationBody = template.notificationBody.replace(
            re,
            element,
          )
        }
      }
      if (template.notificationDataCopy) {
        if (re.test(template.notificationDataCopy)) {
          console.log('######## found')
          const element = body.args.shift()
          if (element) {
            template.notificationDataCopy = template.notificationDataCopy.replace(
              re,
              element,
            )
          }
        }
      }
      if (template.clickAction) {
        if (re.test(template.clickAction)) {
          console.log('######## found')
          const element = body.args.shift()
          if (element) {
            template.clickAction = template.clickAction.replace(re, element)
          }
        }
      }
    }
    return template
  }
}
