import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'
import { CreateDeductionFactorsInput } from './createDeductionFactors.input'

@InputType()
export class CreateAmountInput {
  @Allow()
  @Field()
  readonly applicationId!: string

  @Allow()
  @Field()
  readonly aidAmount!: number

  @Allow()
  @Field({ nullable: true })
  readonly income?: number

  @Allow()
  @Field(() => [CreateDeductionFactorsInput], { nullable: true })
  readonly deductionFactors?: CreateDeductionFactorsInput[]

  @Allow()
  @Field()
  readonly personalTaxCredit!: number

  @Allow()
  @Field({ nullable: true })
  readonly spousePersonalTaxCredit?: number

  @Allow()
  @Field()
  readonly tax!: number

  @Allow()
  @Field()
  readonly finalAmount!: number
}
