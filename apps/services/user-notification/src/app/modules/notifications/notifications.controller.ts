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
  ApiOperation,
} from '@nestjs/swagger'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CreateNotificationDto } from './dto/createNotification.dto'
import { InjectQueue, QueueService } from '@island.is/message-queue'
import { CreateNotificationResponse } from './dto/createNotification.response'

import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'
import { Documentation } from '@island.is/nest/swagger'
import { HnippTemplate } from './dto/hnippTemplate.response'

import { NotificationsService } from './notifications.service'

@Controller('notifications')
@ApiExtraModels(CreateNotificationDto)
@UseInterceptors(CacheInterceptor) // auto-caching GET responses
export class NotificationsController {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @InjectQueue('notifications') private queue: QueueService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // redirecting legacy endpoint to new one with fixed values
  @ApiBody({
    schema: {
      type: 'object',
      oneOf: [{ $ref: getSchemaPath(CreateNotificationDto) }],
    },
  })
  @ApiOkResponse({ type: CreateNotificationResponse })
  @ApiOperation({ deprecated: true })
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
  @Get('/templates')
  async getNotificationTemplates(
    @Query('locale') locale: string,
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
  @Get('/template/:templateId')
  async getNotificationTemplate(
    @Param('templateId')
    templateId: string,
    @Query('locale') locale: string,
  ): Promise<HnippTemplate> {
    return await this.notificationsService.getTemplate(templateId, locale)
  }

  @Post('/create-notification')
  async createHnippNotification(
    @Body() body: CreateHnippNotificationDto,
  ): Promise<any | CreateNotificationResponse> {
    const template = await this.notificationsService.getTemplate(
      body.templateId,
    )
    // return this.notificationsService.formatArguments(body, template)
    // validate
    this.notificationsService.validateArgCounts(body, template)
    // if (template.args?.length != body.args.length) {
    //   throw new BadRequestException(
    //     "Number of arguments doesn't match - template requires " +
    //       template.args?.length +
    //       ' arguments but ' +
    //       body.args?.length +
    //       ' were provided',
    //   )
    // }
    // add to queue
    const id = await this.queue.add(body)
    this.logger.info('Message queued ... ...', { messageId: id, ...body })
    return { id }
  }
}
