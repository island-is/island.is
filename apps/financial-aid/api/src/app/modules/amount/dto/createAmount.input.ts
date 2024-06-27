import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'
import { CreateDeductionFactorsInput } from './createDeductionFactors.input'
import { Amount } from '@island.is/financial-aid/shared/lib'

@InputType()
export class CreateAmountInput implements Amount {
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
  @Field({ nullable: true })
  readonly childrenAidAmount?: number

  @Allow()
  @Field({ nullable: true })
  readonly decemberAidAmount?: number

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
