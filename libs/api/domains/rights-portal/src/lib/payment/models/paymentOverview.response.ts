import { Field, ObjectType } from '@nestjs/graphql'
import { PaymentError } from './paymentError.model'
import { PaymentOverview } from './paymentOverview.model'

@ObjectType('RightsPortalPaymentOverviewResponse')
export class PaymentOverviewResponse {
  @Field(() => [PaymentOverview])
  items!: PaymentOverview[]

  @Field(() => [PaymentError])
  errors!: PaymentError[]
}
