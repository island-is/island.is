import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CaseNotificationType } from '@island.is/judicial-system/types'

export class NotificationDto {
  @IsNotEmpty()
  @IsEnum(CaseNotificationType)
  @ApiProperty({ enum: CaseNotificationType })
  readonly type!: CaseNotificationType

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly eventOnly?: boolean
}
