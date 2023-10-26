import { Field, ObjectType } from '@nestjs/graphql'
import { PaymentError } from './paymentError.model'
import { PaymentOverviewBill } from './paymentOverviewBill.model'

@ObjectType('RightsPortalPaymentOverviewBillResponse')
export class PaymentOverviewBillResponse {
  @Field(() => [PaymentOverviewBill])
  items!: PaymentOverviewBill[]

  @Field(() => [PaymentError])
  errors!: PaymentError[]
}
