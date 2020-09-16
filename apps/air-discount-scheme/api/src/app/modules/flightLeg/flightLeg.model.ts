import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Flight } from '../flight'

@ObjectType()
export class FlightLeg {
  @Field((_1) => ID)
  id: string

  @Field()
  airline: string

  @Field()
  financialState: string

  @Field()
  travel: string

  @Field()
  originalPrice: number

  @Field()
  discountPrice: number

  @Field((_1) => Flight)
  flight: Flight
}
