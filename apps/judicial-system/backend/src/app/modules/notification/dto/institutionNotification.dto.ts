import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { NotificationType } from '@island.is/judicial-system/types'

export class NotificationBodyDto {
  @IsNotEmpty()
  @IsEnum(NotificationType)
  @ApiProperty({ enum: NotificationType })
  readonly type!: NotificationType

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly prosecutorsOfficeId?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly subpoenaId?: string
}
