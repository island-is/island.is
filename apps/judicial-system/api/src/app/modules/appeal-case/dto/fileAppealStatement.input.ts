import { Allow, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

// The party a statement request is about: a defendant, a civil claimant, or
// the prosecution when neither is named. Filing touches no deadline: a
// deadline the court gave earlier stays as it is and locks.
@InputType()
export class FileAppealStatementInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly appealCaseId!: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly defendantId?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly civilClaimantId?: string
}
