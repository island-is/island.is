import { Field, ObjectType, ID } from '@nestjs/graphql'

import { User } from '../user'

@ObjectType()
export class Flight {
  @Field((_1) => ID)
  id: string

  @Field()
  airline: string

  @Field()
  bookingDate: string

  @Field()
  travel: string

  @Field((_1) => User)
  user: User
}
