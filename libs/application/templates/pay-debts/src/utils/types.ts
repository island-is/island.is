export type CustomerDebt = {
  payID: string
  chargeTypeId: string
  chargeTypeName: string
  dueDate: string
  finalDueDate: string
  principal: number
  interest: number
  cost: number
  debts: number
  chargeItemSubject: string
  timePeriod: string
}

export type SelectedDebt = CustomerDebt & {
  amountToPay: number
}
