import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql'

@ObjectType('IntellectualPropertiesAnnualFee')
export class AnnualFee {
  @Field(() => ID)
  id!: number

  @Field(() => GraphQLISODateTime, { nullable: true })
  paymentDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  paymentDueDate?: Date

  @Field({ nullable: true })
  amount?: string

  @Field({ nullable: true })
  payor?: string

  @Field()
  surcharge?: boolean
}
