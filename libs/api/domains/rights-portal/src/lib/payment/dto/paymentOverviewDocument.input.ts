import { Field, InputType } from '@nestjs/graphql'

@InputType('RightsPortalOverviewDocumentInput')
export class PaymentOverviewDocumentInput {
  @Field(() => Number)
  documentId!: number
}
