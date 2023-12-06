import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Inject,
  Body,
  Get,
  Param,
  Query,
  UseInterceptors,
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
  async createDeprecatedNotification(
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
  @Version('1')
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
  @Version('1')
  async getNotificationTemplate(
    @Param('templateId')
    templateId: string,
    @Query('locale') locale: string,
  ): Promise<HnippTemplate> {
    return await this.notificationsService.getTemplate(templateId, locale)
  }

  @Documentation({
    description: 'Creates a new notification and adds to queue',
    summary: 'Creates a new notification and adds to queue',
    includeNoContentResponse: true,
    response: { status: 201, type: CreateNotificationResponse },
  })
  @Post('/')
  @Version('1')
  async createHnippNotification(
    @Body() body: CreateHnippNotificationDto,
  ): Promise<CreateNotificationResponse> {
    await this.notificationsService.validate(body.templateId, body.args)

    return this.notificationsService.addToQueue(body)
  }
}
