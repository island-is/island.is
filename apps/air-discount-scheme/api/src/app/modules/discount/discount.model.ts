import { Field, ObjectType, ID } from '@nestjs/graphql'

import { User } from '../user'
import { ConnectionDiscountCode as GQLConnectionDiscountCode } from './connectionDiscountCode.model'
import { ConnectionDiscountCode } from '@island.is/air-discount-scheme/types'

@ObjectType()
export class Discount {
  @Field(() => ID)
  nationalId: string

  @Field()
  discountCode: string

  @Field(() => [GQLConnectionDiscountCode])
  connectionDiscountCodes: ConnectionDiscountCode[]

  @Field()
  expiresIn: number

  @Field(() => User)
  user: User
}
