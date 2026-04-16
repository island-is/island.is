import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsInt, IsString } from 'class-validator'

import { NotificationChannel } from '../notification-delivery.model'

export class NotificationDeliveryDto {
  @ApiProperty({ example: 123 })
  @IsInt()
  id!: number

  @ApiProperty({ enum: NotificationChannel, example: NotificationChannel.Email })
  @IsEnum(NotificationChannel)
  channel!: NotificationChannel

  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  sentTo!: string

  @ApiProperty({ example: new Date().toISOString() })
  @IsDate()
  created!: Date
}
