import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional } from 'class-validator'

import { NotificationType } from '@island.is/judicial-system/types'

export class SendNotificationDto {
  @IsEnum(NotificationType)
  @ApiProperty({ enum: NotificationType })
  readonly type!: NotificationType

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly eventOnly?: boolean
}
