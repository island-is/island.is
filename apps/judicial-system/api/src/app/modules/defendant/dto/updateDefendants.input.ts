import { Allow, IsArray } from 'class-validator'

import { Field, ID, InputType, PickType } from '@nestjs/graphql'

import { UpdateDefendantInput } from './updateDefendant.input'

@InputType()
class UpdateDefendantsItem extends PickType(UpdateDefendantInput, [
  'defendantId',
  'subpoenaType',
  'isAlternativeService',
  'alternativeServiceDescription',
  'isDrivingLicenseSuspended',
  'indictmentReviewDecision',
] as const) {}

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
