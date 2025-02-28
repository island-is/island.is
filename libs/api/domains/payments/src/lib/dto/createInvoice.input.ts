import { Field, InputType } from '@nestjs/graphql'

@InputType('PaymentsCreateInvoiceInput')
export class CreateInvoiceInput {
  @Field((_) => String)
  paymentFlowId!: string
}
