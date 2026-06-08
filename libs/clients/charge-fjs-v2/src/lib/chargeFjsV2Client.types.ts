import { PayInfoPaymentMeansEnum } from '../../gen/fetch'

// Single source of truth for payment means (Kreditkort / Debetkort / Milli) is the generated model,
// which tracks the FJS OpenAPI spec. Re-exported so consumers keep importing it from this client.
export { PayInfoPaymentMeansEnum }

export interface Charge {
  systemID: string
  performingOrgID: string
  payeeNationalID: string
  chargeType: string
  chargeItemSubject: string
  performerNationalID: string
  immediateProcess: boolean
  returnUrl: string
  requestID: string
  effictiveDate?: string
  comment?: string
  charges: ChargeItem[]
  payInfo?: PayInfo
  extraData?: Array<ExtraData>
}

export type ChargeToValidate = Omit<
  Charge,
  'immediateProcess' | 'returnUrl' | 'payInfo'
>

export interface ChargeResponse {
  user4: string
  receptionID: string
}

interface ChargeItem {
  chargeItemCode: string
  quantity: number
  priceAmount: number
  amount: number
  reference: string
}

interface PayInfoBase {
  /**
   * Reference for the payment. For card payments this is the acquirer reference (RRN); for a bank
   * transfer it carries the provider payment id so FJS can reconcile against the provider. Required.
   */
  RRN: string
  payableAmount: number
  /** Internal per-attempt id, threaded through for FJS↔our-system reconciliation. */
  correlationId?: string
}

/** Card payments (Kreditkort / Debetkort) carry the card-only fields. */
interface CardPayInfo extends PayInfoBase {
  paymentMeans:
    | PayInfoPaymentMeansEnum.Kreditkort
    | PayInfoPaymentMeansEnum.Debetkort
  cardType: string
  authCode: string
  PAN: string
}

/** Bank transfer (Milli) — no card fields. */
interface BankTransferPayInfo extends PayInfoBase {
  paymentMeans: PayInfoPaymentMeansEnum.Milli
}

// Discriminated on `paymentMeans` so card charges must carry the card fields and a bank transfer
// cannot set them. FJS keeps every field optional; this is a stricter authoring contract on our side.
type PayInfo = CardPayInfo | BankTransferPayInfo

export interface ExtraData {
  name: string
  value: string
}

export interface BasicChargeItem {
  code: string
  quantity?: number
}

export interface Catalog {
  item: CatalogItem[]
}

export interface CatalogItem {
  performingOrgID: string
  chargeType: string
  chargeItemCode: string
  chargeItemName: string
  priceAmount: number
  quantity?: number
  paymentOptions?: string[]
}

export interface PayeeInfo {
  nationalId: string
  name: string
  address: string
  zip: string
  city: string
}
