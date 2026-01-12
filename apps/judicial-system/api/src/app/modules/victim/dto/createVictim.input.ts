import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class CreateVictimInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string
}
