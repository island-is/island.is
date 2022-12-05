import { Field, ObjectType, ID } from '@nestjs/graphql'

import {
  UserInfo as TUserInfo,
  Gender,
} from '@island.is/air-discount-scheme/types'
import { User } from '../user'
import { FlightLeg } from '../flightLeg'
type ModelGender = Exclude<Gender, Gender.Uncategorized>

@ObjectType()
export class UserInfo implements TUserInfo {
  @Field()
  gender: ModelGender

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
