import { Field, ObjectType, ID } from '@nestjs/graphql'

import { User } from '../user'

@ObjectType()
export class Discount {
  @Field((_1) => ID)
  discountCode: string

  @Field()
  expires: string

  @Field()
  nationalId: string

  @Field((_1) => User)
  user: User
}
