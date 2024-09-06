import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class CaseQueryInput {
  @Allow()
  @Field(() => ID)
  readonly id!: string
}
