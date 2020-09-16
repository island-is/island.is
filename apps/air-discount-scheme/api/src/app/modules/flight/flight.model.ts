import { Field, ObjectType, ID } from '@nestjs/graphql'

import { UserInfo as TUserInfo } from '@island.is/air-discount-scheme/types'
import { User } from '../user'
import { FlightLeg } from '../flightLeg'

@ObjectType()
export class UserInfo implements TUserInfo {
  @Field()
  gender: 'kk' | 'kvk'

  @Field()
  age: number

  @Field()
  postalCode: number
}

@ObjectType()
export class Flight {
  @Field((_1) => ID)
  id: string

  @Field()
  bookingDate: string

  @Field((_1) => [FlightLeg])
  flightLegs: FlightLeg[]

  @Field((_1) => User)
  user: User

  @Field((_1) => UserInfo)
  userInfo: UserInfo
}
