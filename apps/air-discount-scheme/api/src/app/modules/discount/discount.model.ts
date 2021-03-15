import { Field, ObjectType, ID } from '@nestjs/graphql'

import { User } from '../user'
import { ConnectionDiscountCode } from './connectionDiscountCode.model'
import { ConnectionDiscountCodes } from '@island.is/air-discount-scheme/types'

@ObjectType()
export class Discount {
  @Field((_1) => ID)
  nationalId: string

  @Field()
  discountCode: string

  @Field((type) => [ConnectionDiscountCode])
  connectionDiscountCodes: ConnectionDiscountCodes
  @Field()
  expiresIn: number

  @Field((_1) => User)
  user: User
}
