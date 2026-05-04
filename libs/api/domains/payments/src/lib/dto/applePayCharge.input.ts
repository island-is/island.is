import { Field, InputType } from '@nestjs/graphql'

@InputType('PaymentsApplePayPaymentHeader')
class ApplePayPaymentHeader {
  @Field(() => String)
  ephemeralPublicKey!: string

  @Field(() => String)
  publicKeyHash!: string

  @Field(() => String, {
    description:
      'Apple Pay device transaction id: exactly 64 hex chars (32 bytes).',
  })
  transactionId!: string

  @Field(() => String, { nullable: true })
  applicationData?: string
}

@InputType('PaymentsApplePayPaymentData')
class ApplePayPaymentData {
  @Field(() => String)
  version!: string

  @Field(() => String)
  data!: string

  @Field(() => String)
  signature!: string

  @Field(() => ApplePayPaymentHeader)
  header!: ApplePayPaymentHeader
}

@InputType('PaymentsApplePayChargeInput')
export class ApplePayChargeInput {
  @Field(() => String)
  paymentFlowId!: string

  @Field(() => ApplePayPaymentData)
  paymentData!: ApplePayPaymentData

  @Field(() => String, {
    description:
      'Apple Pay transaction identifier: exactly 64 hex chars (32 bytes). Used as a replay-protection cache key.',
  })
  transactionIdentifier!: string
}
