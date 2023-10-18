import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('RightsPortalPaymentOverviewDocumentInput')
export class PaymentOverviewDocumentInput {
  @Field(() => Int)
  documentId!: number
}
