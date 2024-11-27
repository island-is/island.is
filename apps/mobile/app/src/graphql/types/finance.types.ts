export interface GetFinanceStatus {
  timestamp: string
  principalTotals: number
  interestTotals: number
  costTotals: number
  statusTotals: number
  message: string
  organizations?: Organization[]
  downloadServiceURL: string
}

export interface Organization {
  id: string
  name: string
  type: string
  phone: string
  email: string
  homepage: string
  principalTotals: number
  interestTotals: number
  costTotals: number
  statusTotals: number
  dueStatusTotals: number
  chargeTypes?: ChargeType[]
}

export interface ChargeType {
  id: string
  name: string
  principal: number
  interest: number
  cost: number
  totals: number
  dueTotals: number
}
export interface GetDebtStatus {
  myDebtStatus?: MyDebtStatus[]
}

export interface MyDebtStatus {
  approvedSchedule?: number
  possibleToSchedule?: number
}

export interface GetFinanceStatusDetails {
  timestamp?: string
  chargeItemSubjects?: ChargeItemSubject[]
}

export interface ChargeItemSubject {
  chargeItemSubject: string
  timePeriod: string
  estimate: boolean
  dueDate: string
  finalDueDate: string
  principal: number
  interest: number
  cost: number
  paid: number
  totals: number
  dueTotals: number
  documentID: string
  payID: string
}
