import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  AppealDecisionPartyRole,
  CaseAppealDecision,
} from '@island.is/judicial-system/types'

// A case-level appeal decision (request cases). Collective, so - unlike the
// ruling-order court-session decision - it carries no defendant / civil claimant
// party: the prosecutor decision and the (single) accused decision.
export class CaseAppealDecisionDto {
  @IsNotEmpty()
  @IsEnum(AppealDecisionPartyRole)
  @ApiProperty({ enum: AppealDecisionPartyRole })
  readonly partyRole!: AppealDecisionPartyRole

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
