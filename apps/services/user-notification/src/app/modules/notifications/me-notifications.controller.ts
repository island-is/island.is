import {
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  Patch,
  Controller,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import { NotificationsScope } from '@island.is/auth/scopes'
import { NotificationsService } from './notifications.service'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

import {
  UpdateNotificationDto,
  PaginatedNotificationDto,
  RenderedNotificationDto,
  ExtendedPaginationDto,
} from './dto/notification.dto'
import { Documentation } from '@island.is/nest/swagger'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(NotificationsScope.read)
@ApiSecurity('oauth2', [NotificationsScope.read])
@ApiTags('user-notification')
@Controller({
  path: 'me/notifications',
  version: '1',
})
export class MeNotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get()
  @Documentation({
    summary: 'Returns a paginated list of user notifications',
    response: { status: 200, type: PaginatedNotificationDto },
  })
  findMany(
    @CurrentUser() user: User,
    @Query() query: ExtendedPaginationDto,
  ): Promise<PaginatedNotificationDto> {
    return this.notificationService.findMany(user, query)
  }

  @Get(':id')
  @Documentation({
    summary: 'Returns a specific user notification',
    response: { status: 200, type: RenderedNotificationDto },
  })
  findOne(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Query('locale') locale: string,
  ): Promise<RenderedNotificationDto> {
    return this.notificationService.findOne(user, id, locale)
  }

  @Documentation({
    summary: 'Updates a specific user notification',
    response: { status: 200, type: RenderedNotificationDto },
  })
  @Patch(':id')
  @Scopes(NotificationsScope.write)
  @ApiSecurity('oauth2', [NotificationsScope.write])
  update(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @Query('locale') locale: string,
  ): Promise<RenderedNotificationDto> {
    return this.notificationService.update(
      user,
      id,
      updateNotificationDto,
      locale,
    )
  }
}
