import type { ApiClientCallback } from '@island.is/api/domains/payment'
import type {
  WebLandspitaliCreateMemorialCardPaymentUrlInput,
  WebLandspitaliCreateDirectGrantPaymentUrlInput,
} from '@island.is/api/schema'

export enum LandspitaliPaymentType {
  MemorialCard = 'MemorialCard',
  DirectGrant = 'DirectGrant',
}

export type MemorialCardPaymentFlowMetadata = Omit<
  WebLandspitaliCreateMemorialCardPaymentUrlInput,
  'locale'
> & {
  landspitaliPaymentType: LandspitaliPaymentType.MemorialCard
}

export interface MemorialCardCallbackPayload
  extends Omit<ApiClientCallback, 'paymentFlowMetadata'> {
  paymentFlowMetadata: MemorialCardPaymentFlowMetadata
}

export type DirectGrantPaymentFlowMetadata = Omit<
  WebLandspitaliCreateDirectGrantPaymentUrlInput,
  'locale'
> & {
  landspitaliPaymentType: LandspitaliPaymentType.DirectGrant
}

export interface DirectGrantCallbackPayload
  extends Omit<ApiClientCallback, 'paymentFlowMetadata'> {
  paymentFlowMetadata: DirectGrantPaymentFlowMetadata
}

export type PaymentCallbackPayload =
  | MemorialCardCallbackPayload
  | DirectGrantCallbackPayload
