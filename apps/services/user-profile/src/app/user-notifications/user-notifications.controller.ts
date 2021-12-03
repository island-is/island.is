import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { UserNotificationsService } from './user-notifications.service';
import { CreateUserNotificationDto } from './dto/create-user-notification.dto';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto';
import { BypassAuth, CurrentUser, IdsUserGuard, Scopes, User } from '@island.is/auth-nest-tools';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserProfileScope } from '@island.is/auth/scopes';

// @BypassAuth()
@ApiTags('User Notifications')
@UseGuards(IdsUserGuard)
@Controller('v1/userNotifications')
export class UserNotificationsController {
  constructor(private readonly userNotificationsService: UserNotificationsService) {}

  @Scopes(UserProfileScope.read)
  @ApiSecurity('oauth2', [UserProfileScope.read])
  @Post('/addDeviceToken')
  async create(
    @CurrentUser() user: User,
    @Body() createUserNotificationDto: CreateUserNotificationDto) {
    console.log(user)
    return await this.userNotificationsService.create(createUserNotificationDto);
  }

  @Scopes(UserProfileScope.read)
  @ApiSecurity('oauth2', [UserProfileScope.read])
  @Get('/getDeviceTokens')
  async findAll(
    @CurrentUser() user: User,
  ) {
    console.log(user)
    return await this.userNotificationsService.findAll();
  }

  @Scopes(UserProfileScope.read)
  @ApiSecurity('oauth2', [UserProfileScope.read])
  @Put('/update/:id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateUserNotificationDto: UpdateUserNotificationDto
    ) {
      console.log(user)
    return await this.userNotificationsService.update(id,updateUserNotificationDto);
  }

  @Scopes(UserProfileScope.read)
  @ApiSecurity('oauth2', [UserProfileScope.read])
  @Delete('deleteDeviceToken/:id')
  async remove(
    @CurrentUser() user: User,
    @Param('id') id: string
    ) {
    console.log(user)
    return await this.userNotificationsService.remove(id);
  }
}
