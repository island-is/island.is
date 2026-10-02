import { ApiProperty } from '@nestjs/swagger'

import { NotificationSenderSettingDto } from './notification-sender-setting.dto'

export class NotificationSettingsDto {
  @ApiProperty({ type: [NotificationSenderSettingDto] })
  senders!: NotificationSenderSettingDto[]
}
