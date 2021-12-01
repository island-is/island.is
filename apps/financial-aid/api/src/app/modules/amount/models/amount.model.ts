import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Amount } from '@island.is/financial-aid/shared/lib'

@ObjectType()
export class AmountModel implements Amount {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly aidAmount!: number

  @Field()
  readonly income?: number

  @Field()
  readonly deductionFactors_id?: string

  @Field()
  readonly personalTaxCredit!: number

  @Field()
  readonly spousePersonalTaxCredit?: number

  @Field()
  readonly tax!: number

  @Field()
  readonly finalAmount!: number
}
