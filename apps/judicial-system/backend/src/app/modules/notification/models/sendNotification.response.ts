import { ApiProperty } from '@nestjs/swagger'

export class SendNotificationResponse {
  @ApiProperty({ type: Boolean })
  notificationSent!: boolean
}
