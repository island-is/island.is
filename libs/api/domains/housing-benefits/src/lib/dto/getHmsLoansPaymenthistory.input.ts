import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql'

@InputType()
export class HousingBenefitsPaymentsInput {
  @Field(() => GraphQLISODateTime, { nullable: true })
  dateFrom?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTo?: Date

  @Field(() => Int, { nullable: true })
  pageNumber?: number

  @Field(() => Int, { nullable: true })
  pageSize?: number

  @Field(() => Int, { nullable: true })
  paymentOrigin?: number

  @Field({ nullable: true })
  month?: string

  @Field({
    defaultValue: false,
    description: "False display's all. True display payments only",
  })
  payments!: boolean
}
