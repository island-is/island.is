import { ScheduleType } from '@island.is/clients/payment-schedule'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetScheduleDistributionInput {
  @Field((_) => Number, { nullable: true })
  monthAmount?: number

  @Field((_) => Number, { nullable: true })
  monthCount?: number

  @Field((_) => ScheduleType)
  scheduleType!: ScheduleType

  @Field((_) => Number)
  totalAmount!: number
}
