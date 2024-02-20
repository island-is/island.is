import {
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  Patch,
  Controller,
  HttpStatus,
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
  UnreadNotificationsCountDto,
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
    response: { status: HttpStatus.OK, type: PaginatedNotificationDto },
  })
  findMany(
    @CurrentUser() user: User,
    @Query() query: ExtendedPaginationDto,
  ): Promise<PaginatedNotificationDto> {
    return this.notificationService.findMany(user, query)
  }

  @Get("/unread-count")
  @Documentation({
    summary: 'Returns a count of unread notifications for the user',
    response: { status: HttpStatus.OK, type: UnreadNotificationsCountDto },
  })
  async getUnreadNotificationsCount(
    @CurrentUser() user: User
  ): Promise<{ unreadCount: number }> {
    const unreadCount = await this.notificationService.getUnreadNotificationsCount(user);
    return { unreadCount };
  }


  

  @Get(':id')
  @Documentation({
    summary: 'Returns a specific user notification',
    response: { status: HttpStatus.OK, type: RenderedNotificationDto },
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
    response: { status: HttpStatus.OK, type: RenderedNotificationDto },
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

  // @Patch('/mark-all-as-read')
  // @Scopes(NotificationsScope.write)
  // @ApiSecurity('oauth2', [NotificationsScope.write])
  // @Documentation({
  //   summary: 'Updates all user notifications as read',
  //   response: { status: HttpStatus.NO_CONTENT },
  // })  async markAllAsRead(@CurrentUser() user: User): Promise<void> {
  //   await this.notificationService.markAllAsRead(user);
  // }
}
