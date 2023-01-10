import { Inject, Body, Get, BadRequestException } from '@nestjs/common'
import { Controller, Post, HttpCode } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiBody,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CreateNotificationDto } from './dto/createNotification.dto'
import { InjectQueue, QueueService } from '@island.is/message-queue'
import { CreateNotificationResponse } from './dto/createNotification.response'

import { IntlService } from '@island.is/cms-translations'
import messages from '../../../messages'
import { ViewTemplateDto } from './dto/viewTemplate.dto'
import { StringNullableChain } from 'lodash'
import { createHnippNotificationDto } from './dto/createHnippNotification.dto'
import { Documentation } from '@island.is/nest/swagger'
import { HnippTemplate } from './dto/hnippTemplate.response'



// move logic to service 
  // getEntry ...
  // cache Redis ?
  // worker stuff
  // openapi documentation

  // match fix legacy stuff

@Controller('notifications')
@ApiExtraModels(CreateNotificationDto)
export class NotificationsController {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @InjectQueue('notifications') private queue: QueueService,
    private intlService: IntlService,
  ) {}

  @ApiBody({
    schema: {
      type: 'object',
      oneOf: [{ $ref: getSchemaPath(CreateNotificationDto) }],
    },
  })
  @ApiOkResponse({ type: CreateNotificationResponse })
  @HttpCode(201)
  @Post()
  async createNotification(
    @Body() body: CreateNotificationDto,
  ): Promise<CreateNotificationResponse> {
    const id = await this.queue.add(body)
    this.logger.info('Message queued extended', { messageId: id, ...body })
    return { id }
  }

  async getEntries(locale: string): Promise<[HnippTemplate]> {
    let results = await fetch(
      'https://graphql.contentful.com/content/v1/spaces/8k0h54kbe6bj/environments/master',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + process.env.CONTENTFUL_DELIVERY_KEY,
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
    return templates.data.hnippTemplateCollection.items
  }


  @Documentation({
    description: 'Gets all notification templates',
    includeNoContentResponse: true,
    response: { status: 200, type: [HnippTemplate] },
  })
  @Get('/templates')
  async notificationTemplates(): Promise<HnippTemplate[]> {
    return await this.getEntries('is-IS')
   
  }

  @Documentation({
    description: 'Gets a notification template',
    includeNoContentResponse: true,
    response: { status: 200, type: HnippTemplate },
  })
  @Get('/template/:templateId')
  async getTemplate(templateId: string): Promise<HnippTemplate> {
    for (const template of await this.getEntries('is-IS')) {
      if (template.templateId === templateId) {
        return template
      }
    }
    throw new BadRequestException('Template not found');
  }



  @Post('/preview-template')
  async notificationTemplate(@Body() body: ViewTemplateDto): Promise<any> {
    for (const template of await this.getEntries(body.locale)) {
      // lazy get fix later
      if (template.templateId === body.templateId) {
        let placeholders: string[] = []
        const re = /{{[^{}]*}}/
        for (const [key, value] of Object.entries(template)) {
          if (re.test(value)) {
            let placeholder = value.match(re)
            placeholders.push(placeholder[0])
          }
        }
        console.log(placeholders)

        if (body.args?.length !== placeholders.length) {
          throw new BadRequestException(
            "Number of arguments doesn't match - template requires " +
              placeholders.length +
              ' arguments but ' +
              body.args?.length +
              ' were provided',
          )
        }

        if (body.args?.length == placeholders.length) {
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
          if(template.notificationDataCopy){
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
        if(template.clickAction){
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
    }
  }

   
  @Post('/create-notification')
  async createNotificationzah(
    @Body() body: createHnippNotificationDto,
  ): Promise<any> {
    return { id: 'some-message-queue-id' }
  }
}







// const templates = []
// for (const template of await this.getEntries('is-IS')) {
//   templates.push(template.templateId)
// }

// return templates

// const contentful = require('contentful')
// const client = contentful.createClient({
//   space: '8k0h54kbe6bj',
//   accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
// })
// return client.getEntries({
//   content_type: 'hnippTemplate',
// })

// // const t = await this.intlService.useIntl(
// //   ['user-notification.messages'],
// //   'en',
// //   // profile.locale ?? 'is',
// // )
// const message = {
//   notification: {
//     title: 'title',
//     body: 'body',
//   },
//   data: {
//     islandIsUrl: 'https://island.is/minarsidur',
//     copy: 'ég er data.copy',
//   },
//   apns: {
//     payload: {
//       aps: {
//         category: 'ISLANDIS_LINK',
//       },
//     },
//   },
// }
// const stringy = JSON.stringify(message)
// const shifted = stringy.replace(/"/gi, '\\"')
// return shifted

// return messages