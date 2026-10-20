import { Allow, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class FileAppealStatementInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly appealCaseId!: string

  // Whose statement is being filed: a defendant's, a civil claimant's, or the
  // prosecution's when neither is named.
  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly defendantId?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly civilClaimantId?: string
}
