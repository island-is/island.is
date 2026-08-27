import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

import {
  GetPaymentFlowDTOBankTransferPendingStatusEnum,
  GetPaymentFlowDTOLastBankTransferFailureEnum,
  VerifyBankTransferResponseStatusEnum,
} from '@island.is/clients/payments'

registerEnumType(VerifyBankTransferResponseStatusEnum, {
  name: 'PaymentsBankTransferStatus',
})

@ObjectType('PaymentsVerifyBankTransferResponse')
export class VerifyBankTransferResponse {
  @Field(() => VerifyBankTransferResponseStatusEnum)
  status!: VerifyBankTransferResponseStatusEnum

  @Field(() => String, { nullable: true })
  message?: string

  @Field(() => GetPaymentFlowDTOBankTransferPendingStatusEnum, {
    nullable: true,
    description:
      'Pending sub-status. sca_required: the payer must complete SCA — render scaRedirectUrl as a QR code (desktop) or deep link (mobile). processing: waiting for bank confirmation.',
  })
  pendingStatus?: GetPaymentFlowDTOBankTransferPendingStatusEnum

  @Field(() => String, {
    nullable: true,
    description:
      'Fresh SCA URL from the provider — may only appear once the payment reaches sca_required (back-channel creates have none initially).',
  })
  scaRedirectUrl?: string

  @Field(() => GetPaymentFlowDTOLastBankTransferFailureEnum, {
    nullable: true,
    description:
      'Expiry-aware reason for a terminal failure (an ERROR past the attempt TTL is reported as "expired"); absent for non-failure statuses.',
  })
  failureReason?: GetPaymentFlowDTOLastBankTransferFailureEnum
}
