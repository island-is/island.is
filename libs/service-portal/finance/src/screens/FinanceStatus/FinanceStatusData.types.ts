export type FinanceStatusOrganizationChargeType = {
  id: string
  name: string
  principal: number
  interest: number
  cost: number
  totals: number
  dueTotals: number
}

export type FinanceStatusOrganizationType = {
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
  chargeTypes: Array<FinanceStatusOrganizationChargeType>
}

export type FinanceStatusDataType = {
  message?: string
  timestamp: string
  principalTotals: number
  interestTotals: number
  costTotals: number
  statusTotals: number
  organizations: Array<FinanceStatusOrganizationType>
  downloadServiceURL: string
}

export type FinanceStatusDetailsChangeItem = {
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
  documentID?: string
  payID?: string
}

export type FinanceStatusDetailsType = {
  timestamp: string
  chargeItemSubjects: Array<FinanceStatusDetailsChangeItem>
}
