import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { NotificationType } from '@island.is/judicial-system/types'

export class SendInternalNotificationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly userId!: string

  @IsEnum(NotificationType)
  @ApiProperty({ enum: NotificationType })
  readonly type!: NotificationType

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly eventOnly?: boolean
}
