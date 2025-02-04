import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteOffenseInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly offenseId!: string

  @Allow()
  @Field(() => ID)
  readonly indictmentCountId!: string
}
