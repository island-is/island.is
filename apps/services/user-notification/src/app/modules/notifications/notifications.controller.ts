import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Inject,
  Body,
  Get,
  Param,
  Query,
  UseInterceptors,
  BadRequestException,
  Version,
  VERSION_NEUTRAL,
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
@UseInterceptors(CacheInterceptor)
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
  @Version(VERSION_NEUTRAL)
  async createNotification(
    @Body() body: CreateNotificationDto,
  ): Promise<CreateNotificationResponse> {
    return this.createHnippNotification({
      recipient: body.recipient,
      templateId: 'HNIPP.POSTHOLF.NEW_DOCUMENT',
      args: [
        {
          key: 'organization',
          value: body.organization,
        },
        {
          key: 'documentId',
          value: body.documentId,
        },
      ],
    })
  }

  @Documentation({
    summary: 'Fetches all notification templates',
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
  @Version('1')
  async getNotificationTemplates(
    @Query('locale') locale: string,
  ): Promise<HnippTemplate[]> {
    return await this.notificationsService.getTemplates(locale)
  }

  @Documentation({
    summary: 'Fetches a single notification template',
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
  @Version('1')
  async getNotificationTemplate(
    @Param('templateId')
    templateId: string,
    @Query('locale') locale: string,
  ): Promise<HnippTemplate> {
    return await this.notificationsService.getTemplate(templateId, locale)
  }

  @Documentation({
    summary: 'Creates a new notification and adds to queue',
    includeNoContentResponse: true,
    response: { status: 201, type: CreateNotificationResponse },
  })
  @Post('/')
  @Version('1')
  async createHnippNotification(
    @Body() body: CreateHnippNotificationDto,
  ): Promise<CreateNotificationResponse> {
    const template = await this.notificationsService.getTemplate(
      body.templateId,
    )
    // check counts
    if (!this.notificationsService.validateArgCounts(body, template)) {
      throw new BadRequestException(
        "Number of arguments doesn't match - template requires " +
          template.args.length +
          ' arguments but ' +
          body.args.length +
          ' were provided',
      )
    }
    // check keys/args/properties
    for (const arg of body.args) {
      if (!template.args.includes(arg.key)) {
        throw new BadRequestException(
          arg.key +
            ' is not a valid argument for template: ' +
            template.templateId,
        )
      }
    }

    // add to queue
    const id = await this.queue.add(body)
    this.logger.info('Message queued ... ...', { messageId: id, ...body })
    return { id }
  }

  @Get('/')
  @Version('1')
  async getAll(): Promise<any> {
    return await this.notificationsService.getAll()
  }
}
