import { ScheduleType } from '@island.is/clients/payment-schedule'
import { Field, ObjectType, ID } from '@nestjs/graphql'

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
