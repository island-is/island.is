import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import {
  CaseIndictmentRulingDecision,
  CaseTransition,
  IndictmentDecision,
} from '@island.is/judicial-system/types'

export class TransitionCaseDto {
  @IsNotEmpty()
  @IsEnum(CaseTransition)
  @ApiProperty({ enum: CaseTransition })
  readonly transition!: CaseTransition

  @IsOptional()
  @IsEnum(IndictmentDecision)
  @ApiProperty({ enum: IndictmentDecision, required: false })
  readonly indictmentDecision?: IndictmentDecision

  @IsOptional()
  @IsEnum(CaseIndictmentRulingDecision)
  @ApiProperty({ enum: CaseIndictmentRulingDecision, required: false })
  readonly indictmentRulingDecision?: CaseIndictmentRulingDecision
}
