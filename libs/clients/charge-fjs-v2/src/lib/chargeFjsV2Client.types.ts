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

interface PayInfo {
  /**
   * Reference for the payment. For card payments this is the acquirer reference (RRN); for a bank
   * transfer it carries the provider payment id so FJS can reconcile against the provider.
   */
  RRN?: string
  /** Card-only — present only when `paymentMeans` is a card type. */
  cardType?: string
  paymentMeans: PayInfoPaymentMeansEnum
  /** Card-only — present only when `paymentMeans` is a card type. */
  authCode?: string
  /** Card-only — present only when `paymentMeans` is a card type. */
  PAN?: string
  payableAmount: number
}

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

export enum PayInfoPaymentMeansEnum {
  Kreditkort = 'Kreditkort',
  Debetkort = 'Debetkort',
  /**
   * Bank transfer. Requires the FJS backend to (1) accept this `paymentMeans` value on a paid charge and
   * (2) treat the card-only `payInfo` fields (`cardType`/`authCode`/`PAN`/`RRN`) as optional for it.
   * The generated client (`gen/fetch/models/PayInfo.ts`) must be regenerated once FJS ships the matching
   * OpenAPI change. Exact string is pending FJS confirmation.
   */
  Millifaersla = 'Millifærsla',
}
export interface PayeeInfo {
  nationalId: string
  name: string
  address: string
  zip: string
  city: string
}
