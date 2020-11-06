export type Period = {
  startDate: string
  endDate: string
  ratio: number
}

export interface Payment {
  date: string
  tax: number
  pensionContribution: number
  amount: number
}
