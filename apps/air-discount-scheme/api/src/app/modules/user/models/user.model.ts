import { Field, ID,ObjectType } from '@nestjs/graphql'

import { Role } from '@island.is/air-discount-scheme/types'

import { FlightLeg } from '../../flightLeg'

import { Fund } from './fund.model'

@ObjectType()
export class User {
  @Field((_1) => ID)
  nationalId: string

  @Field()
  name: string

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
