import { ApiProperty } from '@nestjs/swagger'

export class SendNotificationResponse {
  @ApiProperty()
  notificationSent!: boolean
}
