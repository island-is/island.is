export interface ConditionsResponse {
  conditions: Conditions
}

export interface Conditions {
  nationalId: string
  maxDebtAmount: number
  totalDebtAmount: number
  minPayment: number
  maxPayment: number
  collectionActions: boolean
  doNotOwe: boolean
  maxDebt: boolean
  oweTaxes: boolean
  disposableIncome: number
  taxReturns: boolean
  vatReturns: boolean
  citReturns: boolean
  accommodationTaxReturns: boolean
  withholdingTaxReturns: boolean
  wageReturns: boolean
  alimony: number
  minWagePayment: number
  percent: number
}
