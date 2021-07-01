export interface PaymentScheduleServiceOptions {
  xRoadBaseUrl: string
  xRoadProviderId: string
  xRoadClientId: string
  username: string
  password: string
}

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
}

export interface DebtSchedulesResponse {
  deptAndSchedules: DebtSchedules[]
}

export interface DebtSchedules {
  nationalId: string
  type: string
  paymentSchedule: string
  organization: string
  explanation: string
  totalAmount: number
  chargetypes: ChargeType[]
}

export interface ChargeType {
  id: string
  name: string
  principal: number
  intrest: number
  expenses: number
  total: number
}

export interface WageDeductionResponse {
  wagesDeduction: Employer
}

export interface Employer {
  employerNationalId: string
  employerName: string
}

export const PAYMENT_SCHEDULE_OPTIONS = 'PAYMENT_SCHEDULE_OPTIONS'
