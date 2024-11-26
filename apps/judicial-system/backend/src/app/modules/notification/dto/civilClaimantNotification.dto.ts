import { IsEnum, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { CivilClaimantNotificationType } from '@island.is/judicial-system/types'

export class CivilClaimantNotificationDto {
  @IsNotEmpty()
  @IsEnum(CivilClaimantNotificationType)
  @ApiProperty({ enum: CivilClaimantNotificationType })
  readonly type!: CivilClaimantNotificationType
}
