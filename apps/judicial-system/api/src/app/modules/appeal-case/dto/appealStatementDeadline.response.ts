import { Field, ID, ObjectType } from '@nestjs/graphql'

// The deadline the court of appeals has given one party of a verdict appeal
// to file its statement. A row names a defendant, a civil claimant, or
// neither for the prosecution.
@ObjectType()
export class AppealStatementDeadline {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => ID, { nullable: true })
  readonly defendantId?: string

  @Field(() => ID, { nullable: true })
  readonly civilClaimantId?: string

  @Field(() => String, { nullable: true })
  readonly deadline?: string
}
