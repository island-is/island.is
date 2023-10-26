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
  UseGuards,
  Patch,
} from '@nestjs/common'
import { Controller, Post, HttpCode } from '@nestjs/common'
import {
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { UserNotificationScope } from '@island.is/auth/scopes'

import { NotificationsService } from './notifications.service'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'


@Controller({
  path: 'me/notifications',
})
@UseGuards(IdsUserGuard, ScopesGuard)
export class MeNotificationsController {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly notificationsService: NotificationsService,
  ) {}
  
  @Get('')
  @Scopes(UserNotificationScope.read) // IDS TODO
  @ApiSecurity('oauth2', [UserNotificationScope.read])
  @ApiTags("user notification")
  @Version('1')
  findAll(@Query('cursor') cursor: number): Promise<Notification[]> {
    return this.notificationsService.findAll(cursor);
  }
  
  @Get(':id')
  @Scopes(UserNotificationScope.read) // IDS TODO
  @ApiSecurity('oauth2', [UserNotificationScope.read])
  @ApiTags("user notification")
  @Version('1')
  findOne(@Param('id') id: number): Promise<Notification> {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @Scopes(UserNotificationScope.write) // IDS TODO
  @ApiSecurity('oauth2', [UserNotificationScope.write])
  @ApiTags("user notification")
  @Version('1')
  update(@Param('id') id: number): Promise<Notification> {
    return this.notificationsService.update(id);
  }
}
