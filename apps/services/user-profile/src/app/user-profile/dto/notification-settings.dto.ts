import { ApiProperty } from '@nestjs/swagger'

import { BlockedSenderDto } from './blocked-sender.dto'

export class NotificationSettingsDto {
  @ApiProperty({ type: [BlockedSenderDto] })
  blockedSenders!: BlockedSenderDto[]
}
