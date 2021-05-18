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

export type Payment = {
  id: string
  ssn: string
  type: 'S' | 'O' | 'N' | 'M'
  paymentSchedule: string
  organization: string
  totalAmount: number
}