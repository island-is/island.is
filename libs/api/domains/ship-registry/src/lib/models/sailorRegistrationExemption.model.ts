import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ShipRegistrySailorRegistrationExemption {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  shipRegistrationNo?: string

  @Field()
  shipName!: string

  @Field({ nullable: true })
  rank?: string

  @Field({
    nullable: true,
    description: 'TODO: clarify meaning with domain expert',
  })
  advertised?: string

  @Field({
    nullable: true,
    description: 'TODO: clarify meaning with domain expert',
  })
  exemptionLowerStatus?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateFrom?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTo?: Date

  @Field(() => Int, { nullable: true })
  numberOfDays?: number
}
