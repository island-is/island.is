import { Field, ObjectType, ID } from '@nestjs/graphql'
import { FieldsOnCorrectTypeRule } from 'graphql'

import { User } from '../user'

@ObjectType()
export class Discount {
  @Field((_1) => ID)
  nationalId: string

  @Field()
  discountCode: string

  @Field((type) => [String])
  connectionDiscountCode: string[]

  @Field()
  expiresIn: number

  @Field((_1) => User)
  user: User
}
