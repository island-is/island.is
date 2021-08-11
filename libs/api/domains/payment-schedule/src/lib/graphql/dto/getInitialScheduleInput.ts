import { ScheduleType } from '@island.is/clients/payment-schedule'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetInitialScheduleInput {
  @Field(() => Number)
  totalAmount!: number

  @Field(() => Number)
  disposableIncome!: number

  @Field(() => ScheduleType)
  type!: ScheduleType
}
