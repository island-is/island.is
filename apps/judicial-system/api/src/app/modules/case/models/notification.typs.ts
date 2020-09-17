import { ApiProperty } from '@nestjs/swagger'

export enum NotificationType {
  HEADS_UP = 'HEADS_UP',
  READY_FOR_COURT = 'READY_FOR_COURT',
}

export class Notification {
  @ApiProperty()
  caseId: string

  @ApiProperty()
  type: NotificationType
}
