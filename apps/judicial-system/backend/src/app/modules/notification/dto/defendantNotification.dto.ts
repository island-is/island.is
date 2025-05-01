import { IsEnum, IsNotEmpty, IsObject } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import type { User } from '@island.is/judicial-system/types'
import { DefendantNotificationType } from '@island.is/judicial-system/types'

export class DefendantNotificationDto {
  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ type: Object })
  readonly user?: User

  @IsNotEmpty()
  @IsEnum(DefendantNotificationType)
  @ApiProperty({ enum: DefendantNotificationType })
  readonly type!: DefendantNotificationType
}
