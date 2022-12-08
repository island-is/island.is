import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Fund } from './fund.model'
import { FlightLeg } from './flightLeg.model'
import { Role } from '@island.is/air-discount-scheme/types'

@ObjectType()
export class User {
  @Field((_) => ID)
  nationalId!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  mobile?: string

  @Field(() => String, { defaultValue: 'user' })
  role?: Role

  @Field(() => Fund, { nullable: true })
  fund?: Fund

  @Field(() => Boolean, { defaultValue: false })
  meetsADSRequirements?: boolean

  @Field(() => [FlightLeg], { nullable: true })
  flightLegs?: FlightLeg[]
}
