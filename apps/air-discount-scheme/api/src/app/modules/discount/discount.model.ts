import { Field, ObjectType, ID } from '@nestjs/graphql'
import { FieldsOnCorrectTypeRule } from 'graphql'

import { User } from '../user'
import { ConnectionDiscountCode } from './connectionDiscountCode.model'

@ObjectType()
export class Discount {
  @Field((_1) => ID)
  nationalId: string

  @Field()
  discountCode: string

  @Field((type) => [ConnectionDiscountCode])
  connectionDiscountCodes: {code: string, flightId:string}[]

  @Field()
  expiresIn: number

  @Field((_1) => User)
  user: User
}
