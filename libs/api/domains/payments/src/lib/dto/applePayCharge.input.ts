import { Field, InputType } from '@nestjs/graphql'

@InputType('PaymentsApplePayPaymentHeader')
class ApplePayPaymentHeader {
  @Field(() => String)
  ephemeralPublicKey!: string

  @Field(() => String)
  publicKeyHash!: string

  @Field(() => String)
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

  @Field(() => String)
  transactionIdentifier!: string
}
