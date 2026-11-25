import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import { GraphQLJSON } from 'graphql-type-json'
import {
  GetPaymentFlowDTOBankTransferPendingStatusEnum,
  GetPaymentFlowDTOLastBankTransferFailureEnum,
  GetPaymentFlowDTOPaymentStatusEnum,
  GetPaymentFlowDTOTypeEnum,
} from '@island.is/clients/payments'
import { PaymentFlowEvent } from './paymentFlowEvent.dto'

registerEnumType(GetPaymentFlowDTOPaymentStatusEnum, {
  name: 'PaymentsGetFlowPaymentStatus',
})

registerEnumType(GetPaymentFlowDTOLastBankTransferFailureEnum, {
  name: 'PaymentsBankTransferFailureReason',
})

registerEnumType(GetPaymentFlowDTOBankTransferPendingStatusEnum, {
  name: 'PaymentsBankTransferPendingStatus',
})

registerEnumType(GetPaymentFlowDTOTypeEnum, {
  name: 'PaymentsFlowType',
})

@ObjectType('PaymentsGetPaymentFlowResponse')
export class GetPaymentFlowResponse {
  @Field(() => ID)
  id!: string

  @Field(() => GetPaymentFlowDTOPaymentStatusEnum)
  paymentStatus!: GetPaymentFlowDTOPaymentStatusEnum

  @Field(() => String)
  productTitle!: string

  @Field(() => Number)
  productPrice!: number

  @Field(() => String, { nullable: true })
  existingInvoiceId?: string

  @Field(() => String)
  payerNationalId!: string

  @Field(() => String)
  payerName!: string

  @Field(() => [String])
  availablePaymentMethods!: string[]

  @Field(() => String)
  organisationId!: string

  @Field(() => GraphQLJSON, {
    nullable: true,
    description:
      'Arbitrary JSON data provided by the consuming service that will be returned on in callbacks (e.g. onSuccess, onUpdate). Example use case: the service that created the payment flow needs to pass some data that will be returned in the callback',
  })
  metadata?: object

  @Field(() => String, { nullable: true })
  returnUrl?: string

  @Field(() => String, { nullable: true })
  cancelUrl?: string

  @Field(() => Boolean, { nullable: true })
  redirectToReturnUrlOnSuccess?: boolean

  @Field(() => String, { nullable: true })
  invoiceReturnUrl?: string

  @Field(() => Boolean, { nullable: true })
  redirectOnInvoiceCreation?: boolean

  @Field(() => Date)
  updatedAt!: Date

  @Field(() => Boolean, {
    description:
      'True when the flow can no longer be paid and the payer has to start a new one, e.g. a debt flow whose settlement was rejected.',
  })
  isClosed!: boolean

  @Field(() => GetPaymentFlowDTOTypeEnum, {
    description:
      'charge: paying catalog charges. debt: paying debts owed to the state, the pay page shows its own title for these.',
  })
  type!: GetPaymentFlowDTOTypeEnum

  @Field(() => GetPaymentFlowDTOLastBankTransferFailureEnum, {
    nullable: true,
    description:
      'Populated only when paymentStatus is bank_transfer_failed. Reason the most recent bank-transfer attempt failed, so the FE can render a specific error message.',
  })
  lastBankTransferFailure?: GetPaymentFlowDTOLastBankTransferFailureEnum

  @Field(() => String, {
    nullable: true,
    description:
      'Populated only when paymentStatus is bank_transfer_pending. The provider SCA URL the user can return to in order to resume their in-flight attempt. Empty/null indicates back-channel SCA (no URL).',
  })
  bankTransferScaRedirectUrl?: string

  @Field(() => Date, {
    nullable: true,
    description:
      'Populated only when paymentStatus is bank_transfer_pending. Timestamp at which the in-flight attempt expires (matches the TTL we shared with Blikk on create). The FE polling loop derives its hard timeout from this.',
  })
  bankTransferExpiresAt?: Date

  @Field(() => GetPaymentFlowDTOBankTransferPendingStatusEnum, {
    nullable: true,
    description:
      'Populated only when paymentStatus is bank_transfer_pending. sca_required: the payer must complete SCA — render bankTransferScaRedirectUrl as a QR code (desktop) or deep link (mobile). processing: waiting for bank confirmation.',
  })
  bankTransferPendingStatus?: GetPaymentFlowDTOBankTransferPendingStatusEnum
}

@ObjectType('PaymentsGetPaymentFlowAdminResponse')
export class PaymentFlowAdminResponse extends GetPaymentFlowResponse {
  @Field(() => [PaymentFlowEvent], { nullable: true })
  events?: PaymentFlowEvent[]
}
