import type { ApiClientCallback } from '@island.is/api/domains/payment'
import type { CreateDirectGrantPaymentUrlInput } from './dto/createDirectGrantPaymentUrl.input'
import type { CreateMemorialCardPaymentUrlInput } from './dto/createMemorialCardPaymentUrl.input'

export enum PaymentType {
  MemorialCard = 'LandspitaliMemorialCard',
  DirectGrant = 'LandspitaliDirectGrant',
}

export type MemorialCardPaymentFlowMetadata = Omit<
  CreateMemorialCardPaymentUrlInput,
  'locale'
> & {
  paymentFlowType: PaymentType.MemorialCard
}

export interface MemorialCardCallbackPayload
  extends Omit<ApiClientCallback, 'paymentFlowMetadata'> {
  paymentFlowMetadata: MemorialCardPaymentFlowMetadata
}

export type DirectGrantPaymentFlowMetadata = Omit<
  CreateDirectGrantPaymentUrlInput,
  'locale'
> & {
  paymentFlowType: PaymentType.DirectGrant
}

export interface DirectGrantCallbackPayload
  extends Omit<ApiClientCallback, 'paymentFlowMetadata'> {
  paymentFlowMetadata: DirectGrantPaymentFlowMetadata
}

export type PaymentCallbackPayload =
  | MemorialCardCallbackPayload
  | DirectGrantCallbackPayload
