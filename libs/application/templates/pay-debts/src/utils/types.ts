export type CustomerDebt = {
  chargeTypeId: string
  chargeTypeName: string
  dueDate: string
  finalDueDate: string
  debts: number
  chargeItemSubject: string
}

export type SelectedDebt = CustomerDebt & {
  amountToPay: number
}
