import { ObjectType, Field } from '@nestjs/graphql'
import { PaymentError } from './paymentError.model'
import { PaymentOverviewTotals } from './paymentOverviewTotals.model'

@ObjectType('RightsPortalPaymentOverviewTotalsResponse')
export class PaymentOverviewTotalsResponse {
  @Field(() => [PaymentOverviewTotals])
  items!: PaymentOverviewTotals[]

  @Field(() => [PaymentError])
  errors!: PaymentError[]
}

