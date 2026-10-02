import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class NotificationSenderSettingDto {
  @ApiProperty()
  senderId!: string

  @ApiProperty()
  enabled!: boolean

  @ApiProperty()
  seen!: boolean
}

export class UpdateNotificationSenderSettingDto {
  @IsBoolean()
  @ApiProperty()
  enabled!: boolean
}

export class CreateNotificationSenderSettingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  senderId!: string
}
