import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ShipRegistrySailorSeaServiceBookEntry {
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
}
