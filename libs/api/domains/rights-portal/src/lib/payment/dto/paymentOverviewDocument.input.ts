import { Field, InputType } from '@nestjs/graphql'

@InputType('RightsPortalPaymentOverviewDocumentInput')
export class PaymentOverviewDocumentInput {
  @Field(() => Number)
  documentId!: number
}
