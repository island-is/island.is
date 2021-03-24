import { Field, ObjectType, ID } from '@nestjs/graphql'

import { User } from '../user'
import { ConnectionDiscountCode as GQLConnectionDiscountCode } from './connectionDiscountCode.model'
import { ConnectionDiscountCode } from '@island.is/air-discount-scheme/types'

@ObjectType()
export class Discount {
  @Field((_1) => ID)
  nationalId: string

  @Field()
  discountCode: string

  @Field((type) => [GQLConnectionDiscountCode])
  connectionDiscountCodes: ConnectionDiscountCode[]

  @Field()
  expiresIn: number

  @Field((_1) => User)
  user: User
}
