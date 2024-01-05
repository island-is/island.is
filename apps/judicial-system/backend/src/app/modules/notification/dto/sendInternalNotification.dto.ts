import { IsEnum, IsNotEmpty, IsObject } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import type { User } from '@island.is/judicial-system/types'
import { NotificationType } from '@island.is/judicial-system/types'

export class SendInternalNotificationDto {
  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ type: Object })
  readonly user!: User

  @IsNotEmpty()
  @IsEnum(NotificationType)
  @ApiProperty({ enum: NotificationType })
  readonly type!: NotificationType
}
