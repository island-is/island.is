import { ObjectType, Field } from '@nestjs/graphql'
import { PaymentError } from './paymentError.model'
import { PaymentOverviewStatus } from './paymentOverviewStatus.model'

@ObjectType('RightsPortalPaymentOverviewStatusResponse')
export class PaymentOverviewStatusResponse {
  @Field(() => [PaymentOverviewStatus])
  items!: PaymentOverviewStatus[]

  @Field(() => [PaymentError])
  errors!: PaymentError[]
}
