import {
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { CaseIndictmentRulingDecision } from '@island.is/judicial-system/types'

import { DeliverDto } from './deliver.dto'

export class DeliverIndictmentConclusionDto extends DeliverDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly defendantId?: string

  @IsOptional()
  @IsEnum(CaseIndictmentRulingDecision)
  @ApiPropertyOptional({ enum: CaseIndictmentRulingDecision })
  readonly indictmentRulingDecision?: CaseIndictmentRulingDecision

  @IsOptional()
  @IsISO8601()
  @ApiPropertyOptional()
  readonly rulingDate?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly splitCaseNumber?: string
}
