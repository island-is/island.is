import { Field, ObjectType } from '@nestjs/graphql'
import { CopaymentBill } from './copaymentBill.model'
import { PaymentError } from './paymentError.model'

@ObjectType('RightsPortalCopaymentBillResponse')
export class CopaymentBillResponse {
  @Field(() => [CopaymentBill])
  items!: CopaymentBill[]

  @Field(() => [PaymentError])
  errors!: PaymentError[]
}
