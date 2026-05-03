import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { RequestCaseNotificationType } from '@island.is/judicial-system/types'

export class NotificationDto {
  @IsNotEmpty()
  @IsEnum(RequestCaseNotificationType)
  @ApiProperty({ enum: RequestCaseNotificationType })
  readonly type!: RequestCaseNotificationType

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly eventOnly?: boolean
}
