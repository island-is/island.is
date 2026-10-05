import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionDiscountCode } from '@island.is/air-discount-scheme/types'

import { ConnectionDiscountCode as GQLConnectionDiscountCode } from './connectionDiscountCode.model'
import { Fund } from './fund.model'

@ObjectType('AirDiscountSchemeBenefit')
export class Benefit {
  @Field(() => Fund)
  fund!: Fund

  @Field(() => String, { nullable: true })
  discountCode!: string | null

  @Field(() => [GQLConnectionDiscountCode])
  connectionDiscountCodes!: ConnectionDiscountCode[]
}
