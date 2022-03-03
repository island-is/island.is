import { Field, ID,ObjectType } from '@nestjs/graphql'

import { ScheduleType } from '@island.is/clients/payment-schedule'

@ObjectType()
export class PaymentScheduleInitialSchedule {
  @Field(() => ID)
  nationalId!: string

  @Field(() => ScheduleType)
  scheduleType!: ScheduleType

  @Field(() => Number)
  minPayment!: number

  @Field(() => Number)
  maxPayment!: number

  @Field(() => Number)
  minCountMonth!: number

  @Field(() => Number)
  maxCountMonth!: number
}
