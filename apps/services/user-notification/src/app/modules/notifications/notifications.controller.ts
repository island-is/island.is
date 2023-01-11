import {
  Inject,
  Body,
  Get,
  BadRequestException,
  CACHE_MANAGER,
  UseInterceptors,
  CacheInterceptor,
  CacheTTL,
  Param,
} from '@nestjs/common'
import { Controller, Post, HttpCode } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiBody,
  ApiExtraModels,
  getSchemaPath,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CreateNotificationDto } from './dto/createNotification.dto'
import { InjectQueue, QueueService } from '@island.is/message-queue'
import { CreateNotificationResponse } from './dto/createNotification.response'

import { IntlService } from '@island.is/cms-translations'
import { ViewTemplateDto } from './dto/viewTemplate.dto'
import { createHnippNotificationDto } from './dto/createHnippNotification.dto'
import { Documentation } from '@island.is/nest/swagger'
import { HnippTemplate } from './dto/hnippTemplate.response'

import { Cache } from 'cache-manager'

import { ContentfulRepository } from '@island.is/cms'

// move logic to service
// getEntry ... id ?
// cache Redis ? file system ? verify cache methods are ok global ok
// worker stuff
// openapi documentation
// lib for contentful graphql endpoint
// match fix legacy stuff
// cleanup

const HNIPP_TEMPLATES_KEY = 'hnippTemplates'

@Controller('notifications')
@ApiExtraModels(CreateNotificationDto)
export class NotificationsController {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @InjectQueue('notifications') private queue: QueueService,
    private intlService: IntlService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    // return to initial state
    const id = await this.queue.add(body)
    this.logger.info('Message queued', { messageId: id, ...body })
    return { id }
  }

  // MOVE TO UTILS ?
  async getContentfulHnippTemplateEntries(): Promise<any> {
    // check cache
    const caches_templates = await this.cacheManager.get(HNIPP_TEMPLATES_KEY)
    if (caches_templates) {
      return caches_templates
    }

    let results = await fetch(
      'https://graphql.contentful.com/content/v1/spaces/8k0h54kbe6bj/environments/master',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.CONTENTFUL_DELIVERY_KEY,
        },

        body: JSON.stringify({
          query: ` {
            hnippTemplateCollection(locale: "is-IS") {
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

    // temp check for cache
    let templates = await results.json()
    templates.data.hnippTemplateCollection.items.forEach(
      (item: { date: Date }) => {
        item.date = new Date()
      },
    )

    // add to cache
    const res = await this.cacheManager.set(
      HNIPP_TEMPLATES_KEY,
      templates.data.hnippTemplateCollection.items,
      30, // update me
    )

    return templates.data.hnippTemplateCollection.items
  }

  @Documentation({
    description: 'Fetches all templates',
    summary: 'Fetches all templates',
    includeNoContentResponse: true,
    response: { status: 200, type: [HnippTemplate] },
    request: {
      query: {},
      params: {},
    },
  })
  @Get('/templates')
  async getTemplates(): Promise<HnippTemplate[]> {
    try {
      return await this.getContentfulHnippTemplateEntries()
    } catch {
      throw new BadRequestException('Error fetching templates')
    }
  }

  @Documentation({
    description: 'Fetches a single template',
    summary: 'Fetches a single template',
    includeNoContentResponse: true,
    response: { status: 200, type: HnippTemplate },
    request: {
      query: {},
      params: {
        templateId: {
          type: 'string',
          description: 'templateId',
        },
      },
    },
  })
  @Get('/template/:templateId')
  async getTemplate(
    @Param('templateId')
    templateId: string,
  ): Promise<HnippTemplate> {
    const templates = await this.getTemplates()
    try {
      for (const template of templates) {
        if (template.templateId == templateId) {
          return template
        }
      }
      throw new BadRequestException('Requested template  not found')
    } catch {
      throw new BadRequestException('Requested template not found')
    }
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

  @Post('/create-notification')
  async createHnippNotification(
    @Body() body: createHnippNotificationDto,
  ): Promise<any> {
    const template = await this.getTemplate(body.templateId)
    if (template.args?.length != body.args.length) {
      throw new BadRequestException(
        "Number of arguments doesn't match - template requires " +
          template.args?.length +
          ' arguments but ' +
          body.args?.length +
          ' were provided',
      )
    }
    const id = await this.queue.add(body)
    this.logger.info('Message queued extended', { messageId: id, ...body })
    return { id }
  }

  // #############################################################################################

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(5) // override TTL to 30 seconds
  @Get('/stuff')
  async stuff(): Promise<any> {
    const contentfulRespository = new ContentfulRepository()
    return await contentfulRespository.getLocalizedEntries('is-IS', {
      content_type: 'hnippTemplate',
    })
  }
}
