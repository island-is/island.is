import { IsEnum } from 'class-validator';
import { NotificationStatus } from '../notification.status.enum'

export class UpdateNotificationDto {
  @IsEnum(NotificationStatus)
  status!: NotificationStatus;
}
