import type { ApiClientCallback } from '@island.is/api/domains/payment'

export enum LandspitaliPaymentType {
  MemorialCard = 'MemorialCard',
  DirectGrant = 'DirectGrant',
}

type WebLandspitaliCreateDirectGrantPaymentUrlInput = {
  amountISK: number
  grantChargeItemCode: string
  payerAddress: string
  payerEmail: string
  payerGrantExplanation: string
  payerName: string
  payerNationalId?: string
  payerPlace: string
  payerPostalCode: string
  project: string
}

export type WebLandspitaliCreateMemorialCardPaymentUrlInput = {
  amountISK: number
  fundChargeItemCode: string
  inMemoryOf: string
  payerAddress: string
  payerEmail: string
  payerName: string
  payerNationalId?: string
  payerPlace: string
  payerPostalCode: string
  recipientAddress: string
  recipientName: string
  recipientPlace: string
  recipientPostalCode: string
  senderSignature: string
}

export type MemorialCardPaymentFlowMetadata =
  WebLandspitaliCreateMemorialCardPaymentUrlInput & {
    landspitaliPaymentType: LandspitaliPaymentType.MemorialCard
  }

export interface MemorialCardCallbackPayload
  extends Omit<ApiClientCallback, 'paymentFlowMetadata'> {
  paymentFlowMetadata: MemorialCardPaymentFlowMetadata
}

export type DirectGrantPaymentFlowMetadata =
  WebLandspitaliCreateDirectGrantPaymentUrlInput & {
    landspitaliPaymentType: LandspitaliPaymentType.DirectGrant
  }

export interface DirectGrantCallbackPayload
  extends Omit<ApiClientCallback, 'paymentFlowMetadata'> {
  paymentFlowMetadata: DirectGrantPaymentFlowMetadata
}

export type PaymentCallbackPayload =
  | MemorialCardCallbackPayload
  | DirectGrantCallbackPayload
