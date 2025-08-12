import type { ApiClientCallback } from '@island.is/api/domains/payment'
import type { CreateDirectGrantPaymentUrlInput } from './dto/createDirectGrantPaymentUrl.input'
import type { CreateMemorialCardPaymentUrlInput } from './dto/createMemorialCardPaymentUrl.input'

export type MemorialCardPaymentFlowMetadata =
  CreateMemorialCardPaymentUrlInput & {
    landspitaliType: 'memorialCard'
  }

export interface MemorialCardCallbackPayload
  extends Omit<ApiClientCallback, 'paymentFlowMetadata'> {
  paymentFlowMetadata: MemorialCardPaymentFlowMetadata
}

export type DirectGrantPaymentFlowMetadata =
  CreateDirectGrantPaymentUrlInput & {
    landspitaliType: 'directGrant'
  }

export interface DirectGrantCallbackPayload
  extends Omit<ApiClientCallback, 'paymentFlowMetadata'> {
  paymentFlowMetadata: DirectGrantPaymentFlowMetadata
}

export type PaymentCallbackPayload =
  | MemorialCardCallbackPayload
  | DirectGrantCallbackPayload
