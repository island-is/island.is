export type Prerequisites = {
  maxDebt: number
  totalDebt: number
  disposableIncome: number
  alimony: number
  minimumPayment: number
  maxDebtOk: boolean
  maxDebtText: string
  taxesOk: boolean
  taxesText: string
  taxReturnsOk: boolean
  taxReturnsText: string
  vatOk: boolean
  vatText: string
  citOk: boolean
  citText: string
  accommodationTaxOk: boolean
  accommodationTaxText: string
  withholdingTaxOk: boolean
  withholdingTaxText: string
  wageReturnsOk: boolean
  wageReturnsText: string
}

export enum PaymentType {
  S = 'S',
  O = 'O',
  N = 'N',
  M = 'M',
}

export enum PaymentChargeType {
  AB = 'AB',
  BK = 'BK',
  DO = 'DO',
  OH = 'OH',
}

export type Payment = {
  id: string
  ssn: string
  type: PaymentType
  paymentSchedule: string
  organization: string
  totalAmount: number
  chargeTypes: {
    id: PaymentChargeType
    name: string
    principal: number
    interest: number
    expense: number
    total: number
  }[]
}
