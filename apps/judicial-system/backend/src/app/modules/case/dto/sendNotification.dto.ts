import { IsEnum, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { NotificationType } from '@island.is/judicial-system/types'

export class SendNotificationDto {
  @IsString()
  @ApiProperty()
  readonly nationalId: string

  @IsEnum(NotificationType)
  @ApiProperty({ enum: NotificationType })
  readonly type: NotificationType
}
