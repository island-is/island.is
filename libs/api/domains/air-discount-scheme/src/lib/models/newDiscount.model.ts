import { Field, ObjectType, ID } from '@nestjs/graphql'

import { User } from './user.model'
import { DiscountedFlight as TDiscountedFlight } from '@island.is/air-discount-scheme/types'
import { DiscountedFlight } from './newDiscountFlight.model'

@ObjectType('AirDiscountSchemeNewDiscount')
export class NewDiscount {
  @Field(() => ID)
  nationalId!: string

  @Field(() => [DiscountedFlight])
  discountedFlights!: TDiscountedFlight[]

  @Field()
  active!: boolean

  @Field(() => String, { nullable: true })
  usedAt?: string

  @Field(() => User)
  user!: User
}
