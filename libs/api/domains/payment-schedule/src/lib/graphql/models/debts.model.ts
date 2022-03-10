import { ScheduleType } from '@island.is/clients/payment-schedule'
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

import { PaymentScheduleCharge } from './chargeType.model'

registerEnumType(ScheduleType, {
  name: 'PaymentScheduleType',
  description: 'Possible types of schedules',
})

@ObjectType()
export class PaymentScheduleDebts {
  @Field(() => ID)
  nationalId!: string

  @Field(() => ScheduleType)
  type!: ScheduleType

  @Field(() => String)
  paymentSchedule!: string

  @Field(() => String)
  organization!: string

  @Field(() => String)
  explanation!: string

  @Field(() => Number)
  totalAmount!: number

  @Field(() => [PaymentScheduleCharge])
  chargetypes!: PaymentScheduleCharge[]
}
