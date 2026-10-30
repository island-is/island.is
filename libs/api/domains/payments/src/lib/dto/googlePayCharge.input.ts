import { Field, InputType } from '@nestjs/graphql'

import { VerifyCardBrowserInfoInput } from './verifyCard.input'

@InputType('PaymentsGooglePayChargeVerifiedInput')
export class GooglePayChargeVerifiedInput {
  @Field(() => String)
  paymentFlowId!: string

  @Field(() => String, {
    description:
      'The paymentMethodData.tokenizationData.token string from Google Pay, forwarded unmodified',
  })
  token!: string
}

@InputType('PaymentsGooglePayChargeInput')
export class GooglePayChargeInput extends GooglePayChargeVerifiedInput {
  @Field(() => String, {
    nullable: true,
    description:
      'Name from the Google Pay billing address, used for 3-D Secure authentication of a saved card',
  })
  cardholderName?: string

  @Field(() => VerifyCardBrowserInfoInput, {
    nullable: true,
    description:
      'Browser environment of the payer, used for 3-D Secure authentication of a saved card',
  })
  browserInfo?: VerifyCardBrowserInfoInput
}
