import { InjectQueue, QueueService } from '@island.is/message-queue'
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Documentation } from '@island.is/nest/swagger'

import { CreateNotificationResponse } from './dto/createNotification.response'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'
import { HnippTemplate } from './dto/hnippTemplate.response'
import { NotificationsService } from './notifications.service'
import type { Locale } from '@island.is/shared/types'
import {
  ExtendedPaginationDto,
  PaginatedNotificationDto,
  PaginatedActorNotificationDto,
} from './dto/notification.dto'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { AdminPortalScope, notificationScopes } from '@island.is/auth/scopes'

@Controller('notifications')
@ApiTags('notifications')
export class NotificationsController {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly notificationsService: NotificationsService,
    @InjectQueue('notifications') private queue: QueueService,
  ) {}

  @Documentation({
    summary: 'Fetches all notification templates',
    includeNoContentResponse: true,
    response: { status: 200, type: [HnippTemplate] },
    request: {
      query: {
        locale: {
          required: false,
          type: 'string',
          description: 'locale',
          example: 'en',
        },
      },
    },
  })
  @Get('/templates')
  @Version('1')
  async getNotificationTemplates(
    @Query('locale') locale?: Locale,
  ): Promise<HnippTemplate[]> {
    this.logger.info(`Fetching hnipp templates for locale: ${locale}`)
    return await this.notificationsService.getTemplates(locale)
  }

  @Documentation({
    summary: 'Fetches a single notification template',
    includeNoContentResponse: true,
    response: { status: 200, type: HnippTemplate },
    request: {
      params: {
        templateId: {
          type: 'string',
          description: 'ID of the template',
          example: 'HNIPP.POSTHOLF.NEW_DOCUMENT',
        },
      },
      query: {
        locale: {
          required: false,
          type: 'string',
          description: 'locale',
          example: 'en',
        },
      },
    },
  })
  @Get('/template/:templateId')
  @Version('1')
  async getNotificationTemplate(
    @Param('templateId')
    templateId: string,
    @Query('locale') locale: Locale,
  ): Promise<HnippTemplate> {
    return await this.notificationsService.getTemplate(templateId, locale)
  }

  @UseGuards(IdsUserGuard, ScopesGuard)
  @Scopes(AdminPortalScope.serviceDesk)
  @Get('/')
  @Documentation({
    summary: 'Returns a paginated list of notifications for a national id',
    response: { status: HttpStatus.OK, type: PaginatedNotificationDto },
  })
  findMany(
    @Headers('X-Query-National-Id') nationalId: string,
    @Query() query: ExtendedPaginationDto,
  ): Promise<PaginatedNotificationDto> {
    return this.notificationsService.findMany(
      nationalId,
      query,
      notificationScopes,
    )
  }

  @UseGuards(IdsUserGuard, ScopesGuard)
  @Scopes(AdminPortalScope.serviceDesk)
  @Get('/actor')
  @Documentation({
    summary:
      'Returns a paginated list of actor notifications for a national id',
    response: { status: HttpStatus.OK, type: PaginatedActorNotificationDto },
  })
  findActorNotifications(
    @Headers('X-Query-National-Id') nationalId: string,
    @Query() query: ExtendedPaginationDto,
  ): Promise<PaginatedActorNotificationDto> {
    return this.notificationsService.findActorNotifications(nationalId, query)
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
    this.notificationsService.validate(template, body.args)
    const validArgs = this.notificationsService.sanitize(template, body.args)

    const sanitizedBody = {
      ...body,
      args: validArgs,
    }

    const id = await this.queue.add(sanitizedBody)
    const flattenedArgs: Record<string, string> = {}
    for (const arg of validArgs) {
      flattenedArgs[arg.key] = arg.value
    }
    this.logger.info('Message queued', {
      messageId: id,
      ...flattenedArgs,
      ...sanitizedBody,
      args: {}, // Remove args, since they're in a better format in `flattenedArgs`
      queue: { url: this.queue.url, name: this.queue.queueName },
    })

    return {
      id,
    }
  }
}
