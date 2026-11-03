import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

import { GooglePayChargeResponseStatusEnum } from '@island.is/clients/payments'

import { ChargeCardResponse } from './chargeCard.response'
import { VerifyCardResponse } from './verifyCard.response'

registerEnumType(GooglePayChargeResponseStatusEnum, {
  name: 'PaymentsGooglePayChargeStatus',
})

@ObjectType('PaymentsGooglePayChargeResponse')
export class GooglePayChargeResponse {
  @Field(() => GooglePayChargeResponseStatusEnum, {
    description:
      'paid: the card was charged. verification_required: a card saved in the Google account must pass 3-D Secure, then be charged with paymentsChargeGooglePayVerified and the same token.',
  })
  status!: GooglePayChargeResponseStatusEnum

  @Field(() => ChargeCardResponse, {
    nullable: true,
    description: 'The payment, when status is paid',
  })
  payment?: ChargeCardResponse

  @Field(() => VerifyCardResponse, {
    nullable: true,
    description:
      'The 3-D Secure verification, when status is verification_required',
  })
  verification?: VerifyCardResponse
}
