import { Field, InputType } from '@nestjs/graphql'

import { ScheduleType } from '@island.is/clients/payment-schedule'

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
