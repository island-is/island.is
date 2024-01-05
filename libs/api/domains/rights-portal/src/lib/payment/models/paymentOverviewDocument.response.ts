import { Field, ObjectType } from '@nestjs/graphql'
import { PaymentError } from './paymentError.model'
import { PaymentOverviewDocument } from './paymentOverviewDocument.model'

@ObjectType('RightsPortalPaymentOverviewDocumentResponse')
export class PaymentOverviewDocumentResponse {
  @Field(() => [PaymentOverviewDocument])
  items!: PaymentOverviewDocument[]

  @Field(() => [PaymentError])
  errors!: PaymentError[]
}
