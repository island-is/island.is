import { Transform } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import {
  DefendantPlea,
  DefenderChoice,
  Gender,
  IndictmentCaseReviewDecision,
  PunishmentType,
  SubpoenaType,
} from '@island.is/judicial-system/types'

import { nationalIdTransformer } from '../../../transformers'

export class UpdateDefendantDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly noNationalId?: boolean

  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Transform(nationalIdTransformer)
  @ApiPropertyOptional({ type: String })
  readonly nationalId?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly name?: string

  @IsOptional()
  @IsEnum(Gender)
  @ApiPropertyOptional({ enum: Gender })
  readonly gender?: Gender

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly address?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly citizenship?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly defenderName?: string

  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Transform(nationalIdTransformer)
  @ApiPropertyOptional({ type: String })
  readonly defenderNationalId?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly defenderEmail?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly defenderPhoneNumber?: string

  @IsOptional()
  @IsEnum(DefenderChoice)
  @ApiPropertyOptional({ enum: DefenderChoice })
  readonly defenderChoice?: DefenderChoice

  @IsOptional()
  @IsEnum(DefendantPlea)
  @ApiPropertyOptional({ enum: DefendantPlea })
  readonly defendantPlea?: DefendantPlea

  @IsOptional()
  @IsEnum(SubpoenaType)
  @ApiPropertyOptional({ enum: SubpoenaType })
  readonly subpoenaType?: SubpoenaType

  @IsOptional()
  @IsEnum(DefenderChoice)
  @ApiPropertyOptional({ enum: DefenderChoice })
  readonly requestedDefenderChoice?: DefenderChoice

  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Transform(nationalIdTransformer)
  @ApiPropertyOptional({ type: String })
  readonly requestedDefenderNationalId?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly requestedDefenderName?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isDefenderChoiceConfirmed?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly caseFilesSharedWithDefender?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isSentToPrisonAdmin?: boolean

  @IsOptional()
  @IsEnum(PunishmentType)
  @ApiPropertyOptional({ enum: PunishmentType })
  readonly punishmentType?: PunishmentType

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isAlternativeService?: boolean

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly alternativeServiceDescription?: string

  @IsOptional()
  @IsEnum(IndictmentCaseReviewDecision)
  @ApiPropertyOptional({ enum: IndictmentCaseReviewDecision })
  readonly indictmentReviewDecision?: IndictmentCaseReviewDecision
}
