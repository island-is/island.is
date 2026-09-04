export type CustomerDebt = {
  chargeTypeId: string
  chargeTypeName: string
  dueDate: string
  finalDueDate: string
  debts: number
  chargeItemSubject: string
  timePeriod: string | string[]
}

export type SelectedDebt = CustomerDebt & {
  amountToPay: number
}
