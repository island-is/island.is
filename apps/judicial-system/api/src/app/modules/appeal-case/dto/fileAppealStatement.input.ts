import { Allow, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

// The party a statement request is about: a defendant, a civil claimant, or
// the prosecution when neither is named. On its own it files the party's
// statement; with a date it sets the party's deadline.
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
