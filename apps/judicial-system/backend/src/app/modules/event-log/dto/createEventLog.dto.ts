import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { EventType, UserRole } from '@island.is/judicial-system/types'

export class CreateEventLogDto {
  @IsNotEmpty()
  @IsEnum(EventType)
  @ApiProperty({ enum: EventType })
  readonly eventType!: EventType

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly caseId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly nationalId?: string

  @IsOptional()
  @IsEnum(UserRole)
  @ApiPropertyOptional({ enum: UserRole })
  readonly userRole?: UserRole

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  readonly userName?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  readonly userTitle?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  readonly institutionName?: string
}
