import { Allow, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class SetAppealStatementDeadlineInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly appealCaseId!: string

  // Which party gets the deadline: a defendant, a civil claimant, or the
  // prosecution when neither is named.
  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly defendantId?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly civilClaimantId?: string

  @Allow()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  readonly deadline!: string
}
