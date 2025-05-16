import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type { User } from '@island.is/judicial-system/types'
import { EventType } from '@island.is/judicial-system/types'

export class CreateEventLogDto {
  @IsNotEmpty()
  @IsEnum(EventType)
  @ApiProperty({ enum: EventType })
  readonly eventType!: EventType

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ type: Object })
  readonly user!: User

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly caseId?: string
}
