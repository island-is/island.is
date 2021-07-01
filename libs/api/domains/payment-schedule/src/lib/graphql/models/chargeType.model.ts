import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class PaymentScheduleChargeType {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => Number)
  principal!: number

  @Field(() => Number)
  intrest!: number

  @Field(() => Number)
  expenses!: number

  @Field(() => Number)
  total!: number
}
