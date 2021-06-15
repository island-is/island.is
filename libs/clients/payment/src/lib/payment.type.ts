export interface PaymentServiceOptions {
  url: string
  username: string
  password: string
}

export interface BaseCharge {
  performingOrgID: string
  payeeNationalID: string
  chargeType: string
  performerNationalID: string
  charges: ChargeItem[]
}

export interface Charge extends BaseCharge {
  chargeItemSubject: string
  immediateProcess: boolean
  systemID: string
  payInfo?: PayInfo
  returnUrl: string
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
  RRN?: string
  cardType?: string
  paymentMeans?: string
  authCode?: string
  PAN?: string
  payableAmount?: number
}

export interface Catalog {
  item: Item[]
}

export interface Item {
  performingOrgID: string
  chargeType: string
  chargeItemCode: string
  chargeItemName: string
  priceAmount: number
}
