import { ScheduleType } from '@island.is/clients/payment-schedule'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetInitialScheduleInput {
  @Field((_) => Number)
  totalAmount!: number

  @Field((_) => Number)
  disposableIncome!: number

  @Field((_) => ScheduleType)
  type!: ScheduleType
}
