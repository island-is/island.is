import { ScheduleType } from '@island.is/clients/payment-schedule'
import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class PaymentScheduleInitialSchedule {
  @Field(() => ID)
  nationalId!: string

  @Field(() => ScheduleType)
  scheduleType!: ScheduleType

  @Field((_) => Number)
  minPayment!: number

  @Field((_) => Number)
  maxPayment!: number

  @Field((_) => Number)
  minCountMonth!: number

  @Field((_) => Number)
  maxCountMonth!: number
}
