import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Flight } from './flight.model'

@ObjectType()
export class FlightLeg {
  @Field((_) => ID)
  id!: string

  @Field()
  airline!: string

  @Field({ nullable: true })
  cooperation!: string

  @Field()
  financialState!: string

  @Field()
  travel!: string

  @Field()
  originalPrice!: number

  @Field()
  discountPrice!: number

  @Field((_) => Flight)
  flight!: Flight
}
