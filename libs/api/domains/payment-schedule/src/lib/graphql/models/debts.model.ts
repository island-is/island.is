import { Field, ObjectType, ID } from '@nestjs/graphql'
import { PaymentScheduleChargeType } from './chargeType.model'

@ObjectType()
export class PaymentScheduleDebts {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  type!: string

  @Field(() => String)
  paymentSchedule!: string

  @Field(() => String)
  organization!: string

  @Field(() => String)
  explanation!: string

  @Field(() => Number)
  totalAmount!: number

  @Field(() => [PaymentScheduleChargeType])
  chargetypes!: PaymentScheduleChargeType[]
}
