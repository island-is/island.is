import { Field, ObjectType, ID } from '@nestjs/graphql'

import {
  AirDiscount as TAirDiscount,
  DiscountedFlightLeg as TDiscountedFlightLeg,
} from '@island.is/air-discount-scheme/types'

@ObjectType('AirDiscountSchemeDiscountAirDiscount')
export class AirDiscount {
  @Field(() => ID)
  nationalId!: string

  @Field()
  code!: string

  @Field()
  active!: boolean

  @Field()
  isConnectionCode!: boolean

  @Field()
  explicit!: boolean

  @Field(() => String, { nullable: true })
  employeeId?: string

  @Field(() => String, { nullable: true })
  comment?: string

  @Field(() => String, { nullable: true })
  validUntil?: string

  @Field(() => String, { nullable: true })
  usedAt?: string

  @Field()
  hasReturnFlight!: boolean
}

@ObjectType('AirDiscountSchemeDiscountFlightLeg')
export class DiscountedFlightLeg {
  @Field()
  origin!: string

  @Field()
  destination!: string
}

@ObjectType('AirDiscountSchemeDiscountFlight')
export class DiscountedFlight {
  @Field(() => ID)
  discountId!: string

  @Field(() => AirDiscount)
  discount!: TAirDiscount

  @Field(() => [DiscountedFlightLeg])
  flightLegs!: TDiscountedFlightLeg[]

  @Field()
  isConnectionFlight!: boolean

  @Field(() => String, { nullable: true })
  usedAt?: string
}
