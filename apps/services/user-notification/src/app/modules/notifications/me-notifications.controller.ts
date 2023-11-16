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
  Put,
  Delete,
} from '@nestjs/common'
import { Controller, Post, HttpCode } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { NotificationsScope, UserProfileScope } from '@island.is/auth/scopes'

import { NotificationsService } from './notifications.service'
import { CurrentUser, IdsUserGuard, Scopes, ScopesGuard, User } from '@island.is/auth-nest-tools'
import { environment } from '../../../environments/environment'
import { Documentation } from '@island.is/nest/swagger'
import { Notification } from './notification.model'

import { CreateNotificationDto } from './dto/create-notification.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@Controller({
  path: 'me/notifications',
  version: '1',
})
export class MeNotificationsController {
  constructor(
    // @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly notificationService: NotificationsService,
  ) {}
  // @Post()
  // create(@Body() createNotificationDto: CreateNotificationDto) {
  //   return this.notificationService.create(createNotificationDto);
  // }

  @Get()
  @Scopes(NotificationsScope.read)
  @ApiTags("user-notification")
  @ApiSecurity('oauth2', [NotificationsScope.read])
  findAll(@CurrentUser() user: User, @Query('cursor') cursor?: number, @Query('limit') limit?: number) {
    return this.notificationService.findAll(cursor, limit);
  }

  @Get(':id')
  @Scopes(NotificationsScope.read)
  @ApiTags("user-notification")
  @ApiSecurity('oauth2', [NotificationsScope.read])
  findOne(@Param('id') id: number) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  @Scopes(NotificationsScope.write)
  @ApiTags("user-notification")
  @ApiSecurity('oauth2', [NotificationsScope.write])
  update(@Param('id') id: number, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  // @Delete(':id')
  // @Scopes(NotificationsScope.write)
  // @ApiTags("user-notification")
  // @ApiSecurity('oauth2', [NotificationsScope.write])
  // remove(@Param('id') id: string) {
  //   return this.notificationService.remove(id);
  // }

}
