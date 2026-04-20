import { ObjectType, Field } from '@nestjs/graphql'
import { PaymentError } from './paymentError.model'
import { PaymentOverviewTotalsServiceType } from './paymentOverviewTotalsServiceType.model'

@ObjectType('RightsPortalPaymentOverviewTotalsServiceTypeResponse')
export class PaymentOverviewTotalsServiceTypeResponse {
  @Field(() => [PaymentOverviewTotalsServiceType])
  items!: PaymentOverviewTotalsServiceType[]

  @Field(() => [PaymentError])
  errors!: PaymentError[]
}
