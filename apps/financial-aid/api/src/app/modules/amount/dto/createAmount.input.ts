import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateAmountInput {
  @Allow()
  @Field()
  readonly aidAmount!: number

  @Allow()
  @Field({ nullable: true })
  readonly income?: number

  @Allow()
  @Field({ nullable: true })
  readonly deductionFactors?: string

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
