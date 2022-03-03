import { Field, InputType } from '@nestjs/graphql'

import { ScheduleType } from '@island.is/clients/payment-schedule'

@InputType()
export class GetInitialScheduleInput {
  @Field(() => Number)
  totalAmount!: number

  @Field(() => Number)
  disposableIncome!: number

  @Field(() => ScheduleType)
  type!: ScheduleType
}
