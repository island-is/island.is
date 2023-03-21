import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { NotificationType } from '@island.is/judicial-system/types'

export class SendInternalNotificationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly userId!: string

  @IsNotEmpty()
  @IsEnum(NotificationType)
  @ApiProperty({ enum: NotificationType })
  readonly type!: NotificationType
}
