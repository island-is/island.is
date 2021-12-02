import { Module } from '@nestjs/common';
import { UserNotificationsService } from './user-notifications.service';
import { UserNotificationsController } from './user-notifications.controller';

@Module({
  controllers: [UserNotificationsController],
  providers: [UserNotificationsService]
})
export class UserNotificationsModule {}
