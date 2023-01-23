// import { LOGGER_PROVIDER } from '@island.is/logging'
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common'
import { createHnippNotificationDto } from './dto/createHnippNotification.dto'
import { HnippTemplate } from './dto/hnippTemplate.response'

@Injectable()
export class NotificationsService {
  // firebase: any
  constructor(
    // @Inject(LOGGER_PROVIDER)
    // private logger: Logger,
  ) {}

  // MOVE QUERY TO THE SOMETHING SOEMTHIGN
  async getTemplates(locale: string = 'is-IS'): Promise<any> {
    try {
      // this.logger.info('Fetching Templates from Contentful GQL')
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
      throw new BadRequestException('Error fetching templates')
    }
  }

  async getTemplate(
    templateId: string,
    locale: string = 'is-IS',
  ): Promise<HnippTemplate> {
    const templates = await this.getTemplates(locale)
    try {
      for (const template of templates) {
        if (template.templateId == templateId) {
          return template
        }
      }
      throw new BadRequestException('Requested template  not found')
    } catch {
      throw new BadRequestException('Requested template not found') /// ?
    }
  }

  async validateArgs(body: createHnippNotificationDto) {
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
    body: createHnippNotificationDto,
    template: HnippTemplate,
  ): Promise<any> {
    const re = /{{[^{}]*}}/
    if (body.args?.length == template.args?.length) {
      // scan object for {{}} for counts
      if (re.test(template.notificationBody)) {
        console.log('######## found')
        let element = body.args.shift()
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
          let element = body.args.shift()
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
          let element = body.args.shift()
          if (element) {
            template.clickAction = template.clickAction.replace(re, element)
          }
        }
      }
    }
    return template
  }

  // async sendFCM() {
  //   const notification = {
  //     title: 'title',
  //     body: 'body',
  //     category: 'category',
  //     appURI: 'appURI',
  //   }
  //   const tokens = ['remove me'] // "remove me"
  //   const {
  //     responses,
  //     successCount,
  //   } = await this.firebase.messaging().sendMulticast({
  //     tokens,
  //     notification: {
  //       title: notification.title,
  //       body: notification.body,
  //     },
  //     apns: {
  //       payload: {
  //         aps: {
  //           category: notification.category,
  //         },
  //       },
  //     },
  //     data: {
  //       ...(notification.appURI && { url: notification.appURI }),
  //     },
  //   })
  //   return { responses, successCount }
  // }

  async convertToNotification(
    message: createHnippNotificationDto,
  ): Promise<any> {
    //Notification

    // get template on selected language - map user profile locale to other
    const locale = 'en' //'is-IS' // enum en
    // formatArgs
    const template = await this.getTemplate(message.templateId, locale)

    // formatObject  FUNCTION
    const notification = {
      messageType: 'bogus', ///  phase me out .................
      title: template.notificationTitle,
      body: template.notificationBody,
      dataCopy: template.notificationDataCopy,
      category: template.category,
      appURI: template.clickAction, //`${this.appProtocol}://inbox/${message.documentId}`,
    }

    // FCM format
    return {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      apns: {
        payload: {
          aps: {
            category: notification.category,
          },
        },
      },
      data: {
        ...(notification.appURI && { url: notification.appURI }),
      },
    }
    // also test FCM objects
  }
}
