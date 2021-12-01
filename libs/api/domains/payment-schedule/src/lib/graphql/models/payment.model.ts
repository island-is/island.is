import { Field, ObjectType, GraphQLISODateTime } from '@nestjs/graphql'

@ObjectType()
export class PaymentSchedulePayment {
  @Field(() => GraphQLISODateTime)
  dueDate!: Date

  @Field(() => Number)
  payment!: number

  @Field(() => Number)
  accumulated!: number
}
