import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import {
  CourtSessionClosedLegalBasis,
  CourtSessionRulingType,
} from '@island.is/judicial-system/types'

export class UpdateCourtSessionDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly location?: string

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly startDate?: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly endDate?: Date

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isClosed?: boolean

  @IsOptional()
  @IsArray()
  @IsEnum(CourtSessionClosedLegalBasis, { each: true })
  @ApiPropertyOptional({ enum: CourtSessionClosedLegalBasis, isArray: true })
  readonly closedLegalProvisions?: CourtSessionClosedLegalBasis[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly attendees?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly entries?: string

  @IsOptional()
  @IsEnum(CourtSessionRulingType)
  @ApiPropertyOptional({ enum: CourtSessionRulingType })
  readonly rulingType?: CourtSessionRulingType

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly ruling?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isAttestingWitness?: boolean

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly attestingWitnessId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly closingEntries?: string
}
