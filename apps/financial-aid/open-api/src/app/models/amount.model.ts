import { Field, ObjectType } from '@nestjs/graphql'

import { DeductionFactorsModel } from './deductionFactors.model'

@ObjectType()
export class AmountModel {
  @Field()
  readonly aidAmount!: number

  @Field({ nullable: true })
  readonly income?: number

  @Field()
  readonly personalTaxCredit!: number

  @Field({ nullable: true })
  readonly spousePersonalTaxCredit?: number

  @Field()
  readonly tax!: number

  @Field()
  readonly finalAmount!: number

  @Field(() => [DeductionFactorsModel], { nullable: true })
  readonly deductionFactors?: DeductionFactorsModel[]
}
