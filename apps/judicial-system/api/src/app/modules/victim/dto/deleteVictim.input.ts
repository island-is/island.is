import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteVictimInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly victimId!: string
}
