import {
  Inject,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  Patch,
  HttpStatus,
} from '@nestjs/common'
import { Controller, Post, HttpCode } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { NotificationsScope } from '@island.is/auth/scopes'
import { NotificationsService } from './notifications.service'
import { CurrentUser, IdsUserGuard, Scopes, ScopesGuard, User } from '@island.is/auth-nest-tools'
import { PaginationDto } from '@island.is/nest/pagination'
import { ExtendedNotificationDto, UpdateNotificationDto, PaginatedNotificationDto, RenderedNotificationDto } from './dto/notification.dto'
import { Documentation } from '@island.is/nest/swagger'



@UseGuards(IdsUserGuard, ScopesGuard)
@Controller({
  path: 'me/notifications',
  version: '1',
})
export class MeNotificationsController {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly notificationService: NotificationsService,
  ) {}
  
  /// REMOVE ME BEFORE MERGING
  @Post()/// TEMPORARY FOR EASY CREATING NOTIFICATIONS
  @Scopes(NotificationsScope.read)
  @ApiTags("user-notification")
  @ApiSecurity('oauth2', [NotificationsScope.read])
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: User
  ): Promise<any>{
    return this.notificationService.create(user);
  } /// REMOVE ME BEFORE MERGING

 
  @Get()
  @Scopes(NotificationsScope.read)
  @ApiTags("user-notification")
  @ApiSecurity('oauth2', [NotificationsScope.read])
  findMany(
    @CurrentUser() user: User,
    @Query() query: PaginationDto,
  ): Promise<PaginatedNotificationDto> {
    return this.notificationService.findMany(user,query)
  }


  @Get(':id')
  @Scopes(NotificationsScope.read)
  @ApiTags("user-notification")
  @ApiSecurity('oauth2', [NotificationsScope.read])
  findOne(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Query('locale') locale: string
  ): Promise<RenderedNotificationDto> {
    return this.notificationService.findOne(user,id,locale);
  }

  @Patch(':id')
  @Scopes(NotificationsScope.write)
  @ApiTags("user-notification")
  @ApiSecurity('oauth2', [NotificationsScope.write])
  update(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() updateNotificationDto: UpdateNotificationDto
  ): Promise<RenderedNotificationDto> {
    return this.notificationService.update(user,id, updateNotificationDto);
  }

}
