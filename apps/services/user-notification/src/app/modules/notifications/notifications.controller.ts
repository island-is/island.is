import {
  Inject,
  Body,
  Get,
  BadRequestException,
  CACHE_MANAGER,
  Param,
  Query,
  CacheTTL,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common'
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
import { createHnippNotificationDto } from './dto/createHnippNotification.dto'
import { Documentation } from '@island.is/nest/swagger'
import { HnippTemplate } from './dto/hnippTemplate.response'

import { Cache } from 'cache-manager'
import { NotificationsService } from './notifications.service'

import { Notification } from './types'


// move logic to service
// getEntry ... id ?
// cache Redis ? file system ? verify cache methods are ok global ok
// worker stuff
// openapi documentation
// lib for contentful graphql endpoint
// match fix legacy stuff
// cleanup


const CACHE_TTL = 60 // 1 minute
@Controller('notifications')
@ApiExtraModels(CreateNotificationDto)
export class NotificationsController {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @InjectQueue('notifications') private queue: QueueService,
    // private intlService: IntlService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly notificationsService: NotificationsService,
    
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
    // redirecting legacy hnipp to new hnipp setup
    return this.createHnippNotification({
      recipient: body.recipient,
      templateId: 'HNIPP.POSTHOLF.NEW_DOCUMENT',
      args: [body.organization, body.documentId],
    })
  }

  

  @Documentation({
    description: 'Fetches all templates',
    summary: 'Fetches all templates',
    includeNoContentResponse: true,
    response: { status: 200, type: [HnippTemplate] },
    request: {
      query: {
        locale: {
          required: false,
          type: 'string',
          example: 'is-IS',
        },
      },
    },
  })
  @CacheTTL(CACHE_TTL)
  @UseInterceptors(CacheInterceptor)
  @Get('/templates')
  async getTemplates(
    @Query('locale') locale: string = 'is-IS',
  ): Promise<HnippTemplate[]> {
    try {
      return await this.notificationsService.getContentfulHnippTemplateEntries(locale)
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
      query: {
        locale: {
          required: false,
          type: 'string',
          example: 'is-IS',
        },
      },
      params: {
        templateId: {
          type: 'string',
          description: 'ID of the template',
          example: 'HNIPP.POSTHOLF.NEW_DOCUMENT',
        },
      },
    },
  })
  @CacheTTL(CACHE_TTL)
  @UseInterceptors(CacheInterceptor)
  @Get('/template/:templateId')
  async getTemplate(
    @Param('templateId')
    templateId: string,
    @Query('locale') locale: string = 'is-IS',
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

  

  async convertToNotification(
    message: createHnippNotificationDto,
  ): Promise<any> { //Notification

    // get template on selected language - map user profile locale to other
    const locale = "en" //'is-IS' // enum en
    // formatArgs
    const template = await this.getTemplate(message.templateId, locale)
    
    
    
    // formatObject  FUNCTION
    const notification = {
      messageType: "bogus", ///  phase me out .................
      title: template.notificationTitle,
      body: template.notificationBody,
      dataCopy: template.notificationDataCopy,
      category: template.category,
      appURI: template.clickAction  //`${this.appProtocol}://inbox/${message.documentId}`,
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
        ...(notification.appURI && { url: notification.appURI }), // what is this doing ? tha () && part ?
      },
    }
    // also test FCM objects
    
  }


  // write tests for 0,1,2,3,4 args messages
  // tjekka gamla shape með messagetype
  // tjekks fyrir öll published templates

  @Post('/create-notification')
  async createHnippNotification(
    @Body() body: createHnippNotificationDto,
  ): Promise<any> {
    // check for template
    const template = await this.getTemplate(body.templateId)
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
    // add to queue
    return this.convertToNotification(body)
    return {body, template}
    const id = await this.queue.add(body)
    this.logger.info('Message queued ...', { messageId: id, ...body })
    return { id }
  }
}
