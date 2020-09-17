import { ApiProperty } from '@nestjs/swagger'
import { NotificationType } from './notification.types'

export class Notification {
  @ApiProperty()
  caseId: string

  @ApiProperty()
  type: NotificationType
}
