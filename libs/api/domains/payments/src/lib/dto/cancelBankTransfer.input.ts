import { Field, InputType } from '@nestjs/graphql'

@InputType('PaymentsCancelBankTransferInput')
export class CancelBankTransferInput {
  @Field(() => String)
  paymentFlowId!: string
}
