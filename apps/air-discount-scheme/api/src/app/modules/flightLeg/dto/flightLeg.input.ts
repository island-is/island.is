import { Field, InputType, Int } from '@nestjs/graphql'

import {
  Travel as TTravel,
  RangeInput,
  PeriodInput,
  FlightLegsInput as TFlightLegsInput,
} from '@island.is/air-discount-scheme/types'

@InputType()
class Travel implements TTravel {
  @Field({ nullable: true })
  from: string

  @Field({ nullable: true })
  to: string
}

@InputType()
class Period implements PeriodInput {
  @Field()
  from: Date

  @Field()
  to: Date
}

@InputType()
class Range implements RangeInput {
  @Field((_) => Int, { nullable: true })
  from: number

  @Field((_) => Int, { nullable: true })
  to: number
}

@InputType()
export class FlightLegsInput implements TFlightLegsInput {
  @Field((_) => String, { nullable: true })
  airline: string

  @Field((_) => Travel, { nullable: true })
  flightLeg: Travel

  @Field((_) => Period, { nullable: true })
  period: Period

  @Field((_) => [String], { nullable: true })
  state: string[]

  @Field((_) => Range, { nullable: true })
  age: Range

  @Field((_) => String, { nullable: true })
  gender: 'kk' | 'kvk'

  @Field((_) => Int, { nullable: true })
  postalCode: number
}
