import { Field, ObjectType, ID } from '@nestjs/graphql'

import { UserInfo as TUserInfo } from '@island.is/air-discount-scheme/types'
import { User } from '../user'

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
  airline: string

  @Field()
  bookingDate: string

  @Field()
  travel: string

  @Field((_1) => User)
  user: User

  @Field((_1) => UserInfo)
  userInfo: UserInfo
}
