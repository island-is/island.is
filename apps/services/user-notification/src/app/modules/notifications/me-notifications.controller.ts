import {
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  Patch,
  Controller,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import { notificationScopes } from '@island.is/auth/scopes'
import { NotificationsService } from './notifications.service'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import type { Locale } from '@island.is/shared/types'

import {
  UpdateNotificationDto,
  PaginatedNotificationDto,
  RenderedNotificationDto,
  ExtendedPaginationDto,
  UnreadNotificationsCountDto,
  UnseenNotificationsCountDto,
} from './dto/notification.dto'
import { Documentation } from '@island.is/nest/swagger'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(...notificationScopes)
@ApiSecurity('oauth2', notificationScopes)
@ApiTags('user-notification')
@Controller({
  path: 'me/notifications',
  version: '1',
})
export class MeNotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get()
  @Documentation({
    summary: 'Returns a paginated list of current user notifications',
    response: { status: HttpStatus.OK, type: PaginatedNotificationDto },
  })
  findMany(
    @CurrentUser() user: User,
    @Query() query: ExtendedPaginationDto,
  ): Promise<PaginatedNotificationDto> {
    return this.notificationService.findManyWithTemplate(
      user.nationalId,
      query,
      user.scope,
    )
  }

  @Get('/unread-count')
  @Documentation({
    summary: 'Returns a count of unread notifications for the current user',
    response: { status: HttpStatus.OK, type: UnreadNotificationsCountDto },
  })
  async getUnreadNotificationsCount(
    @CurrentUser() user: User,
  ): Promise<UnreadNotificationsCountDto> {
    return await this.notificationService.getUnreadNotificationsCount(user)
  }

  @Get('/unseen-count')
  @Documentation({
    summary: 'Returns a count of unseen notifications for the current user',
    response: { status: HttpStatus.OK, type: UnseenNotificationsCountDto },
  })
  async getUnseenNotificationsCount(
    @CurrentUser() user: User,
  ): Promise<UnseenNotificationsCountDto> {
    return await this.notificationService.getUnseenNotificationsCount(user)
  }

  @Get(':id')
  @Documentation({
    summary: 'Returns current user specific notification',
    response: { status: HttpStatus.OK, type: RenderedNotificationDto },
  })
  findOne(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Query('locale') locale?: Locale,
  ): Promise<RenderedNotificationDto> {
    return this.notificationService.findOne(user, id, locale)
  }

  @Post('/mark-all-as-seen')
  @Documentation({
    summary: 'Updates all of  current user notifications as seen',
    response: { status: HttpStatus.NO_CONTENT },
  })
  async markAllAsSeen(@CurrentUser() user: User): Promise<void> {
    await this.notificationService.markAllAsSeen(user)
  }

  @Post('/mark-all-as-read')
  @Documentation({
    summary: 'Updates all of  current user notifications as read',
    response: { status: HttpStatus.NO_CONTENT },
  })
  async markAllAsRead(@CurrentUser() user: User): Promise<void> {
    await this.notificationService.markAllAsRead(user)
  }

  @Documentation({
    summary: 'Updates current user specific notification',
    response: { status: HttpStatus.OK, type: RenderedNotificationDto },
  })
  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @Query('locale') locale?: Locale,
  ): Promise<RenderedNotificationDto> {
    return this.notificationService.update(
      user,
      id,
      updateNotificationDto,
      locale,
    )
  }
}
