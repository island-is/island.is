import { Transform, Type } from 'class-transformer'
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import {
  VerdictAppealDecision,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { nationalIdTransformer } from '../../../transformers'

export class PoliceUpdateVerdictDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date, nullable: true })
  readonly serviceDate?: Date | null

  @IsOptional()
  @IsEnum(VerdictServiceStatus)
  @ApiPropertyOptional({ enum: VerdictServiceStatus })
  readonly serviceStatus?: VerdictServiceStatus

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly comment?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly servedBy?: string

  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Transform(nationalIdTransformer)
  @ApiPropertyOptional({ type: String })
  readonly deliveredToDefenderNationalId?: string

  @IsOptional()
  @IsEnum(VerdictAppealDecision)
  @ApiPropertyOptional({ enum: VerdictAppealDecision })
  readonly appealDecision?: VerdictAppealDecision
}
