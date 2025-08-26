import { Type } from 'class-transformer'
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import {
  ServiceStatus,
  VerdictAppealDecision,
} from '@island.is/judicial-system/types'

export class PoliceUpdateVerdictDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date, nullable: true })
  serviceDate?: Date | null

  @IsOptional()
  @IsEnum(ServiceStatus)
  @ApiPropertyOptional({ enum: ServiceStatus })
  serviceStatus?: ServiceStatus

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  comment?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  servedBy?: string

  @IsOptional()
  @IsEnum(VerdictAppealDecision)
  @ApiPropertyOptional({ enum: VerdictAppealDecision })
  appealDecision?: VerdictAppealDecision

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  appealDate?: Date
}
