import { NotificationDto } from '../../applications/models/dto/notification.dto'

export class BodyRequestDto {
  notification!: NotificationDto
  audkenni?: string
}
