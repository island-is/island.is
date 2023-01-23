import {
  Inject,
  Body,
  Get,

  Param,
  Query,
  CacheInterceptor,
  UseInterceptors,

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

import { createHnippNotificationDto } from './dto/createHnippNotification.dto'
import { Documentation } from '@island.is/nest/swagger'
import { HnippTemplate } from './dto/hnippTemplate.response'

import { Cache } from 'cache-manager'
import { NotificationsService } from './notifications.service'

import * as firebaseAdmin from 'firebase-admin'
export const FIREBASE_PROVIDER = 'FIREBASE_PROVIDER'

const CACHE_TTL = 60 // 1 minute
// REMOVE HNIPP FROM NAMES ... GO FOR NOTIFICATIONS INSTEAD ... PUSH NOTIFICATIONS
// LOCALE MAPPINGS
import { Locale } from '@island.is/shared/types'

@Controller('notifications')
@ApiExtraModels(CreateNotificationDto)
// @UseInterceptors(CacheInterceptor) // To enable auto-caching responses, just tie the CacheInterceptor where you want to cache data.
export class NotificationsController {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @InjectQueue('notifications') private queue: QueueService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly notificationsService: NotificationsService,
    @Inject(FIREBASE_PROVIDER) private firebase: firebaseAdmin.app.App,
    // @Inject(forwardRef(() => CACHE_MANAGER)) private readonly cacheManager: Cache
  ) {}

  // legacy hnipp to new hnipp setup redirect for backwards compatibility
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
  // @CacheTTL(CACHE_TTL)
  // @UseInterceptors(CacheInterceptor)
  @Get('/templates')
  async getNotificationTemplates(
    @Query('locale') locale: string = 'is-IS',
  ): Promise<HnippTemplate[]> {
    return await this.notificationsService.getTemplates(locale)
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
  // @CacheTTL(CACHE_TTL)
  // @UseInterceptors(CacheInterceptor)
  @Get('/template/:templateId')
  async getNotificationTemplate(
    @Param('templateId')
    templateId: string,
    @Query('locale') locale: string = 'is-IS',
  ): Promise<HnippTemplate> {
    return await this.notificationsService.getTemplate(templateId, locale)
  }

  
  

  @Post('/create-notification')
  async createHnippNotification(
    @Body() body: createHnippNotificationDto,
  ): Promise<CreateNotificationResponse> {
    // test stuff
    // if (true) {
    //   const template = await this.notificationsService.getTemplate(body.templateId)
    //   return this.notificationsService.formatArguments(body, template)
    //   // translate select language
    //   return this.notificationsService.convertToNotification(body)
    // }
    // validate
    this.notificationsService.validateArgs(body)
    // add to queue
    const id = await this.queue.add(body)
    this.logger.info('Message queued ...', { messageId: id, ...body })
    return { id }
  }
}
