import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionDiscountCode } from '@island.is/air-discount-scheme/types'

import { ConnectionDiscountCode as GQLConnectionDiscountCode } from './connectionDiscountCode.model'
import { Fund } from './fund.model'

@ObjectType('AirDiscountSchemeBenefit')
export class Benefit {
  @Field(() => Fund)
  fund!: Fund

  @Field(() => String, {
    nullable: true,
    description: 'Null when the fund is used up or the code is about to expire',
  })
  discountCode!: string | null

  @Field(() => [GQLConnectionDiscountCode])
  connectionDiscountCodes!: ConnectionDiscountCode[]
}
