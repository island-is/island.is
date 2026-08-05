import { IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  CivilClaimantNotificationType,
  type User,
} from '@island.is/judicial-system/types'

export class CivilClaimantNotificationDto {
  @IsNotEmpty()
  @IsEnum(CivilClaimantNotificationType)
  @ApiProperty({ enum: CivilClaimantNotificationType })
  readonly type!: CivilClaimantNotificationType

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly user?: User
}
