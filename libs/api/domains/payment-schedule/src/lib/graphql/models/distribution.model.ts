import { Field, ID,ObjectType } from '@nestjs/graphql'

import { ScheduleType } from '@island.is/clients/payment-schedule'

import { PaymentSchedulePayment } from './payment.model'

@ObjectType()
export class PaymentScheduleDistribution {
  @Field(() => ID)
  nationalId!: string

  @Field(() => ScheduleType)
  scheduleType!: ScheduleType

  @Field(() => [PaymentSchedulePayment])
  payments!: PaymentSchedulePayment[]
}
