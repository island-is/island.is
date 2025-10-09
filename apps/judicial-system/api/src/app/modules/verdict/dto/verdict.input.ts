import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class VerdictQueryInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly defendantId!: string
}
