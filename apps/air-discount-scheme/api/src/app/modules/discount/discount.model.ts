import { Field, ObjectType, ID } from '@nestjs/graphql'

import { User } from '../user'

@ObjectType()
export class Discount {
  @Field((_1) => ID)
  nationalId: string

  @Field()
  discountCode: string

  @Field()
  expiresIn: number

  @Field((_1) => User)
  user: User
}
