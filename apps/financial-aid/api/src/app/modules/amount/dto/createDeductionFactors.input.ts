import { Field, InputType } from '@nestjs/graphql'
import { Allow } from 'class-validator'

@InputType()
export class CreateDeductionFactorsInput {
  @Allow()
  @Field()
  readonly amount?: number

  @Allow()
  @Field()
  readonly description?: string
}
