import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ShipRegistrySailorSeaServiceEntry {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  shipName?: string

  @Field({ nullable: true })
  shipRegistrationNumber?: string

  @Field({ nullable: true })
  rank?: string

  @Field({ nullable: true })
  rankCode?: string

  @Field({ nullable: true })
  startDate?: string

  @Field({ nullable: true })
  endDate?: string

  @Field({ nullable: true })
  numberOfDays?: number
}
