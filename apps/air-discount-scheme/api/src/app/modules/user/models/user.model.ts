import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Fund } from './fund.model'
import { FlightLeg } from '../../flightLeg'
import { Role } from '../../auth'

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
