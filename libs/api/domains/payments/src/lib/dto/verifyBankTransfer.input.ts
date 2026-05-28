import { Field, InputType } from '@nestjs/graphql'

/**
 * Resolves the active bank-transfer attempt by EITHER the payment-flow id (frontend polling target) OR
 * the provider's payment id (used by callback translation). Exactly one is expected; the backend
 * rejects empty / both-missing.
 */
@InputType('PaymentsVerifyBankTransferInput')
export class VerifyBankTransferInput {
  @Field(() => String, { nullable: true })
  paymentFlowId?: string

  @Field(() => String, { nullable: true })
  providerPaymentId?: string
}
