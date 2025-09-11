import { IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type { User } from '@island.is/judicial-system/types'
import { DefendantNotificationType } from '@island.is/judicial-system/types'

export class DefendantNotificationDto {
  @IsNotEmpty()
  @IsEnum(DefendantNotificationType)
  @ApiProperty({ enum: DefendantNotificationType })
  readonly type!: DefendantNotificationType

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly user?: User
}
