import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { ShipRegistryValueUnit } from './valueUnit.model'

/** A record of the sailor being legally registered as a crew member on a specific vessel (lögskráning). */
@ObjectType()
export class ShipRegistrySailorCrewRegistration {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  shipName?: string

  @Field({ nullable: true })
  shipRegistrationNumber?: string

  @Field({ nullable: true })
  rank?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate?: Date

  @Field(() => Int, { nullable: true })
  numberOfDays?: number

  @Field(() => ShipRegistryValueUnit, { nullable: true })
  length?: ShipRegistryValueUnit

  @Field(() => ShipRegistryValueUnit, { nullable: true })
  grossTonnage?: ShipRegistryValueUnit

  @Field(() => ShipRegistryValueUnit, { nullable: true })
  mainEngine?: ShipRegistryValueUnit
}
