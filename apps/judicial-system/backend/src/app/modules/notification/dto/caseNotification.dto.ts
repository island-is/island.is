import { IsEnum, IsNotEmpty, IsObject } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import type { User } from '@island.is/judicial-system/types'
import { CaseNotificationType } from '@island.is/judicial-system/types'

export class CaseNotificationDto {
  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ type: Object })
  readonly user!: User

  @IsNotEmpty()
  @IsEnum(CaseNotificationType)
  @ApiProperty({ enum: CaseNotificationType })
  readonly type!: CaseNotificationType
}
