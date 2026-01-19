import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import {
  InformationForDefendant,
  ServiceRequirement,
  VerdictAppealDecision,
} from '@island.is/judicial-system/types'

export class UpdateVerdictDto {
  @IsOptional()
  @IsEnum(ServiceRequirement)
  @ApiPropertyOptional({ enum: ServiceRequirement })
  serviceRequirement?: ServiceRequirement

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date, nullable: true })
  serviceDate?: Date | null

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

  @IsOptional()
  @IsArray()
  @IsEnum(InformationForDefendant, { each: true })
  @ApiPropertyOptional({ enum: InformationForDefendant, isArray: true })
  serviceInformationForDefendant?: InformationForDefendant[]

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  isDefaultJudgement?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  isDrivingLicenseSuspended?: boolean
}
