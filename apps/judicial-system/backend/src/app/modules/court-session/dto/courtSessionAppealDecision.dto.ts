import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  AppealDecisionPartyRole,
  CaseAppealDecision,
} from '@island.is/judicial-system/types'

export class CourtSessionAppealDecisionDto {
  @IsNotEmpty()
  @IsEnum(AppealDecisionPartyRole)
  @ApiProperty({ enum: AppealDecisionPartyRole })
  readonly partyRole!: AppealDecisionPartyRole

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly defendantId?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly civilClaimantId?: string

  // Optional so an announcement can be entered before a decision is picked.
  @IsOptional()
  @IsEnum(CaseAppealDecision)
  @ApiPropertyOptional({ enum: CaseAppealDecision })
  readonly decision?: CaseAppealDecision

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly announcement?: string
}
