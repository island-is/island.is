import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteAppealCourtSessionInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly appealCaseId!: string

  @Allow()
  @Field(() => ID)
  readonly appealCourtSessionId!: string
}
