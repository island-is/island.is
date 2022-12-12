import { Field, ObjectType, ID } from '@nestjs/graphql'

import { UserInfo as TUserInfo } from '@island.is/air-discount-scheme/types'
import { User } from './user.model'
import { FlightLeg } from './flightLeg.model'

@ObjectType('AirDiscountSchemeUserInfo')
export class UserInfo implements TUserInfo {
  @Field()
  gender!: 'kk' | 'kvk' | 'hvk'

  @Field()
  age!: number

  @Field()
  postalCode!: number
}

@ObjectType('AirDiscountSchemeFlight')
export class Flight {
  @Field((_) => ID)
  id!: string

  @Field()
  bookingDate!: Date

  @Field((_) => [FlightLeg])
  flightLegs!: FlightLeg[]

  @Field((_) => User)
  user!: User

  @Field((_) => UserInfo)
  userInfo!: UserInfo
}
