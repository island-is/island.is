import { ScheduleType } from '@island.is/clients/payment-schedule'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { PaymentSchedulePayment } from './payment.model'

@ObjectType()
export class PaymentScheduleDistribution {
  @Field((_) => ID)
  nationalId!: string

  @Field((_) => ScheduleType)
  scheduleType!: ScheduleType

  @Field((_) => [PaymentSchedulePayment])
  payments!: PaymentSchedulePayment[]
}
