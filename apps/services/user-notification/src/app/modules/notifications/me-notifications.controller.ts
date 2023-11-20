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
  HttpStatus,
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
import { NotificationDTO } from './dto/notification.dto'; // Import your DTO
import { PageInfoDto, PaginationDto } from '@island.is/nest/pagination'

export enum NotificationState {
  Read = 'read',
  Unread = 'unread'
}

export class PaginatedNotificationDto {
  totalCount!: number
  data!: Notification[]
  pageInfo!: PageInfoDto
}

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
  @Post()
  @Scopes(NotificationsScope.read)
  @ApiTags("user-notification")
  @ApiSecurity('oauth2', [NotificationsScope.read])
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: User, @Body() notificationData: NotificationDTO) {
    console.log("#####################")
    console.log(user)
    return this.notificationService.create(user,notificationData);
  }

  @Get()
  @Scopes(NotificationsScope.read)
  @ApiTags("user-notification")
  @ApiSecurity('oauth2', [NotificationsScope.read])
  findMany(@CurrentUser() user: User, @Query() query: PaginationDto, @Query('limit') limit: number): Promise<PaginatedNotificationDto> {
    return this.notificationService.findMany(user,query)
  }
  // async findMany(
  //   @Query() query: PaginationDto,
  // ): Promise<PaginatedExampleModelDto> {
  //   return await this.moduleService.findMany(query)
  // }

  @Get(':id')
  @Scopes(NotificationsScope.read)
  @ApiTags("user-notification")
  @ApiSecurity('oauth2', [NotificationsScope.read])
  findOne(@CurrentUser() user: User, @Param('id') id: number) {
    return this.notificationService.findOne(user,id);
  }

  // @Patch(':id')
  // @Scopes(NotificationsScope.write)
  // @ApiTags("user-notification")
  // @ApiSecurity('oauth2', [NotificationsScope.write])
  // update(@CurrentUser() user: User, @Param('id') id: number, @Body() updateNotificationDto: UpdateNotificationDto) {
  //   return this.notificationService.update(user,id, updateNotificationDto);
  // }

  // @Put(':id/state')
  // async updateState(
  //   @CurrentUser() user: User,
  //   @Param('id') id: number,
  //   @Body('state') newState: NotificationState
  // ): Promise<any> {
  //   try {
  //     return await this.notificationService.update(user.nationalId, id, newState);
  //   } catch (error) {
  //     throw new NotFoundException(error.message);
  //   }
  // }

  // @Delete(':id')
  // @Scopes(NotificationsScope.write)
  // @ApiTags("user-notification")
  // @ApiSecurity('oauth2', [NotificationsScope.write])
  // remove(@Param('id') id: string) {
  //   return this.notificationService.remove(id);
  // }

}
