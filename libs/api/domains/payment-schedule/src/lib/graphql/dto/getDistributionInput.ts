import { ScheduleType } from '@island.is/clients/payment-schedule'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetScheduleDistributionInput {
  @Field(() => Number, { nullable: true })
  monthAmount?: number

  @Field(() => Number, { nullable: true })
  monthCount?: number

  @Field(() => ScheduleType)
  scheduleType!: ScheduleType

  @Field(() => Number)
  totalAmount!: number
}
