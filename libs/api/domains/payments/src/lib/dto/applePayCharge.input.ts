import { Field, InputType } from '@nestjs/graphql'

@InputType('PaymentsApplePayPaymentHeader')
class ApplePayPaymentHeader {
  @Field(() => String)
  ephemeralPublicKey!: string

  @Field(() => String)
  publicKeyHash!: string

  @Field(() => String)
  transactionId!: string
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

@InputType('PaymentsApplePayPaymentMethod')
class ApplePayPaymentMethod {
  @Field(() => String)
  displayName!: string

  @Field(() => String)
  network!: string
}

@InputType('PaymentsApplePayChargeInput')
export class ApplePayChargeInput {
  @Field(() => String)
  paymentFlowId!: string

  @Field(() => Number)
  amount!: number

  @Field(() => ApplePayPaymentData)
  paymentData!: ApplePayPaymentData

  @Field(() => ApplePayPaymentMethod)
  paymentMethod!: ApplePayPaymentMethod

  @Field(() => String)
  transactionIdentifier!: string
}
