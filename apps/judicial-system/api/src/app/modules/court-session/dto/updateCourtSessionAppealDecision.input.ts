import { Allow, IsEnum, IsOptional, IsString } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import {
  AppealDecisionPartyRole,
  CaseAppealDecision,
} from '@island.is/judicial-system/types'

@InputType()
export class UpdateCourtSessionAppealDecisionInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly courtSessionId!: string

  @Allow()
  @IsEnum(AppealDecisionPartyRole)
  @Field(() => AppealDecisionPartyRole)
  readonly partyRole!: AppealDecisionPartyRole

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly defendantId?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly civilClaimantId?: string

  @Allow()
  @IsOptional()
  @IsEnum(CaseAppealDecision)
  @Field(() => CaseAppealDecision, { nullable: true })
  readonly decision?: CaseAppealDecision

  @Allow()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly announcement?: string
}
