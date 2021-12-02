import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateDeductionFactorsInput {
  @Allow()
  @Field({ nullable: true })
  readonly amount?: number

  @Allow()
  @Field({ nullable: true })
  readonly description?: string
}
