import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql'

import {
  Travel as TTravel,
  RangeInput,
  PeriodInput,
  FlightLegsInput as TFlightLegsInput,
} from '@island.is/air-discount-scheme/types'
import {
  FlightLegGender,
  FlightLegState,
} from '@island.is/clients/air-discount-scheme'

registerEnumType(FlightLegState, { name: 'AirDiscountSchemeFlightLegState' })
registerEnumType(FlightLegGender, { name: 'AirDiscountSchemeFlightLegGender' })

@InputType('AirDiscountSchemeTravelInput')
class Travel implements TTravel {
  @Field({ nullable: true })
  from?: string

  @Field({ nullable: true })
  to?: string
}

@InputType('AirDiscountSchemePeriodInput')
class Period implements PeriodInput {
  @Field()
  from!: Date

  @Field()
  to!: Date
}

@InputType('AirDiscountSchemeRangeInput')
class Range implements RangeInput {
  @Field((_) => Int)
  from!: number

  @Field((_) => Int)
  to!: number
}

@InputType('AirDiscountSchemeFlightLegsInput')
export class FlightLegsInput implements TFlightLegsInput {
  @Field((_) => String, { nullable: true })
  airline?: string

  @Field((_) => Travel, { nullable: true })
  flightLeg?: Travel

  @Field((_) => Period)
  period!: Period

  @Field((_) => [FlightLegState], { nullable: true })
  state?: FlightLegState[]

  @Field((_) => Range)
  age!: Range

  @Field((_) => FlightLegGender, { nullable: true })
  gender?: FlightLegGender

  @Field((_) => Int, { nullable: true })
  postalCode?: number

  @Field((_) => String, { nullable: true })
  nationalId?: string

  @Field((_) => Boolean, { nullable: true })
  isExplicit?: boolean
}
