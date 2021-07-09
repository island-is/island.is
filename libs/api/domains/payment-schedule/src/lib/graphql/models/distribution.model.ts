import { ScheduleType } from '@island.is/clients/payment-schedule'
import { Field, ObjectType, ID } from '@nestjs/graphql'
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
