import { ChargeType } from '@island.is/clients/payment-schedule'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(ChargeType, {
  name: 'PaymentScheduleChargeType',
  description: 'Possible types of charges',
})

@ObjectType()
export class PaymentScheduleCharge {
  @Field(() => String)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => Number)
  principal!: number

  @Field(() => Number)
  intrest!: number

  @Field(() => Number)
  expenses!: number

  @Field(() => Number)
  total!: number
}
