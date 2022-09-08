import { Field, ObjectType } from '@nestjs/graphql'

import { Amount } from '@island.is/financial-aid/shared/lib'
import { DeductionFactorsModel } from '../../deductionFactors'

@ObjectType()
export class AmountModel implements Amount {
  @Field()
  readonly applicationId!: string

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
