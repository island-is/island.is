import { Field, InputType } from '@nestjs/graphql'

/** Provide exactly one of paymentFlowId or providerPaymentId. */
@InputType('PaymentsVerifyBankTransferInput')
export class VerifyBankTransferInput {
  @Field(() => String, { nullable: true })
  paymentFlowId?: string

  @Field(() => String, { nullable: true })
  providerPaymentId?: string
}
