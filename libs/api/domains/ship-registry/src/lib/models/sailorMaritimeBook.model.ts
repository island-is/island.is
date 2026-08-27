import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ShipRegistrySailorMaritimeBook {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  type?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateFrom?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTo?: Date
}
