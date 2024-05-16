import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { EventType } from '@island.is/judicial-system/types'

export class CreateEventLogDto {
  @IsNotEmpty()
  @IsEnum(EventType)
  @ApiProperty()
  readonly eventType!: EventType

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly caseId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly nationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly userRole?: string
}
