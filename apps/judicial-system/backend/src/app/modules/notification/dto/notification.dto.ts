import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { NotificationType } from '@island.is/judicial-system/types'

export class NotificationDto {
  @IsNotEmpty()
  @IsEnum(NotificationType)
  @ApiProperty({ enum: NotificationType })
  readonly type!: NotificationType

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly eventOnly?: boolean
}
