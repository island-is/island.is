import { Injectable } from '@nestjs/common';
import { CreateUserNotificationDto } from './dto/create-user-notification.dto';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto';

@Injectable()
export class UserNotificationsService {
  create(createUserNotificationDto: CreateUserNotificationDto) {
    return 'This action adds a new userNotification';
  }

  findAll() {
    return `This action returns all userNotifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userNotification`;
  }

  update(id: number, updateUserNotificationDto: UpdateUserNotificationDto) {
    return `This action updates a #${id} userNotification`;
  }

  remove(id: number) {
    return `This action removes a #${id} userNotification`;
  }
}
