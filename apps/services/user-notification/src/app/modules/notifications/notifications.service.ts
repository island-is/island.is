import { LOGGER_PROVIDER } from '@island.is/logging'
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common'
import { Cache } from 'cache-manager'

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  
  async getContentfulHnippTemplateEntries(
    locale: string = 'is-IS',
  ): Promise<any> {
    // check cache
    // const cache_key = 'hnipp_templates_' + locale
    // const caches_templates = await this.cacheManager.get(cache_key)
    // if (caches_templates) {
    //   return caches_templates
    // }

    let results = await fetch(
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

    let templates = await results.json()
    
    // // date temp check for cache
    // for (const item of templates.data.hnippTemplateCollection.items) {
    //   item.date = new Date()
    //   if (item.args == null) {
    //     item.args = []
    //   }
    // }

    // // add to cache
    // const res = await this.cacheManager.set(
    //   cache_key,
    //   templates.data.hnippTemplateCollection.items,
    //   60, // update me
    // )

    return templates.data.hnippTemplateCollection.items
  }


    // @Post('/preview-template')
  // async notificationTemplate(@Body() body: ViewTemplateDto): Promise<any> {
  //   for (const template of await this.getContentfulHnippTemplateEntries()) {
  //     // lazy get fix later
  //     if (template.templateId === body.templateId) {
  //       let placeholders: string[] = []
  //       const re = /{{[^{}]*}}/
  //       for (const [key, value] of Object.entries(template)) {
  //         if (re.test(value)) {
  //           let placeholder = value.match(re)
  //           placeholders.push(placeholder[0])
  //         }
  //       }

  //       if (body.args?.length !== placeholders.length) {
  //         throw new BadRequestException(
  //           "Number of arguments doesn't match - template requires " +
  //             placeholders.length +
  //             ' arguments but ' +
  //             body.args?.length +
  //             ' were provided',
  //         )
  //       }

  //       if (body.args?.length == placeholders.length) {
  //         // scan object for {{}} for counts
  //         if (re.test(template.notificationBody)) {
  //           console.log('######## found')
  //           let element = body.args.shift()
  //           if (element) {
  //             template.notificationBody = template.notificationBody.replace(
  //               re,
  //               element,
  //             )
  //           }
  //         }
  //         if (template.notificationDataCopy) {
  //           if (re.test(template.notificationDataCopy)) {
  //             console.log('######## found')
  //             let element = body.args.shift()
  //             if (element) {
  //               template.notificationDataCopy = template.notificationDataCopy.replace(
  //                 re,
  //                 element,
  //               )
  //             }
  //           }
  //         }
  //         if (template.clickAction) {
  //           if (re.test(template.clickAction)) {
  //             console.log('######## found')
  //             let element = body.args.shift()
  //             if (element) {
  //               template.clickAction = template.clickAction.replace(re, element)
  //             }
  //           }
  //         }
  //       }
  //       return template
  //     }
  //   }
  // }
}
