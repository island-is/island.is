import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UserNotificationsService } from './user-notifications.service';
import { CreateUserNotificationDto } from './dto/create-user-notification.dto';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto';
import { BypassAuth, CurrentUser, User } from '@island.is/auth-nest-tools';

// @BypassAuth()
@Controller('userNotifications')
export class UserNotificationsController {
  constructor(private readonly userNotificationsService: UserNotificationsService) {}

  @Post('/addDeviceToken/:nationalId')
  create(
    // @CurrentUser() user: User,
    @Body() createUserNotificationDto: CreateUserNotificationDto) {
    return this.userNotificationsService.create(createUserNotificationDto);
  }

  @Get('/getDeviceTokens/:nationalId')
  findAll() {
    return this.userNotificationsService.findAll();
  }

  // @Get('/getDeviceToken/:userId/:token')
  // findOne(@Param('id') id: string) {
  //   return this.userNotificationsService.findOne(+id);
  // }

  @Put('/update')
  update(@Body() UpdateUserNotificationDto: UpdateUserNotificationDto) {
    return this.userNotificationsService.update(UpdateUserNotificationDto);
  }

  // @Patch('/disableDeviceNotifications/:Userid')
  // disable(@Param('id') id: string, @Body() updateUserNotificationDto: UpdateUserNotificationDto) {
  //   return this.userNotificationsService.update(+id, updateUserNotificationDto);
  // }

  // @Patch('/enableDeviceNotifications/:Userid')
  // enable(@Param('id') id: string, @Body() updateUserNotificationDto: UpdateUserNotificationDto) {
  //   return this.userNotificationsService.update(+id, updateUserNotificationDto);
  // }

  @Delete('deleteDeviceToken/:userId')
  remove(@Param('id') id: string) {
    return this.userNotificationsService.remove(id);
  }
}
