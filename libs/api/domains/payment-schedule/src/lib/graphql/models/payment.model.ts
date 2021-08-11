import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class PaymentSchedulePayment {
  @Field(() => ID)
  dueDate!: Date

  @Field(() => Number)
  payment!: number

  @Field(() => Number)
  accumulated!: number
}
