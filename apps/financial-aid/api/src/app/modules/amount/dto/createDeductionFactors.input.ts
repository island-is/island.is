import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateDeductionFactorsInput {
  @Allow()
  @Field()
  readonly amount?: number

  @Allow()
  @Field()
  readonly description?: string
}
