import { Allow, IsArray, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import {
  IndictmentCaseReviewDecision,
  SubpoenaType,
} from '@island.is/judicial-system/types'

@InputType()
class UpdateDefendantsItem {
  @Allow()
  @Field(() => ID)
  readonly defendantId!: string

  @Allow()
  @IsOptional()
  @Field(() => SubpoenaType, { nullable: true })
  readonly subpoenaType?: SubpoenaType

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isAlternativeService?: boolean

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly alternativeServiceDescription?: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isDrivingLicenseSuspended?: boolean

  @Allow()
  @IsOptional()
  @Field(() => IndictmentCaseReviewDecision, { nullable: true })
  readonly indictmentReviewDecision?: IndictmentCaseReviewDecision
}

@InputType()
export class UpdateDefendantsInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @IsArray()
  @Field(() => [UpdateDefendantsItem])
  readonly defendants!: UpdateDefendantsItem[]
}
