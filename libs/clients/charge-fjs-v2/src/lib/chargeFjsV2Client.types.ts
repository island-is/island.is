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
  RRN: string
  cardType: string
  paymentMeans: PayInfoPaymentMeansEnum
  authCode: string
  PAN: string
  payableAmount: number
}

export interface ExtraData {
  name: string
  value: string
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
}

export enum PayInfoPaymentMeansEnum {
  Kreditkort = 'Kreditkort',
  Debetkort = 'Debetkort',
}
