export interface PaymentScheduleServiceOptions {
  xRoadBaseUrl: string
  xRoadProviderId: string
  xRoadClientId: string
  username: string
  password: string
}

export interface ConditionsResponse {
  conditions: {
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
  }
}

export const PAYMENT_SCHEDULE_OPTIONS = 'PAYMENT_SCHEDULE_OPTIONS'
